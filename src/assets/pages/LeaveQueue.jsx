import React from "react";
import { useParams } from "react-router-dom";

const LeaveQueue = () => {
  const { acctSlug, queueItemId } = useParams();
  const subject = `Left ${acctSlug} using ${queueItemId} `;
  const emailAddress = import.meta.env.VITE_FEEDBACK_EMAIL_ADDRESS;
  return (
    <div>
      <div className="">
        <h1 className="font-extralight text-3xl text-primary-green">
          Sorry you had to leave the queue!
        </h1>
      </div>
      <p>
        We hope to do better next time. Please leave us a feedback as to what we
        can improve at.
      </p>
      <a
        href={`mailto:${emailAddress}@example.com?subject=${encodeURIComponent(
          subject
        )}`}
      >
        Email Us
      </a>
    </div>
  );
};

export default LeaveQueue;
