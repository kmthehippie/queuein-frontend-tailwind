import React from "react";
import {
  primaryBgClass,
  primaryButtonClass,
  primaryTextClass,
} from "../styles/tailwind_styles";

const NotificationModal = ({
  title,
  paragraph,
  onClose,
  content,
  classNameDiv,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 `}
    >
      <div
        className={`flex flex-col items-center ${primaryBgClass} ${primaryTextClass} p-10 rounded-3xl m-2 ${classNameDiv} max-w-lg`}
      >
        <h1 className="text-2xl font-extralight text-center">{title}</h1>
        <p className=" mt-3 font-bold text-center">{paragraph}</p>
        {content}
        <button className={primaryButtonClass} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
