import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
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

  const submitHandler = (e) =>{
   e.preventDefault();

   if(password !== confirmPassword){
    
   }
  }

  return (
    <section className="container w-full mx-auto px-4 items-center ">
      <div className="bg-Sapphire-Blue my-5 w-full max-w-lg mx-auto rounded-2xl p-4">
        <p className="text-white flex items-center justify-center mt-10 text-2xl font-bold">
          Create Account!
        </p>

        <form onSubmit={submitHandler} className="mt-6 grid gap-4 text-lg">
          {/* Name */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-white font-bold ml-4">
              Name
            </label>
            <input
              type="text"
              id="name"
              autoFocus
              className="bg-linen rounded-full py-2 px-4 mx-5 focus:outline-none"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              placeholder="Enter Your Name"
            />
          </div>

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
          </div>

          {/* confirm password */}
          <div className="grid gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-white font-bold ml-4"
            >
              Confirm Password
            </label>
            <div className="relative bg-linen rounded-full mx-5 focus:outline-none">
              <input
                type={visibility.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="bg-linen rounded-full w-full py-2 px-4  focus:outline-none"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={changeHandler}
                placeholder="Confirm Password"
              />

              <button
                type="button"
                onClick={() => toggleVisibility("confirmPassword")}
                className="absolute inset-y-0 right-3 flex items-center text-Sapphire-Blue"
              >
                {visibility.confirmPassword ? (
                  <HiEyeOff className="size-5 text-base-content/40" />
                ) : (
                  <HiEye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button className="border rounded-full bg-sand py-3 font-semibold my-8  text-black mb-10 tracking-wider">
            Create Account
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
