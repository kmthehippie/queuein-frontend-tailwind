import React, { useState } from "react";

const StaffManagement = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [password, setPassword] = useState("");
  return (
    <div>
      <div className="">All staff details</div>
      <div className="">
        <button>Create New Staff</button>
      </div>
      <div className="">
        Modal for creating new staff
        <form>
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
            <div className={``}>
              <label htmlFor="email" className={labelClass}>
                Staff Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={inputClass(!!emailErr)} // Use the function
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="email"
                required
              />
            </div>
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
            <div className={``}>
              <label htmlFor="password" className={labelClass}>
                Staff Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your owner password"
                className={inputClass(!!passwordError)} // Use the function
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoComplete="password"
                required
              />
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
                autoComplete="password"
                required
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffManagement;
