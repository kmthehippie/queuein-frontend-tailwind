import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiPrivate } from "../api/axios";
import {
  primaryButtonClass as buttonClass,
  primaryInputClass as inputClass,
  labelClass,
  errorClass,
  checkBoxClass,
  primaryBgClass,
  primaryTextClass,
} from "../styles/tailwind_styles";
import { useBusinessType } from "../hooks/useBusinessType";

const CreateCustomer = ({
  onSuccess,
  onFull,
  setModal,
  setNotice,
  setNotification,
  showPax,
}) => {
  const params = useParams();
  const [customerName, setCustomerName] = useState("");
  const [number, setNumber] = useState("");

  const [customerPax, setCustomerPax] = useState(null);
  const [vip, setVIP] = useState(true);
  const [validationError, setValidationError] = useState("");
  const { config } = useBusinessType();

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
    let formattedNumber;
    e.preventDefault();
    //Validation
    if (customerName.length === 0) {
      return setValidationError({ general: "Please enter a name" });
    }
    const validNumber = validMalaysianNumber(number);
    if (validNumber) {
      const extractedNumber = extractNumerals(number);
      formattedNumber = extractedNumber;
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
          onSuccess();
          setNotice(res?.data.message);
          setNotification(true);
          setModal(false);
        }
      } catch (error) {
        if (error.response.status === 406) {
          onFull();
          setModal(false);
        }
        console.error(error);
      }
    };
    createNewCustomer();
  };

  return (
    <div
      className={`max-w-md relative ${primaryBgClass} ${primaryTextClass} p-6 rounded-lg shadow-xl`}
    >
      <p
        className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
        onClick={() => {
          setModal(false);
        }}
      >
        X
      </p>

      <form className="">
        <div>
          <label htmlFor="customer-name" className={labelClass}>
            Name
          </label>
          <input
            id="customer-name"
            type="text"
            placeholder={`Enter ${config.customerSingularLabel} Name`}
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
            placeholder={`Enter ${config.customerSingularLabel} contact number`}
            className={inputClass}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
            autoComplete="number"
            required
          />
        </div>

        <div className="mb-1">
          {showPax && (
            <div>
              <label htmlFor="customer-pax" className={labelClass}>
                PAX
              </label>
              <input
                id="customer-pax"
                type="number"
                placeholder={`Number of ${config.customerLabel}?`}
                className={inputClass}
                onChange={(e) => {
                  setCustomerPax(e.target.value);
                }}
                required
              />{" "}
            </div>
          )}
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
              VIP {config.customerSingularLabel}
            </label>
          </div>
        </div>
      </form>
      {validationError && (
        <p className={errorClass}>{validationError.general}</p>
      )}
      <button type="button" className={buttonClass} onClick={handleSubmit}>
        Create New {config.customerSingularLabel}
      </button>
    </div>
  );
};

export default CreateCustomer;
