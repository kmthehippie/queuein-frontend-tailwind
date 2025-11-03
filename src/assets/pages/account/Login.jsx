import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import {
  errorClass,
  checkBoxClass,
  primaryButtonClass as buttonClass,
  labelClass,
  primaryInputClass,
  primaryBgTransparentClass,
  primaryTextClass,
} from "../../styles/tailwind_styles";

const Login = () => {
  const { login, isAuthenticated, accountId } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rmbDevice, setRmbDevice] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState(""); // Add state for email error
  const [errors, setErrors] = useState(""); // Changed from errors to generalError
  const [capslockOn, setCapslockOn] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass = (
    hasError // Changed inputClass to be a function
  ) =>
    `${primaryInputClass}
  ${hasError ? "border-red-500" : ""}`; // Apply red border if there's an error

  const linkClass = `text-primary-green hover:text-primary-dark-green transition ease-in`;
  const handleCheckCapsLock = (e) => {
    setCapslockOn(e.getModifierState("CapsLock"));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setEmailError("");
    setPasswordError("");

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
      setLoading(true);
      const res = await apiPrivate.post("/login", {
        ...credentials,
      });

      if (
        res.status === 201 &&
        res.data.accessToken &&
        res.data.accountId &&
        res.data.businessType &&
        res.data.acctSlug
      ) {
        const data = res?.data;
        const auth = await login(data);
        if (auth) {
          setLoading(false);
        }
        setErrors("");
      } else {
        console.error("Unexpected success response:", res.data);
        setErrors({
          general:
            "Login successful, but unable to redirect. Please try again.",
        });
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessage = err.response.data.errors[0].msg;
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      } else if (typeof err.response?.data?.message === "string") {
        errorMessage = err.response.data.message;
      }
      setErrors(errorMessage);
      setLoading(false);
      console.error("Axios error: ", err);
    }
  };

  const testNavigate = async () => {
    const credentials = {
      email: "general@nlbh.com",
      password: "123123",
      rememberDevice: false,
    };
    try {
      const res = await apiPrivate.post("/login", {
        ...credentials,
      });
      setLoading(true);
      console.log("Response after post to login: ", res?.data, res?.status);

      if (
        res.status === 201 &&
        res.data.accessToken &&
        res.data.accountId &&
        res.data.businessType &&
        res.data.acctSlug
      ) {
        console.log("This is after checking", res.data);
        const data = res?.data;
        await login(data);
        setErrors("");
      } else {
        console.error("Unexpected success response:", res.data);
        setErrors({
          general:
            "Login successful, but unable to redirect. Please try again.",
        });
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessage = err.response.data.errors[0].msg;
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      } else if (typeof err.response?.data?.message === "string") {
        errorMessage = err.response.data.message;
      }
      setErrors(errorMessage);
      console.error("Axios error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavOutletsAll = () => {
    navigate(`/db/${accountId}/outlets/all`);
  };
  const handleViewTesting = () => {
    setTesting(!testing);
  };
  if (loading) {
    return (
      <Loading title={"Login"} paragraph={"Please wait while we log you in"} />
    );
  }
  return (
    <div className="flex h-full">
      <div className="flex-1/3  h-full hidden lg:flex justify-center items-center">
        <img src="/Q-logo.svg" alt="Queue In Logo" className="p-12" />
      </div>
      <div className="flex-2/3 flex items-center justify-center">
        <div
          className={`${primaryBgTransparentClass} p-10 rounded-xl shadow-md w-4/5 xl:w-3/4`}
        >
          <h1
            className={`text-3xl font-semibold mb-2 font-poppins ${primaryTextClass}`}
          >
            Welcome back!
          </h1>
          <small className={`block mb-4 ${primaryTextClass}`}>
            Enter your credentials to access your account.
          </small>
          {isAuthenticated && !testing && !loading && (
            <div
              className={`flex flex-col mb-4 ${primaryBgTransparentClass} hover:shadow-2xl p-2 rounded-lg shadow-md items-center`}
            >
              <h2 className="text-primary-green font-semibold text-sm mb-2">
                You are still logged in
              </h2>
              <p
                className={`italic ${primaryTextClass} font-light text-xs text-center`}
              >
                Would you like to head back to your home page?
              </p>
              <button
                className={`${buttonClass} mt-3`}
                onClick={handleNavOutletsAll}
              >
                Yes
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="" onClick={handleViewTesting}>
              <h1 className="text-xs font-semibold mb-3 text-primary-green hover:text-primary-dark-green">
                <i className="fa-solid fa-circle-info text-primary-light-green"></i>{" "}
                Just testing?
              </h1>
            </div>
          )}
          {testing && (
            <div
              className={`block mb-4 text-sm ${primaryBgTransparentClass} hover:shadow-2xl p-4 rounded-lg shadow-md m-1`}
            >
              <button onClick={testNavigate}> Click to enter test page </button>
            </div>
          )}
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
                onKeyUp={handleCheckCapsLock}
                autoComplete="password"
              />
              {capslockOn && (
                <div className="text-xs text-red-700">Your CAPSLOCK is on.</div>
              )}
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
                className={`ms-2 text-sm font-medium ${primaryTextClass}`}
              >
                Remember this device
              </label>
            </div>
            {errors && <p className={errorClass}>{errors}</p>}{" "}
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
