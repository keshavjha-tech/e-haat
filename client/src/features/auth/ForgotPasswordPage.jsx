import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import summaryApi from "../../api/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({email: ""});
  const navigate = useNavigate();

 

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const allFieldsFilled = Object.values(formData).every((item) => item);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance({
        ...summaryApi.forgot_password,
        data: formData,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
         navigate("/otp-verification",{
          state : formData
        });
        setFormData({
          email: ""
        });
       
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="container w-full mx-auto px-4 items-center mt-23  ">
      <div className="bg-Sapphire-Blue my-5 w-full max-w-lg mx-auto rounded-2xl p-4 ">
        <p className="text-white flex items-center ml-4 mt-10 text-3xl font-jockey font-bold">
          Forgot Password
        </p>
        <span className="text-white flex items-center ml-4 mt-2 mb-8 font-sans text-sm">
         Don’t worry! It happens. <br />Please enter your email address — we’ll send an OTP to it.
        </span>

        <form onSubmit={submitHandler} className="mt-6 grid gap-4 text-lg">
          {/* email */}
          <div className="grid gap-2">
            <label htmlFor="email" className="text-white font-bold ml-4">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-linen rounded-full py-2 px-4 mx-5 focus:outline-none"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              placeholder="Enter Your Email"
            />
          </div>


          <button
            disabled={!allFieldsFilled}
            className={`border rounded-full py-2.5 font-semibold mt-4 mb-9 mx-7  tracking-wider cursor-pointer active:scale-95 active:shadow-inner transition-transform duration-100 ease-in-out
                ${
                  allFieldsFilled
                    ? "bg-sand text-black"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
          >
            Continue
          </button>
        </form>
        
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
