import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiPrivate } from "../api/axios";

const CreateCustomer = ({ setModal }) => {
  const params = useParams();
  const [customerName, setCustomerName] = useState("");
  const [number, setNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [customerPax, setCustomerPax] = useState(null);
  const [vip, setVIP] = useState(true);
  const [validationError, setValidationError] = useState("");

  const [warningDiffQueue, setWarningDiffQueue] = useState(false);
  const [warningDiffQueueInfo, setWarningDiffQueueInfo] = useState("");

  const errorClass = `text-red-600 text-center`;
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800 `;
  const inputClass = `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black
 `;
  const buttonClass = `bg-primary-green mt-3 hover:bg-primary-dark-green w-full transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;
  const checkBoxClass = `w-6 h-6 rounded-lg accent-primary-green hover:accent-primary-light-green text-primary-green focus:ring-2 ring-primary-light-green border-primary-dark-green`;

  //Helper function
  const extractNumerals = (numberString) => {
    return numberString.replace(/\D/g, "");
  };
  const validMalaysianNumber = (number) => {
    console.log("Inside validMalaysianNumber fn", number);
    const numeralsOnly = extractNumerals(number);
    const regex = /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/gm;
    return regex.test(numeralsOnly);
  };
  //1. form for customer post
  const handleSubmit = (e) => {
    e.preventDefault();
    //Validation
    if (customerName.length === 0) {
      return setValidationError({ general: "Please enter a name" });
    }
    const validNumber = validMalaysianNumber(number);
    if (validNumber) {
      const extractedNumber = extractNumerals(number);
      console.log("Is number valid: ", extractedNumber);
      setFormattedNumber(extractedNumber);
    } else {
      return setValidationError({
        general: "Please enter a valid Malaysian Phone Number",
      });
    }
    if (customerPax === 0 || customerPax === null) {
      return setValidationError({
        general:
          "Please enter a valid number of people who will be joining us today.",
      });
    }
    if (!customerName || !number || !customerPax) {
      return setValidationError({ general: "Please fill out the fields" });
    }

    const data = {
      accountId: params.accountId,
      customerName: customerName,
      customerNumber: formattedNumber,
      VIP: vip,
      pax: parseInt(customerPax),
    };
    console.log("Create a customer with this data: ", data);
    const createNewCustomer = async () => {
      try {
        const res = await apiPrivate.post(
          `/newCustomer/${params.queueId}`,
          data
        );
        if (res?.status === 201) {
          console.log("Success! New Customer created: ", res?.data);
          setModal(false);
        } else if (res?.status === 406) {
          console.log("Customer exist in a queue of a different location");
          setWarningDiffQueue(true);
          setWarningDiffQueueInfo(res?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    createNewCustomer();
  };

  //2. handle customer already in a diff queue
  const handleSubmitYes = async (e) => {
    e.preventDefault();
    const yesData = {
      pax: customerPax,
      remainInPreviousQueue: true,
      prevData: warningDiffQueueInfo,
    };
    console.log("Yes, ", yesData);
    console.log("prev data have outlet and account info? ", yesData.prevData);
    try {
      const res = await apiPrivate.post(
        `/customerRepost/${params.queueId}`,
        yesData
      );
      console.log("This is res", res);

      if (res?.status === 201) {
        //set data from repost
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitNo = async (e) => {
    e.preventDefault();
    setCustomerName("");
    setNumber("");
    setFormattedNumber("");
    setCustomerPax(null);
    setVIP(false);
    setValidationError("");
    setWarningDiffQueue(false);
    setWarningDiffQueueInfo("");
    setModal(false);
  };
  return (
    <div>
      {warningDiffQueue && (
        <div className="bg-primary-ultra-dark-green/85 min-w-full min-h-full absolute top-0 left-0 z-5"></div>
      )}
      <p
        className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
        onClick={() => {
          setModal(false);
        }}
      >
        X
      </p>
      {warningDiffQueue && (
        <div className="bg-primary-cream z-10 min-w-sm rounded-3xl text-center text-stone-700 absolute top-1/3 left-1/2 -translate-1/2 p-10 md:min-w-md">
          <h1 className="text-red-900">Alert:</h1>
          <p className="text-sm">{warningDiffQueueInfo.message}</p>
          <br />
          <p>Does customer wish to remain in the previous queue?</p>

          <div className="flex gap-5 justify-center">
            <button
              className="bg-primary-green mt-3 hover:bg-primary-dark-green w-35 transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmitYes}
            >
              Yes
            </button>
            <button
              className="bg-primary-green mt-3 hover:bg-primary-dark-green w-35  transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmitNo}
            >
              No
            </button>
          </div>
        </div>
      )}
      <form>
        <div className="">
          <label htmlFor="customer-name" className={labelClass}>
            Name
          </label>
          <input
            id="customer-name"
            type="text"
            placeholder="Enter customer name"
            className={inputClass}
            onChange={(e) => {
              setCustomerName(e.target.value);
            }}
            autoComplete="name"
            required
          />
        </div>
        <div className="mb-1">
          <label htmlFor="contact-number" className={labelClass}>
            Contact Number
          </label>
          <input
            id="contact-number"
            type="text"
            placeholder="Enter customer contact number"
            className={inputClass}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
            autoComplete="number"
            required
          />
        </div>
        <div className="mb-1">
          <label htmlFor="customer-pax" className={labelClass}>
            PAX
          </label>
          <input
            id="customer-pax"
            type="number"
            placeholder="How many people will be dining today?"
            className={inputClass}
            onChange={(e) => {
              setCustomerPax(e.target.value);
            }}
            required
          />

          <div className="flex items-center m-2 mt-3">
            <input
              id="vip"
              type="checkbox"
              className={checkBoxClass}
              onChange={() => {
                setVIP(!vip);
              }}
              checked={vip}
            />
            <label
              htmlFor="vip"
              className="ms-2 text-sm font-light text-gray-600 pl-1 md:pl-3"
            >
              VIP customer
            </label>
          </div>
        </div>
      </form>
      {validationError && (
        <p className={errorClass}>{validationError.general}</p>
      )}
      <button type="button" className={buttonClass} onClick={handleSubmit}>
        Create New Customer
      </button>
    </div>
  );
};

export default CreateCustomer;
