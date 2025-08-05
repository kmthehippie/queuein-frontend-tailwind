import React from "react";
import { useNavigate } from "react-router-dom";

const QRCode = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    console.log("Navigate to qr code page");
  };
  return (
    <div
      className="p-2 text-sm font-light text-gray-500 border-1 border-primary-light-green hover:border-primary-green hover:text-primary-dark-green transition ease-in text-center  cursor-pointer my-3  bg-primary-cream"
      onClick={handleNavigate}
    >
      <p> Click to view QR Code</p>
    </div>
  );
};

export default QRCode;
