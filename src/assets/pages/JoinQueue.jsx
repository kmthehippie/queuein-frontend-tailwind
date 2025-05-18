import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Error from "./Error";

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
  const [warningDiffQueue, setWarningDiffQueue] = useState(false);
  const [warningDiffQueueInfo, setWarningDiffQueueInfo] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [outlet, setOutlet] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [validationError, setValidationError] = useState("");

  const [localStorageInfo, setLocalStorageInfo] = useState(null);
  const [shouldPost, setShouldPost] = useState(false);

  const { acctSlug, outletId, queueId } = useParams();
  const navigate = useNavigate();

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
  const closeWarning = () => {
    setWarning(false);
  };
  // const closeWarningDiffQueue = () => {
  //   setWarningDiffQueue(false);
  // };

  //Tailwind
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800 `;
  const inputClass = (hasError) =>
    `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black
  ${hasError ? "border-red-500" : ""}`;
  const errorClass = `text-red-600 text-center`;
  const checkBoxClass = `w-6 h-6 rounded-lg accent-primary-green hover:accent-primary-light-green text-primary-green focus:ring-2 ring-primary-light-green border-primary-dark-green`;
  const buttonClass = `bg-primary-green mt-3 hover:bg-primary-dark-green w-full transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;

  const fetchFormData = async () => {
    setLoading(true);
    setErrors("");
    try {
      console.log(`/customerForm/${acctSlug}/${outletId}/${queueId}`);
      const res = await api.get(
        `/customerForm/${acctSlug}/${outletId}/${queueId}`
      );
      console.log("Fetching form data from back end", res);
      if (res?.data) {
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
    }

    const validNumber = validMalaysianNumber(number);
    if (validNumber) {
      const extractedNumber = extractNumerals(number);
      setFormattedNumber(extractedNumber);
      console.log("This is the formatted number:", formattedNumber);
    } else {
      setNumberError(true);
      isValid = false;
      setValidationError({
        general: "Please enter a valid Malaysian Phone Number",
      });
    }
    if (customerPax === 0 || customerPax === null) {
      setCustomerPaxError(true);
      setShouldPost(false);
      setValidationError({
        general:
          "Please enter a valid number of people who will be joining us today.",
      });
    }
    if (customerPax > 12) {
      setWarning(true);
      isValid = false;
      setValidationError({
        general: "For bigger groups, please meet with our host.",
      });
    }
    if (!customerName || !number || !customerPax) {
      isValid = false;
      setValidationError({ general: "Please fill out the fields" });
    }
    //Find if user has localStorage containing queueItemId
    const storedAtLocalStorage = localStorage.getItem("queueItemLS");
    let localStorageInfo = null;
    if (storedAtLocalStorage) {
      try {
        const parsedInfo = JSON.parse(storedAtLocalStorage);
        localStorageInfo = parsedInfo;
        setLocalStorageInfo(localStorageInfo);
        console.log("Retrieved from Local Storage: ", localStorageInfo);
      } catch (err) {
        console.error("Error passing storedAtLocalStorage ", err);
        localStorage.removeItem("queueItemLS");
      }
    } else {
      console.log("Nothing stored at local storage");
    }

    if (isValid) {
      console.log("Setting should post to true");
      setShouldPost(true);
    }
    //! ADD 2 FACTOR AUTHENTICATION TO JOIN QUEUE. Once they hit submit, they need to 2FA. Then once authenticated, pass to back end.
  };

  //This useEffect is to POST to backend
  useEffect(() => {
    console.log("Is there validation error?", validationError);
    console.log("Should post? ", shouldPost);
    const data = {
      customerInfo: {
        customerName: customerName,
        customerNumber: formattedNumber,
        VIP: vip,
        pax: customerPax,
      },
      localStorageInfo,
    };
    console.log("Data inside useEffect ", data);
    const postCustomerForm = async () => {
      try {
        console.log("What's wrong with the data being sent? ", data);
        const res = await api.post(
          `/customerForm/${acctSlug}/${outlet.id}/${queueId}`,
          data
        );
        console.log("Response from posting form: ", res);
        let queueItemId = res?.data?.queueItem;
        if (res.status === 201) {
          console.log("Status is 201", queueItemId);
          const data = { ...res.data, accountInfo, outlet };
          const queueItem = res.data.queueItem;
          //Before navigate, set the localStorage first to contain queueItemId
          const storeToLocalStorage = {
            queueItemId: queueItem.id,
            queueId: queueItem.queueId,
            acctSlug: acctSlug,
          };
          localStorage.setItem(
            "queueItemLS",
            JSON.stringify(storeToLocalStorage)
          );
          navigate(`/${acctSlug}/queueItem/${queueItem.id}`, {
            state: { data: data },
          });
        }
      } catch (err) {
        setLoading(false);
        console.error(err.status, err);
        if (err.status === 409) {
          console.log("error 409", err?.response.data);
          const data = { ...err?.response.data, accountInfo, outlet };
          const queueItem = err?.response.data.queueItem;
          console.log("error 409:", queueItem);
          if (!queueItem) {
            <Error
              error={{
                status: 409,
                message:
                  "This contact number has already been used to queue at a different queue. If it is yours, please leave the previous queue.",
              }}
            />;
          }
          navigate(`/${acctSlug}/queueItem/${queueItem.id}`, {
            state: { data: data },
          });
        } else if (err.status === 406) {
          console.log("Error 406", err?.response.data);
          const data = {
            ...err?.response.data,
          };
          //pop up a modal asking if user wish to leave their previous queue
          setWarningDiffQueue(true);
          setWarningDiffQueueInfo(data);
        } else {
          setErrors({
            message:
              err.response.data.message ||
              "Error queueing up. Please ask host for assistance.",
            statusCode: err.response?.status || 500,
          });
        }
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

  const handleSubmitYes = async (e) => {
    e.preventDefault();
    const yesData = {
      pax: customerPax,
      localStorageInfo,
      remainInPreviousQueue: true,
      prevData: warningDiffQueueInfo,
    };
    console.log("Yes, ", yesData);
    console.log("prev data have outlet and account info? ", yesData.prevData);
    try {
      const res = await api.post(
        `/customerFormRepost/${acctSlug}/${outlet.id}/${queueId}`,
        yesData
      );
      console.log("This is res", res);

      if (res?.status === 201) {
        const navStateData = {
          ...res?.data,
          accountInfo,
          pax: customerPax,
        };
        const queueItem = res?.data.queueItem;
        navigate(`/${acctSlug}/queueItem/${queueItem.id}`, {
          state: { data: navStateData },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitNo = async (e) => {
    e.preventDefault();
    console.log("Trying to send NO");
    const noData = {
      pax: customerPax,
      localStorageInfo,
      remainInPreviousQueue: false,
      prevData: warningDiffQueueInfo,
    };
    console.log("no, ", noData);
    try {
      const res = await api.post(
        `/customerFormRepost/${acctSlug}/${outlet.id}/${queueId}`,
        noData
      );
      console.log("This is res", res);

      if (res?.status === 201) {
        const navStateData = {
          ...res?.data,
          accountInfo,
          outlet,
          pax: customerPax,
        };
        const queueItem = res?.data.queueItem;
        navigate(`/${acctSlug}/queueItem/${queueItem.id}`, {
          state: { data: navStateData },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
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
      {warning && (
        <div className="bg-primary-ultra-dark-green/85 min-w-full min-h-full absolute top-0 left-0 z-5"></div>
      )}
      {warningDiffQueue && (
        <div className="bg-primary-ultra-dark-green/85 min-w-full min-h-full absolute top-0 left-0 z-5"></div>
      )}

      <Link
        to={`/${accountInfo.slug}`}
        className="flex items-center pb-3 border-b-1 border-stone-400
        justify-center "
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
      <h1 className="font-light text-3xl text-center text-stone-600 mt-5 lg:text-4xl mb-2">
        {outlet.name}
      </h1>
      <div className="bg-white/50 p-10 rounded-xl shadow-md w-4/5 flex-row md:pt-5 md:pb-5 justify-self-center relative">
        {warning && (
          <div className="bg-primary-cream z-10 min-w-sm rounded-3xl text-center text-stone-700 absolute top-1/3 left-1/2 -translate-1/2 p-10 md:min-w-md">
            <h1 className="text-red-900">Notice:</h1>
            <p>
              Please talk to our host for large group sizes or close this box to
              change your group size.
            </p>
            <p
              className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold"
              onClick={closeWarning}
            >
              X
            </p>
            <button className={buttonClass} onClick={closeWarning}>
              Close
            </button>
          </div>
        )}
        {warningDiffQueue && (
          <div className="bg-primary-cream z-10 min-w-sm rounded-3xl text-center text-stone-700 absolute top-1/3 left-1/2 -translate-1/2 p-10 md:min-w-md">
            <h1 className="text-red-900">Alert:</h1>
            <p className="text-sm">{warningDiffQueueInfo.message}</p>
            <br />
            <p>Do you wish to remain in the previous queue?</p>

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
        <form onSubmit={handleSubmit}>
          <h1 className="text-center text-xl font-extralight">
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
                className="ms-2 text-xs font-light text-gray-600 pl-1 md:pl-3"
              >
                Join our VIP list! By providing your consent, we'll retain your
                phone number to send you exclusive offers and updates.
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
