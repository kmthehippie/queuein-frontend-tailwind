import React from "react";

const NotificationModal = ({ title, paragraph, onClose, content }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="flex flex-col items-center bg-primary-cream p-10 rounded-3xl m-2">
        <h1 className="text-2xl font-extralight text-center">{title}</h1>
        <p className="mt-3 font-bold">{paragraph}</p>
        {content}
        <button
          className={`mt-3 transition ease-in text-white bg-primary-green cursor-pointer font-light py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline min-w-20`}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
