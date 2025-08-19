import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const buttonClass = `bg-primary-green mt-3 hover:bg-primary-dark-green w-auto transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;

  const handleNavNLBH = () => {
    navigate("/nasi-lemak-burung-hantu");
  };

  const handleNavRegister = () => {
    navigate("/db/register");
  };
  const handleNavLogin = () => {
    navigate("db/login");
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center ">
        <h1 className="font-extralight text-5xl mt-10">WELCOME</h1>
        <div className="flex">
          <i className="fa-solid fa-screwdriver text-[150px] mt-10 text-primary-dark-green"></i>{" "}
          <i className="fa-solid fa-hammer text-[150px] mt-10 text-primary-dark-green rotate-y-180"></i>
        </div>
        <p className="mt-10 font-extralight italic text-2xl">
          Don't mind the mess, this page is still under development!
        </p>
        <div className="mt-10 text-center font-light bg-primary-cream/70 border-1 border-primary-green p-6 rounded-xl">
          <p>
            Want to have a look at the customer POV?
            <br />
            This is a sample page that your customers would be looking at
            <button className={buttonClass} onClick={handleNavNLBH}>
              Sample Customer View
            </button>
          </p>
          <img
            src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1755579717/QueueIn/QRCode/4d714b9b-c2de-4987-b82f-b5cc8aab16b9-qr-1.png"
            alt="Sample QR Code for Desa Sri Hartamas NLBH"
            className=""
          />
          <p>
            Head on over to register:{" "}
            <button className={buttonClass} onClick={handleNavRegister}>
              Register
            </button>
          </p>

          <p>
            {" "}
            Or, if you already have an account, please login:{" "}
            <button className={buttonClass} onClick={handleNavLogin}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
