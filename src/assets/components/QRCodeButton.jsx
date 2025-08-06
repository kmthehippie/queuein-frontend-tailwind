import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const QRCodeButton = ({ value, text, cssSpan, cssDiv }) => {
  const navigate = useNavigate();
  const { accountId } = useAuth();
  const handleNavigate = () => {
    console.log("Navigate to qr code page", value);
    navigate(
      `/db/${accountId}/outlets/qr/${value}`,
      { replace: true },
      { state: { outletId: { value } } }
    );
  };
  return (
    <div className={cssDiv} onClick={handleNavigate}>
      <span className={cssSpan}>
        <i className="fa-solid fa-qrcode pr-2"></i>
      </span>
      {text}
    </div>
  );
};

export default QRCodeButton;
