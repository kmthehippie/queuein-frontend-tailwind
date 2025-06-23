import React, { useEffect, useState } from "react";

const Toast = ({ id, content, type, duration, sticky, close }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sticky) {
      setIsVisible(true);
    } else {
      //make sure duration is in MS
      const timer = setTimeout(() => setIsVisible(true), duration);
      return () => clearTimeout(timer);
    }
  }, []);

  //Temporary Type Classes
  const typeClasses = {
    info: "bg-primary-green/90",
    success: "bg-green-500 border-green-600",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-500 border-yellow-600 text-gray-800",
  };
  const baseClasses = `
  p-4 rounded-lg // Added shadow and top border for distinction
  text-white font-medium
  flex items-start justify-between gap-4 // Use items-start for better alignment with longer content
  transition-all duration-300 ease-out // For smooth entry/exit
  max-w-xs w-full pointer-events-auto // Allows clicks on the toast itself
`;
  const animationClasses = isVisible
    ? "opacity-100 translate-y-full"
    : "opacity-0 translate-y-0";

  return (
    <div
      className={`${baseClasses} ${
        typeClasses[type] || typeClasses.info
      } ${animationClasses}`}
      key={id}
    >
      {typeof content === "string" ? (
        <p className="flex-grow">{content}</p>
      ) : (
        <div className="flex-grow">
          {typeof content === "function" ? content({ close }) : content}
        </div>
      )}
      <button
        className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold"
        onClick={close}
      >
        {"\u274C"}
      </button>
    </div>
  );
};

export default Toast;
