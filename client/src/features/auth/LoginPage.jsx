import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import summaryApi from "../../api/summaryApi";
import AxiosToastError from "../../api/AxiosToastError";
import fetchUserDeatil from "../../api/fetchUserDetail";
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
      const res = await axiosInstance({
        ...summaryApi.login,
        data: formData,
       
      },
    {
      withCredentials: true
    });

      if (res.data.error) {
        toast.error(res.data.message);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        

       const userData = await fetchUserDeatil();
       dispatch(setUser(userData))
      //  console.log('from login', userData)
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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-Sapphire-Blue via-blue-900 to-Sapphire-Blue rounded-3xl shadow-2xl overflow-hidden border border-blue-800/20">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 px-6 pt-8 pb-6">
            <h1 className="text-white text-4xl sm:text-5xl font-jockey font-bold mb-2">
              Welcome Back!
            </h1>
            <p className="text-blue-100 text-sm sm:text-base font-sans">
              Login to continue your shopping journey
            </p>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-8 py-6">
            <form onSubmit={submitHandler} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white font-semibold text-sm sm:text-base ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-linen/90 hover:bg-linen focus:bg-white rounded-xl py-3 px-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sand/50 transition-all duration-200 shadow-sm"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white font-semibold text-sm sm:text-base ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={visibility.password ? "text" : "password"}
                    id="password"
                    className="w-full bg-linen/90 hover:bg-linen focus:bg-white rounded-xl py-3 px-5 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sand/50 transition-all duration-200 shadow-sm"
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("password")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-Sapphire-Blue hover:text-blue-800 transition-colors"
                  >
                    {visibility.password ? (
                      <HiEyeOff className="size-5" />
                    ) : (
                      <HiEye className="size-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-linen hover:text-sand text-sm font-medium transition-colors underline-offset-2 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!allFieldsFilled}
                className={`w-full rounded-xl py-3.5 font-semibold text-base tracking-wide transition-all duration-200 transform ${
                  allFieldsFilled
                    ? "bg-gradient-to-r from-sand to-amber-200 text-black hover:from-amber-200 hover:to-sand shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-linen text-sm sm:text-base">
                Don't have an account?{" "}
                <NavLink 
                  to="/register"
                  className="text-sand font-bold hover:text-amber-200 underline underline-offset-2 transition-colors"
                >
                  Register Now
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
