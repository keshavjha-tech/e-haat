import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";


function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newpassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setFormData((prev)=>{
        return{
            ...prev,
            email : location?.state?.email
        }
      });
    }
  }, []);

    const [visibility, setVisibility] = useState({
      newPassword: false,
      confirmNewPassword: false,
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
  const passwordsMatch = formData.newpassword === formData.confirmNewPassword;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance({
        ...summaryApi.reset_password,
        data: formData,
      });

      if (response.data.error) {
        toast.error(response.data.message);        
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        navigate('/login')
      }
      // console.log("response", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };


  return (
     <section className="container w-full mx-auto px-4 items-center mt-23  ">
      <div className="bg-Sapphire-Blue my-5 w-full max-w-lg mx-auto rounded-2xl p-4 ">
        <p className="text-white flex items-center justify-center mt-10 text-2xl font-bold">
          Reset Password!
        </p>

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
            <label htmlFor="newPassword" className="text-white font-bold ml-4">
              New Password
            </label>
            <div className="relative bg-linen rounded-full mx-5 focus:outline-none">
              <input
                type={visibility.password ? "text" : "password"}
                id="newPassword"
                className="rounded-full w-full py-2 px-4 focus:outline-none"
                name="newpassword"
                value={formData.newpassword}
                onChange={changeHandler}
                placeholder="Enter Your New Password"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("newPassword")}
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
              htmlFor="confirmNewPassword"
              className="text-white font-bold ml-4"
            >
              Confirm New Password
            </label>
            <div className="relative bg-linen rounded-full mx-5 focus:outline-none">
              <input
                type={visibility.confirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                className="bg-linen rounded-full w-full py-2 px-4  focus:outline-none"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={changeHandler}
                placeholder="Confirm New Password"
              />

              <button
                type="button"
                onClick={() => toggleVisibility("confirmNewPassword")}
                className="absolute inset-y-0 right-3 flex items-center text-Sapphire-Blue"
              >
                {visibility.confirmNewPassword ? (
                  <HiEyeOff className="size-5 text-base-content/40" />
                ) : (
                  <HiEye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={!allFieldsFilled}
            className={`border rounded-full py-2.5 mx-7  font-semibold mt-8  tracking-wide cursor-pointer active:scale-95 active:shadow-inner transition-transform duration-100 ease-in-out
                ${
                  allFieldsFilled
                    ? "bg-sand text-black"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
          >
            Reset Password
          </button>
        </form>
        {/* <p className="text-linen mt-2 mb-10 mx-30">
          Already have an account? <NavLink to={"/login"}>
          <span className="text-sand font-bold underline">Login</span></NavLink>
        </p> */}
      </div>
    </section>
  )
}

export default ResetPasswordPage;
