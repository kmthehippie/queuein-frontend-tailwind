// NavButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  primaryBgClass,
  primaryBgTransparentClass,
} from "../styles/tailwind_styles";

const NavButton = ({ text, path }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(path);
  };

  return (
    <button
      className={`text-primary-green ${primaryBgTransparentClass} hover:text-primary-light-green italic font-semibold px-4 py-1 `}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default NavButton;
