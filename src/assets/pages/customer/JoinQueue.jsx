import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Error from "../Error";
import { setWithExpiry } from "../../utils/localStorage";
import useLSContext from "../../hooks/useLSContext";
import {
  primaryBgClass,
  primaryBgTransparentClass,
  primaryTextClass,
  secondaryTextClass,
  labelClass,
  errorClass,
  checkBoxClass,
  primaryButtonClass as buttonClass,
  primaryInputClass,
  errorTextClass,
  xButtonClass,
} from "../../styles/tailwind_styles";

//! +Customer must be on mobile.
const JoinQueue = () => {
  //States
  const [customerName, setCustomerName] = useState("");
  const [customerNameErr, setCustomerNameErr] = useState("");
  const [number, setNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [customerPax, setCustomerPax] = useState(null);
  const [customerPaxError, setCustomerPaxError] = useState("");
  const [vip, setVIP] = useState(true);
  const [warning, setWarning] = useState(false);
  const [accountInfo, setAccountInfo] = useState("");
  const [outlet, setOutlet] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [validationError, setValidationError] = useState("");

  const [shouldPost, setShouldPost] = useState(false);
  const { acctSlug, queueId } = useParams();
  const navigate = useNavigate();
  const { checkSession } = useLSContext();
  const localStorageExpiry = parseInt(import.meta.env.VITE_QUEUEITEMLS_EXPIRY);
  //Helper function
  const extractNumerals = (numberString) => {
    return numberString.replace(/\D/g, "");
  };
  const validMalaysianNumber = (number) => {
    const numeralsOnly = extractNumerals(number);
    const regex = /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/gm;
    return regex.test(numeralsOnly);
  };
  const closeWarning = () => {
    setWarning(false);
  };

  //Tailwind

  const inputClass = (hasError) =>
    `${primaryInputClass}
  ${hasError ? "border-red-500" : ""}`;

  const fetchFormData = async () => {
    setLoading(true);
    setErrors("");
    try {
      const res = await api.get(`/customerForm/${acctSlug}/${queueId}`);
      if (res?.data) {
        console.log("Res: ", res.data);
        setAccountInfo(res.data.accountInfo);
        setOutlet(res.data.queue.outlet);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customer form ", err);
      setLoading(false);
      console.error(err);
      setErrors({
        message: err.response.data.message || "Error with queue page.",
        statusCode: err.response?.status || 500,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setCustomerNameErr(false);
    setNumberError(false);
    setCustomerPaxError(false);
    setShouldPost(false);
    let isValid = true;

    //Validation
    if (customerName.length === 0) {
      setCustomerNameErr(true);
      isValid = false;
      setValidationError({ general: "Please enter a name" });
      return;
    }
    const validNumber = validMalaysianNumber(number);
    if (validNumber) {
      const extractedNumber = extractNumerals(number);
      setFormattedNumber(extractedNumber);
    } else {
      setNumberError(true);
      isValid = false;
      setValidationError({
        general: "Please enter a valid Malaysian Phone Number",
      });
      return;
    }
    if (accountInfo.businessType === "RESTAURANT") {
      if (customerPax === 0 || customerPax === null) {
        setCustomerPaxError(true);
        setShouldPost(false);
        setValidationError({
          general:
            "Please enter a valid number of people who will be joining us today.",
        });
        return;
      }
      if (customerPax > 12) {
        setWarning(true);
        isValid = false;
        setValidationError({
          general: "For bigger groups, please meet with our host.",
        });
        return;
      }
    }
    if (accountInfo.businessType !== "RESTAURANT") {
      setCustomerPax(1);
    }
    if (!customerName || !number) {
      isValid = false;
      setValidationError({ general: "Please fill out the fields" });
      return;
    }
    if (isValid) {
      setShouldPost(true);
    }
    //! ADD 2 FACTOR AUTHENTICATION TO JOIN QUEUE. Once they hit submit, they need to 2FA. Then once authenticated, pass to back end.
  };

  //This useEffect is to POST to backend
  useEffect(() => {
    const data = {
      customerName: customerName,
      customerNumber: formattedNumber,
      VIP: vip,
      pax: customerPax,
    };

    const postCustomerForm = async () => {
      try {
        const res = await api.post(
          `/customerForm/${acctSlug}/${outlet.id}/${queueId}`,
          data
        );

        if (res.status === 201 || res.status === 200) {
          const queueItem = res.data.queueItem;
          const storeToLocalStorage = {
            queueItemId: queueItem.id,
            queueId: queueItem.queueId,
            acctSlug: acctSlug,
          };
          setWithExpiry("queueItemLS", storeToLocalStorage, localStorageExpiry);
          checkSession();
          navigate(`/${acctSlug}/queueItem/${queueItem.id}`);
        }
      } catch (err) {
        setLoading(false);
        console.error(err.status, JSON.stringify(err));

        setErrors({
          message:
            err.response.data.message ||
            "Error queueing up. Please ask host for assistance.",
          statusCode: err.response?.status || 500,
        });
      }
    };

    if (shouldPost) {
      postCustomerForm();
    }
  }, [
    shouldPost,
    navigate,
    setLoading,
    setErrors,
    acctSlug,
    outlet,
    queueId,
    accountInfo,
  ]);

  useEffect(() => {
    fetchFormData();
  }, [queueId]);

  if (errors) {
    return <Error error={errors} />;
  }
  if (loading) {
    return <div>Loading Information...</div>;
  }
  return (
    <div className="p-3 md:p-5">
      {/* {warning && (
        <div className="bg-primary-ultra-dark-green/85 min-w-full min-h-full absolute top-0 left-0 z-5"></div>
      )} */}

      <Link
        to={`/${accountInfo.slug}`}
        className={`flex items-center pb-3 border-b-1 ${secondaryTextClass} justify-center `}
      >
        <img
          src={accountInfo.logo}
          alt={`${accountInfo.companyName} logo`}
          className="w-20"
        />
        <h1 className="font-bold pl-3 text-2xl sm:text-4xl sm:pl-6 lg:text-6xl ">
          {accountInfo.companyName}
        </h1>
      </Link>
      <h1
        className={`font-light text-3xl text-center ${primaryTextClass} mt-5 lg:text-4xl mb-2`}
      >
        {outlet.name}
      </h1>
      <div
        className={`${primaryBgTransparentClass} p-2 md:p-10 rounded-xl shadow-md w-4/5 flex-row md:pt-5 md:pb-5 justify-self-center relative max-w-[500px]`}
      >
        {warning && (
          <div
            className={`${primaryBgClass} z-10 min-w-sm rounded-3xl text-center ${primaryTextClass} absolute top-1/3 left-1/2 -translate-1/2 p-10 md:min-w-md`}
          >
            <h1 className={errorTextClass}>Notice:</h1>
            <p>
              Please talk to our staff for large group sizes or close this box
              to change your group size.
            </p>
            <p className={xButtonClass} onClick={closeWarning}>
              X
            </p>
            <button className={buttonClass} onClick={closeWarning}>
              Close
            </button>
          </div>
        )}
        <form className="">
          <h1
            className={`text-center text-xl md:text-3xl font-extralight ${primaryTextClass} `}
          >
            Enter the queue:
          </h1>
          <div className="flex-row p-1 ">
            <div className="mb-1">
              <label htmlFor="customer-name" className={labelClass}>
                Name
              </label>
              <input
                id="customer-name"
                type="text"
                placeholder="Enter your name"
                className={inputClass(!!customerNameErr)}
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
                placeholder="Enter your contact number"
                className={inputClass(!!numberError)}
                onChange={(e) => {
                  setNumber(e.target.value);
                }}
                autoComplete="number"
                required
              />
            </div>
            {outlet.showPax && (
              <div className="mb-1">
                <label htmlFor="customer-pax" className={labelClass}>
                  PAX
                </label>
                <input
                  id="customer-pax"
                  type="number"
                  placeholder="How many people will be dining today?"
                  className={inputClass(!!customerPaxError)}
                  onChange={(e) => {
                    setCustomerPax(e.target.value);
                  }}
                  required
                />
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
                className={`ms-2 text-xs font-light ${primaryTextClass} pl-1 md:pl-3`}
              >
                Join our VIP list! By providing your consent,{" "}
                <span className="font-bold">
                  we will retain your phone number
                </span>{" "}
                to send you exclusive offers and updates.
              </label>
            </div>
          </div>
        </form>
        {validationError && (
          <p className={errorClass}>{validationError.general}</p>
        )}
        <button type="button" className={buttonClass} onClick={handleSubmit}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default JoinQueue;
