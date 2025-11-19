import React from "react";
import { useParams } from "react-router-dom";
import { primaryBgClass } from "../styles/tailwind_styles";

const LeaveQueue = () => {
  const { acctSlug, queueId } = useParams();
  const subject = `Left ${acctSlug} using ${queueId} `;
  const emailAddress = import.meta.env.VITE_FEEDBACK_EMAIL_ADDRESS;
  return (
    <div
      className={`flex flex-col items-center justify-center lg:max-w-[300px] mx-auto p-5 ${primaryBgClass} text-stone-700 dark:text-white`}
    >
      <div className="font-light max-w-xl mx-auto">
        <h1 className="font-extralight text-4xl mt-10 text-center">
          Sorry you had to leave the queue!
        </h1>
      </div>
      <div className="mt-8 max-w-lg p-6 bg-gradient-to-br from-primary-cream/80 to-primary-cream/60 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl mx-5 lg:mx-1 text-center">
        <p className="my-4 font-light text-center text-lg">
          I hope to make the app better for your usage. Please leave me a
          feedback.
        </p>
        <a
          href={`mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`}
        >
          <div className="font-light text-primary-cream bg-primary-dark-green px-5 py-2">
            {emailAddress}
          </div>
        </a>
      </div>
    </div>
  );
};

export default LeaveQueue;
