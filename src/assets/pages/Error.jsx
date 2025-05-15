import React from "react";
import { Link } from "react-router-dom";

const Error = ({ error }) => {
  console.log(error);
  const statusCode = error?.status;
  const errorMessage = error?.message;

  return (
    <div className="flex h-full">
      <Link to="/">
        <div className="absolute flex top-3 left-3 w-15 z-10 m-3 cursor-pointer lg:hidden">
          <img src="/Q-logo.svg" alt="Queue In Logo" className="" />
        </div>
      </Link>
      <div className="flex-1/3  h-full hidden lg:flex justify-center items-center">
        <Link to="/">
          <img src="/Q-logo.svg" alt="Queue In Logo" className="p-12" />
        </Link>
      </div>
      <div className="flex-2/3 flex items-center justify-center">
        <div className="bg-white/50 p-10 rounded-xl shadow-md w-4/5 xl:w-3/4">
          <div className="flex-row items-center justify-center xl:p-15 ">
            <h1 className="text-5xl font-bold tracking-wide">Oh Shucks!</h1>
            <h3 className="text-3xl text-stone-600 pb-2 ">
              Something went wrong.
            </h3>
            <div className="text-stone-600 mt-4 ">
              <p>
                {statusCode ? `${statusCode} Error` : "Unexpected Error"}
                {" : "}
                <span>
                  {errorMessage
                    ? `${errorMessage}`
                    : "Not quite sure what went wrong"}{" "}
                </span>
              </p>

              <p className="text-primary-green hover:text-primary-dark-green transition ease-in">
                <Link to="/">Head back to our home page.</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
