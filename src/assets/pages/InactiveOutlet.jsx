import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPrivate } from "../api/axios";
import moment from "moment";

const InactiveOutlet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [queueName, setQueueName] = useState("");

  //TAILWIND CLASSES
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const inputClass = `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:border-black peer active:border-black`;
  useEffect(() => {
    setQueueName(moment().format("llll"));
  }, []);

  const handleStartQueue = async (e) => {
    e.preventDefault();
    if (queueName.length === 0) {
      setQueueName(moment().format("llll"));
    }
    try {
      const data = {
        name: queueName,
      };
      console.log(data);
      const res = await apiPrivate.post(
        `newQueue/${params.accountId}/${params.outletId}`,
        data
      );
      console.log("Created new queue! ", res.data);
      if (res?.status === 201) {
        navigate(
          `/db/${params.accountId}/outlet/${params.outletId}/active/${res.data.id}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form className="bg-primary-cream p-3 rounded-2xl">
        <p className="text-lg font-light italic text-primary-dark-green">
          Let's start a new queue!
        </p>
        <label htmlFor="queue_name" className={labelClass}>
          Name of Queue
        </label>
        <input
          type="text"
          id="queue_name"
          value={queueName}
          onChange={(e) => setQueueName(e.target.value)}
          className={inputClass}
        />
        <button
          className={
            buttonClass +
            " bg-primary-green hover:bg-primary-dark-green mr-3 border-1 border-primary-light-green"
          }
          onClick={handleStartQueue}
        >
          Start Queue
        </button>
      </form>

      <div className="bg-primary-cream p-3 rounded-2xl mt-5">
        <p className="text-lg font-light italic text-primary-dark-green">
          Previous Queue Report
        </p>
      </div>
    </div>
  );
};

export default InactiveOutlet;
