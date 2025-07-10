import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import summaryApi from "../utils/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";

function OtpVerificationPage() {
  const [formData, setFormData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([])

  //   const changeHandler = (e) => {
  //     const { name, value } = e.target;

  //     setFormData((prev) => {
  //       return {
  //         ...prev,
  //         [name]: value,
  //       };
  //     });
  //   };

  const allFieldsFilled = formData.every((item) => item);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance({
        ...summaryApi.otp_verification,
        data: {
          otp : formData.join("")
        }
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData(["", "", "", "", "", ""]);
        // navigate("/otp-verification");
      }
    } catch (error) {
      AxiosToastError(error);
    }
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
          {/* email */}
          <div className="grid gap-2">
            <label htmlFor="otp" className="text-white font-bold ml-4">
              Enter the OTP
            </label>
            <div className="flex justify-between gap-2 sm:gap-1">
              {formData.map((item, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    ref={(ref)=>{
                      inputRef.current[index]
                      return ref
                    }}
                    value={formData[index]}
                    
                    onChange={(e)=>{
                      const value = e.target.value;

                      console.log("value", value)

                      const newFormData = [...formData]
                      newFormData[index] = value
                      setFormData(newFormData)

                      if(value && index <5){
                        inputRef.current[index+1].focus()
                      }
                    }}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="otp"
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
