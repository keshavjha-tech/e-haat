import React, { useEffect, useRef, useState } from "react";
import { data, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import summaryApi from "../../api/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";

function OtpVerificationPage() {
  const [formData, setFormData] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    if(!location?.state?.email){
      navigate("/forgot-password")
    }
  },[])

  const allFieldsFilled = formData.every((item) => item);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance({
        ...summaryApi.otp_verification,
        data: {
          otp: formData.join(""),
          email : location?.state?.email,
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData(["", "", "", "", "", ""]);
        navigate("/reset-password",{
          state : {
            data : response.data,
            email : location?.state?.email,
          }
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const changeHandler = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...formData];
    updated[index] = value;
    setFormData(updated);

    if (value && index < formData.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !formData[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (paste.length === formData.length) {
      const updated = paste.split("").slice(0, formData.length);
      setFormData(updated);

      updated.forEach((val, i) => {
        if (inputRef.current[i]) {
          inputRef.current[i].value = val;
        }
      });
      inputRef.current[formData.length - 1]?.focus();
    }
    e.preventDefault();
  };

  return (
    <section className="container w-full mx-auto px-4 items-center mt-23  ">
      <div className="bg-Sapphire-Blue my-5 w-full max-w-lg mx-auto rounded-2xl p-4 ">
        <p className="text-white flex items-center ml-4 mt-10 text-3xl font-jockey font-bold">
          OTP Verification
        </p>
        {/* <span className="text-white flex items-center ml-6 mt-2 mb-8 font-sans text-sm">
         Please, enter your email address. You will receive a link to create a new password via email.
        </span> */}

        <form onSubmit={submitHandler} className="mt-6 grid gap-4 text-lg">
          <div className="grid gap-2">
            <label htmlFor="otp" className="text-white font-bold ml-4">
              Enter the OTP
            </label>

            <div className="flex justify-between gap-2 sm:gap-1">
              {formData.map((value, index) => {
                return (
                  <input
                    key={index}
                    // ref={(ref) => {
                    //   inputRef.current[index];
                    //   return ref;
                    // }}

                    ref={(el) => (inputRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={value}
                    id={`otp-${index}`}
                    aria-label={`OTP digit ${index + 1}`}
                    onChange={(e) => changeHandler(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    onPaste={handlePaste}
                    className="no-spinner text-center bg-linen w-full max-w-14 rounded py-2 px-4 mx-auto  focus:outline-none"
                  />
                );
              })}
            </div>
          </div>

          <button
            disabled={!allFieldsFilled}
            className={`border rounded-full py-2.5 font-semibold mt-4 mx-7  tracking-wider cursor-pointer active:scale-95 active:shadow-inner transition-transform duration-100 ease-in-out
                ${
                  allFieldsFilled
                    ? "bg-sand text-black"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
          >
            Verify
          </button>
        </form>
      </div>
    </section>
  );
}

export default OtpVerificationPage;
