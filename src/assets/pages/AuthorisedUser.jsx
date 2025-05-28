import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useApiPrivate from "../hooks/useApiPrivate";

const AuthorizedUser = ({
  onSuccess,
  onFailure,
  actionPurpose,
  minimumRole,
}) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState("");
  const params = useParams();
  const apiPrivate = useApiPrivate();

  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const inputClass = (hasError) =>
    `border-1 border-gray-300 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:bg-transparent peer active:bg-transparent 
    ${hasError ? "border-red-500" : ""}`;
  const buttonClass = `mt-3 transition ease-in text-white font-light bg-primary-green py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const errorClass = `text-red-600 text-center`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length === 0) {
      setNameError(true);
      setErrors({ general: "Error, name cannot be empty" });
      return;
    }
    if (password.length < 6) {
      setPasswordError(true);
      setErrors({ general: "Error with verification" });
      return;
    }

    try {
      const data = {
        name: name,
        password: password,
        actionPurpose: actionPurpose,
        minimumRole: minimumRole,
      };
      const res = await apiPrivate.post(
        `/authorisedRole/${params.accountId}`,
        data
      );
      if (res.status === 200) {
        onSuccess();
      } else {
        onFailure();
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      onFailure();
    }
  };
  return (
    <div>
      <h1 className="pb-1">This is a security measure.</h1>
      <p className="text-sm font-semibold pb-2">
        Please let us know who you are
      </p>
      <small className="text-xs font-light italic">
        The action which you intend to perform requires a security check.
      </small>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            type="name"
            placeholder="Enter your name"
            className={inputClass(!!nameError)} // Use the function
            onChange={(e) => {
              setName(e.target.value);
            }}
            autoComplete="name"
          />
          <small>Capitalization Matters!</small>
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
        </div>
        {errors && <p className={errorClass}>{errors.general}</p>}
        <button onClick={handleSubmit} className={buttonClass}>
          Verify
        </button>
      </form>
    </div>
  );
};

export default AuthorizedUser;
