import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rmbDevice, setRmbDevice] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState(""); // Add state for email error
  const [errors, setErrors] = useState(""); // Changed from errors to generalError

  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const inputClass = (
    hasError // Changed inputClass to be a function
  ) =>
    `border-1 border-gray-300 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:bg-transparent peer active:bg-transparent 
  ${hasError ? "border-red-500" : ""}`; // Apply red border if there's an error
  const errorClass = `text-red-600 text-center`;
  const checkBoxClass = `w-6 h-6 rounded-lg accent-primary-green hover:accent-primary-light-green text-primary-green focus:ring-2 ring-primary-light-green border-primary-dark-green`;
  const buttonClass = `bg-primary-green mt-3 hover:bg-primary-dark-green w-full transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;
  const linkClass = `text-primary-green hover:text-primary-dark-green transition ease-in`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(""); // Clear general error on new submission
    setEmailError(""); // Clear email error
    setPasswordError(""); // Clear password error

    if (email.length === 0) {
      setEmailError("Invalid Credentials");
      return;
    }
    if (password.length === 0 || password.length < 6) {
      setPasswordError("Invalid Credentials");
      return;
    }

    const credentials = {
      email: email,
      password: password,
      rememberDevice: rmbDevice,
    };

    try {
      const res = await apiPrivate.post("/login", {
        credentials,
      });
      console.log("Response after post to login: ", res?.data);

      if (res.status === 201 && res.data.accessToken && res.data.accountId) {
        const accessToken = res.data?.accessToken;
        const accountId = res.data?.accountId;
        login(accessToken, accountId);
        setErrors({});
        setTimeout(() => {
          navigate(`/db/${accountId}/outlets/all`);
        }, 1500);
      } else {
        console.error("Unexpected success response:", res.data);
        setErrors({
          general:
            "Login successful, but unable to redirect. Please try again.",
        });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
      console.error("Axios error: ", err);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1/3  h-full hidden lg:flex justify-center items-center">
        <img src="/Q-logo.svg" alt="Queue In Logo" className="p-12" />
      </div>
      <div className="flex-2/3 flex items-center justify-center">
        <div className="bg-white/50 p-10 rounded-xl shadow-md w-4/5 xl:w-3/4">
          <h1 className="text-3xl font-semibold mb-2 font-poppins">
            Welcome back!
          </h1>
          <small className="block mb-4 text-gray-600">
            Enter your credentials to access your account.
          </small>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={inputClass(!!emailError)} // Use the function
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="email"
              />
              {emailError && <p className={errorClass}>{emailError}</p>}{" "}
              {/* Show email error */}
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={inputClass(!!passwordError)} // Use the function
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoComplete="password"
              />
              {passwordError && <p className={errorClass}>{passwordError}</p>}{" "}
              {/* Show password error */}
            </div>
            <div className="flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                className={checkBoxClass}
                onChange={() => {
                  setRmbDevice(!rmbDevice);
                }}
                checked={rmbDevice}
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-gray-600 "
              >
                Remember this device
              </label>
            </div>
            {errors && <p className={errorClass}>{errors.general}</p>}{" "}
            {/* Show general error */}
            <button className={buttonClass}>Sign In</button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/db/register" className={linkClass}>
              Sign Up !
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
