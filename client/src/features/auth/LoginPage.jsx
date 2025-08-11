import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import summaryApi from "../../api/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import fetchUserDeatil from "../utils/fetchUserDetail";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";


function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [visibility, setVisibility] = useState({
    password: false,
  });

  const toggleVisibility = (show) => {
    setVisibility((prev) => ({
      ...prev,
      [show]: !prev[show],
    }));
  };

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
        ...summaryApi.login,
        data: formData,
       
      },
    {
      withCredentials: true
    });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accessToken', response.data.data.accessToken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)

       const userData = await fetchUserDeatil();
       dispatch(setUser(userData))
       console.log('from login', userData)
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="container w-full mx-auto px-4 items-center mt-23  ">
      <div className="bg-Sapphire-Blue my-5 w-full max-w-lg mx-auto rounded-2xl p-4 ">
        <p className="text-white flex items-center ml-4 mt-10 text-3xl font-jockey font-bold">
          Welcome Back!
        </p>
        <span className="text-white flex items-center ml-6 mt-2 mb-8 font-sans text-sm">
          Login to continue
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

          {/* Password */}
          <div className="grid gap-2">
            <label htmlFor="password" className="text-white font-bold ml-4">
              Password
            </label>
            <div className="relative bg-linen rounded-full mx-5 focus:outline-none">
              <input
                type={visibility.password ? "text" : "password"}
                id="password"
                className="rounded-full w-full py-2 px-4 focus:outline-none"
                name="password"
                value={formData.password}
                onChange={changeHandler}
                placeholder="Enter Your Password"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("password")}
                className="absolute inset-y-0 right-3 flex items-center text-Sapphire-Blue"
              >
                {visibility.password ? (
                  <HiEyeOff className="size-5 text-base-content/40" />
                ) : (
                  <HiEye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
            <Link to={"/forgot-password"} className="text-linen ml-auto mr-3 px-2 py-1 text-sm">Forget Passowrd?</Link>
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
            Login
          </button>
        </form>
        <p className="text-linen mt-2 mb-10 mx-30">
          Don't have an account?{" "}
          <NavLink to={"/register"}>
            <span className="text-sand font-bold underline">Register</span>
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
