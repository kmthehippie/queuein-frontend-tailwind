import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiPrivate } from "../api/axios";
const Register = () => {
  //States
  const [companyName, setCompanyName] = useState("");
  const [companyNameErr, setCompanyNameErr] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyEmailErr, setCompanyEmailErr] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [passwordCompanyError, setPasswordCompanyError] = useState("");
  const [companyCfmPassword, setCompanyCfmPassword] = useState("");
  const [confirmCompanyPasswordError, setConfirmCompanyPasswordError] =
    useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerNameErr, setOwnerNameErr] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerEmailErr, setOwnerEmailErr] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerPasswordError, setOwnerPasswordError] = useState("");
  const [errors, setErrors] = useState("");
  const [emailSame, setEmailSame] = useState(false);
  const [passwordSame, setPasswordSame] = useState(false);
  const [capslockOn, setCapslockOn] = useState(false);
  //Use hooks imported
  const { login } = useAuth();
  const navigate = useNavigate();

  //Tailwind
  const hideClass = `hidden`;
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const inputClass = (hasError) =>
    `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:border-black peer active:border-black
  ${hasError ? "border-red-500" : ""}`;
  const errorClass = `text-red-600 text-center`;
  const checkBoxClass = `w-6 h-6 rounded-lg accent-primary-green hover:accent-primary-light-green text-primary-green focus:ring-2 ring-primary-light-green border-primary-dark-green`;
  const buttonClass = `bg-primary-green mt-3 hover:bg-primary-dark-green w-full transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;
  const linkClass = `text-primary-green hover:text-primary-dark-green transition ease-in`;

  useEffect(() => {
    if (emailSame) {
      setOwnerEmail(companyEmail);
    }
  }, [emailSame, companyEmail]);

  useEffect(() => {
    if (passwordSame) {
      setOwnerPassword(companyPassword);
    }
  }, [passwordSame, companyPassword]);

  const handleCheckCapsLock = (e) => {
    setCapslockOn(e.getModifierState("CapsLock"));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmCompanyPasswordError("");
    setPasswordCompanyError("");
    setCompanyEmailErr("");
    setOwnerEmailErr("");
    setCompanyNameErr("");
    setOwnerNameErr("");
    setOwnerPasswordError("");

    //Some validation
    if (companyEmail.length < 6) {
      setErrors({ general: "Email invalid" });
      setCompanyEmailErr(true);
      return;
    }
    if (ownerEmail.length < 6) {
      setErrors({ general: "Email invalid" });
      setOwnerEmailErr(true);
      return;
    }
    if (companyPassword !== companyCfmPassword) {
      setErrors({ general: "Passwords do not match" });
      setConfirmCompanyPasswordError(true);
      return;
    }
    if (companyPassword.length < 6) {
      setErrors({ general: "Invalid password" });
      setPasswordCompanyError(true);
      return;
    }
    if (companyName.length < 3) {
      setErrors({ general: "Invalid company name" });
      setCompanyNameErr(true);
      return;
    }
    if (ownerName.length === 0) {
      setErrors({ general: "Invalid owner name" });
      setOwnerNameErr(true);
      return;
    }
    if (ownerPassword.length < 6) {
      setErrors({ general: "Invalid password" });
      setOwnerPasswordError(true);
      return;
    }

    const accountInfo = {
      companyName: companyName,
      companyEmail: companyEmail,
      password: companyPassword,
    };

    if (
      !companyEmail ||
      !companyPassword ||
      !companyCfmPassword ||
      !ownerEmail ||
      !ownerPassword ||
      !ownerName
    ) {
      setErrors({ general: "Please fill out the required fields" });
      return;
    }

    const ownerInfo = {
      name: ownerName,
      email: ownerEmail,
      role: "OWNER",
      password: ownerPassword,
    };

    try {
      const res = await apiPrivate.post("/register", {
        accountInfo,
        ownerInfo,
      });
      if (res.status === 201 && res.data?.accessToken && res.data?.accountId) {
        const accessToken = res.data?.accessToken;
        const accountId = res.data?.accountId;
        login(accessToken, accountId);
        setErrors({});
        setTimeout(() => {
          navigate(`/db/${res.data.accountId}/outlets/all`);
        }, 1500);
      } else {
        console.error("Unexpected success response:", res.data);
        setErrors({
          general:
            "Registration successful, but unable to redirect. Please try again.",
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
      console.error("Axios error: ", err.response?.data.errors);
    }
  };
  return (
    <div className="flex h-full">
      <div className="flex-4/5 flex items-start my-10 justify-center overflow-auto ">
        <div className="bg-white/50 p-10 rounded-xl shadow-md w-4/5 flex-row md:pb-0 md:pt-5 min-h-full h-auto items-center justify-center">
          <h1 className="text-3xl font-semibold mb-2 font-poppins">
            Great Choice!
          </h1>
          <small className="block mb-4 text-gray-600">
            Enter your credentials to create your account.
          </small>
          <form onSubmit={handleSubmit} className="space-y-4 lg:flex lg:h-full">
            <div className="flex-row p-1">
              <div>
                <label htmlFor="company-name" className={labelClass}>
                  Company name
                </label>
                <input
                  id="company-name"
                  type="text"
                  placeholder="Enter your company name"
                  className={inputClass(!!companyNameErr)} // Use the function
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                  }}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="company-email" className={labelClass}>
                  Company Email
                </label>
                <input
                  id="company-email"
                  type="email"
                  placeholder="Enter your company email"
                  className={inputClass(!!companyEmailErr)} // Use the function
                  onChange={(e) => {
                    setCompanyEmail(e.target.value);
                  }}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="flex items-center m-2">
                <input
                  id="email-same-checkbox"
                  type="checkbox"
                  className={checkBoxClass}
                  onChange={() => {
                    setEmailSame(!emailSame);
                  }}
                  checked={emailSame}
                />
                <label
                  htmlFor="email-same-checkbox"
                  className="ms-2 text-xs font-light text-gray-600"
                >
                  Owner's email is the same as Company email
                </label>
              </div>

              <div>
                <label htmlFor="company-password" className={labelClass}>
                  Company Password
                </label>
                <input
                  id="company-password"
                  type="password"
                  placeholder="Enter your password"
                  className={inputClass(!!passwordCompanyError)} // Use the function
                  onChange={(e) => {
                    setCompanyPassword(e.target.value);
                  }}
                  onKeyUp={handleCheckCapsLock}
                  autoComplete="password"
                  required
                />
                {capslockOn && (
                  <div className="text-xs text-red-700">
                    Your CAPSLOCK is on.
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="cfm-company-password" className={labelClass}>
                  Confirm Company Password
                </label>
                <input
                  id="cfm-company-password"
                  type="password"
                  placeholder="Confirm Company password"
                  className={inputClass(!!confirmCompanyPasswordError)} // Use the function
                  onChange={(e) => {
                    setCompanyCfmPassword(e.target.value);
                  }}
                  onKeyUp={handleCheckCapsLock}
                  autoComplete="password"
                  required
                />
                {capslockOn && (
                  <div className="text-xs text-red-700">
                    Your CAPSLOCK is on.
                  </div>
                )}
              </div>
              <div className="flex items-center m-2">
                <input
                  id="password-same-checkbox"
                  type="checkbox"
                  className={checkBoxClass}
                  onChange={() => {
                    setPasswordSame(!passwordSame);
                  }}
                  checked={passwordSame}
                />
                <label
                  htmlFor="password-same-checkbox"
                  className="ms-2 text-xs font-light text-gray-600 "
                >
                  Owner's password is the same as Company password
                </label>
              </div>
            </div>
            <div className="flex-row p-1 ">
              <div>
                <label htmlFor="owner-name" className={labelClass}>
                  Owner Name
                </label>
                <input
                  id="owner-name"
                  type="text"
                  placeholder="Enter your Owner Name"
                  className={inputClass(ownerNameErr)} // Use the function
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                  }}
                  autoComplete="name"
                  required
                />
              </div>
              <div className={` ${emailSame ? hideClass : ""}`}>
                <label htmlFor="owner-email" className={labelClass}>
                  Owner Email
                </label>
                <input
                  id="owner-email"
                  type="email"
                  placeholder="Enter your Owner Email"
                  className={inputClass(!!ownerEmailErr)} // Use the function
                  onChange={(e) => {
                    setOwnerEmail(e.target.value);
                  }}
                  autoComplete="email"
                />
              </div>
              <div className={` ${passwordSame ? hideClass : ""}`}>
                <label htmlFor="owner-password" className={labelClass}>
                  Owner Password
                </label>
                <input
                  id="owner-password"
                  type="password"
                  placeholder="Enter your owner password"
                  className={inputClass(!!ownerPasswordError)} // Use the function
                  onChange={(e) => {
                    setOwnerPassword(e.target.value);
                  }}
                  onKeyUp={handleCheckCapsLock}
                  autoComplete="password"
                />
                {capslockOn && (
                  <div className="text-xs text-red-700">
                    Your CAPSLOCK is on.
                  </div>
                )}
              </div>
            </div>
          </form>
          {errors && <p className={errorClass}>{errors.general}</p>}
          <button type="button" className={buttonClass} onClick={handleSubmit}>
            Register
          </button>
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <Link to="/db/login" className={linkClass}>
              Sign In !
            </Link>
          </p>
        </div>
      </div>
      <div className="h-full hidden w-0 lg:flex md:w-2/5 justify-center items-center">
        <img src="/Q-logo.svg" alt="Queue In Logo" className="p-12" />
      </div>
    </div>
  );
};

export default Register;
