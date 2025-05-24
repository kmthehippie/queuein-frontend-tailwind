import React, { useState } from "react";

const AuthorizedUser = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <h1>This is a security measure.</h1>
      <p>Please let us know who you are</p>
      <small>
        The action which you intend to perform requires a security check.
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
        {errors && <p className={errorClass}>{errors.general}</p>}{" "}
        {/* Show general error */}
        <button className={buttonClass}>Verify</button>
      </form>
    </div>
  );
};

export default AuthorizedUser;
