import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useAuth();

  //Tailwind Classes
  const activeButton = `bg-primary-light-green font-semibold `;
  const buttonClass = `bg-primary-cream py-2 text-sm cursor-pointer hover:bg-primary-light-green hover:text-white hover:px-6 transition delay-100 duration-300 ease-in-out px-4 `;

  const handleNavigateSettings = () => {
    navigate(`/db/${accountId}/settings`);
  };
  const handleNavigateOutlet = () => {
    navigate(`/db/${accountId}/settings/outlet`);
  };

  const handleNavigateAccount = () => {
    navigate(`/db/${accountId}/settings/account`);
  };

  const pathnameEndsWithSettings = location.pathname.endsWith("settings");
  const pathnameEndsWithAccount = location.pathname.endsWith("account");
  const pathnameEndsWithOutlet = location.pathname.endsWith("outlet");

  return (
    <div className="bg-primary-cream/80 mt-15 mx-3 p-3 lg:size-5/6 h-[75vh] lg:m-20 lg:p-5 rounded-3xl border border-primary-green ">
      <div className="lg:mt-3 flex justify-center">
        <button
          className="text-3xl lg:text-4xl font-bold text-center mb-3 cursor-pointer"
          onClick={handleNavigateSettings}
        >
          Settings
        </button>
      </div>
      <div className="flex">
        <div
          className={`${buttonClass}
            border-l-1 border-t-1 border-primary-light-green ${
              pathnameEndsWithAccount ? activeButton : ""
            } `}
          onClick={handleNavigateAccount}
        >
          Account
        </div>
        <div
          className={`${buttonClass} border-l-1 border-t-1  border-r-1 border-primary-light-green ${
            pathnameEndsWithOutlet ? activeButton : ""
          }`}
          onClick={handleNavigateOutlet}
        >
          Outlet
        </div>
      </div>

      {pathnameEndsWithSettings && (
        <div className="border-1 border-primary-light-green p-0 bg-primary-cream/80 overflow-y-scroll max-h-135">
          <h1>Something interesting here</h1>
        </div>
      )}

      {!pathnameEndsWithSettings && (
        <div className="border-1 p-0 border-primary-light-green bg-primary-cream/80">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Settings;
