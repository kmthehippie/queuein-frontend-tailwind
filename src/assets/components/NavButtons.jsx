// NavButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NavButton = ({ text, path }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(path);
  };

  return (
    <button
      className="text-primary-green bg-primary-cream/90 hover:text-primary-light-green italic font-semibold px-4 py-1"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default NavButton;
