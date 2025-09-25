import { useState, useEffect } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import api from "../../api/axios";
import Error from "../Error";
import Loading from "../../components/Loading";

const KioskView = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerNameErr, setCustomerNameErr] = useState("");
  const [number, setNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [customerPax, setCustomerPax] = useState(null);
  const [customerPaxError, setCustomerPaxError] = useState("");
  const [vip, setVIP] = useState(true);
  const [warning, setWarning] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [validationError, setValidationError] = useState("");

  const [shouldPost, setShouldPost] = useState(false);
  const { acctSlug, queueId } = useParams();
  const { outletId, businessType } = useOutletContext();

  const navigate = useNavigate();

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
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800 `;
  const inputClass = (hasError) =>
    `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black
  ${hasError ? "border-red-500" : ""}`;
  const errorClass = `text-red-600 text-center`;
  const checkBoxClass = `w-6 h-6 rounded-lg accent-primary-green hover:accent-primary-light-green text-primary-green focus:ring-2 ring-primary-light-green border-primary-dark-green`;
  const buttonClass = `bg-primary-green mb-5 hover:bg-primary-dark-green transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;

  const handleSubmitKiosk = async (e) => {
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
    if (businessType === "RESTAURANT") {
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
    if (businessType !== "RESTAURANT") {
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

  useEffect(() => {
    const data = {
      customerName: customerName,
      customerNumber: formattedNumber,
      VIP: vip,
      pax: customerPax,
    };

    const postCustomerForm = async () => {
      try {
        console.log("Trying to send post");
        const res = await api.post(
          `/kiosk/${acctSlug}/${outletId}/${queueId}`,
          data
        );

        if (res.status === 201 || res.status === 200) {
          const queueItem = res.data.queueItem;
          const data = {
            ...res.data,
            outletId,
          };
          console.log(res.data);
          navigate(`/${acctSlug}/kiosk/${queueItem.id}/success`, {
            state: { data: data },
          });
          console.log("Successfully joined queue");
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
  }, [shouldPost]);

  if (errors) {
    return <Error error={errors} />;
  }
  if (loading) {
    return (
      <Loading
        title={"Kiosk View "}
        paragraph={"Please wait for the kiosk view to load."}
      />
    );
  }

  return (
    <div>
      <div className=" flex-row md:pt-5 md:pb-5 justify-self-center relative">
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
        <form>
          <div className="flex-row pt-5 max-w-xs">
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
            {businessType === "RESTAURANT" && (
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
            <div className="flex items-center mb-1 mt-3">
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
                Join our VIP list! By providing your consent,{" "}
                <span className="font-bold">
                  we will retain your phone number
                </span>{" "}
                to send you exclusive offers and updates.
              </label>
            </div>

            {validationError && (
              <p className={errorClass}>{validationError.general}</p>
            )}
            <div className="flex w-full justify-center pt-2 ">
              <div className={buttonClass} onClick={handleSubmitKiosk}>
                Join Queue
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KioskView;
