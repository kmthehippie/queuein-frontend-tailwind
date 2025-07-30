import React from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout, accountId } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logging out!");
    logout();
  };
  const handleNavigateHome = () => {
    navigate(`/db/${accountId}/outlets/all`);
  };
  return (
    <div className="pt-15 md:pt-3 md:absolute md:top-1/5 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/5 ">
      <div className=" bg-white/70 rounded-2xl md:p-20 text-center m-10 p-10 relative">
        <div className="">
          <p
            className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
            onClick={handleNavigateHome}
          >
            X
          </p>
          <h1 className="font-extralight text-3xl mb-8">Logout</h1>
          <p>Are you sure you would like to logout?</p>
          <div className="mt-5">
            <button
              className="text-white p-2 mr-5 bg-primary-green rounded-lg cursor-pointer"
              onClick={handleNavigateHome}
            >
              Back to Home
            </button>
            <button
              className="text-white p-2 bg-primary-green rounded-lg cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
