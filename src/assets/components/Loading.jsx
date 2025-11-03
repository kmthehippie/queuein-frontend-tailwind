import React from "react";
import { primaryBgClass, primaryTextClass } from "../styles/tailwind_styles";

const Loading = ({ title, paragraph }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        className={`flex flex-col items-center ${primaryBgClass} ${primaryTextClass} p-10 rounded-3xl m-2`}
      >
        <h1 className="text-2xl font-light text-center">{title} is Loading</h1>
        <div className="h-15 w-15 rounded-full border-4 border-gray-300 border-t-primary-light-green animate-spin"></div>
        <p>{paragraph}</p>
      </div>
    </div>
  );
};

export default Loading;
