import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Error from "../pages/Error";
import Loading from "../components/Loading";
import {
  primaryButtonClass as buttonClass,
  primaryInputClass,
  primaryBgClass,
  primaryTextClass,
  labelClass,
  errorClass,
  secondaryTextClass,
} from "../styles/tailwind_styles";

const GetQRCode = ({ onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerNameErr, setCustomerNameErr] = useState("");
  const [number, setNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [shouldPost, setShouldPost] = useState(false);
  const { acctSlug, queueId, outletId } = useParams();

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

  //Tailwind
  const inputClass = (hasError) =>
    `${primaryInputClass}
  ${hasError ? "border-red-500" : ""}`;

  const handleSubmitQRCode = async (e) => {
    e.preventDefault();
    setValidationError("");
    setCustomerNameErr(false);
    setNumberError(false);
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

  const handleBack = () => {
    onClose();
  };

  useEffect(() => {
    const data = {
      customerName: customerName,
      customerNumber: formattedNumber,
    };

    const postCustomerForm = async () => {
      try {
        const res = await api.post(
          `/kiosk/${acctSlug}/${outletId}/${queueId}/prevQR`,
          data
        );
        if (res.status === 201 || res.status === 200) {
          const queueItem = res.data.queueItem;
          const data = {
            ...res.data,
            outletId,
          };
          navigate(`/${acctSlug}/kiosk/${queueItem.id}/success`, {
            state: { data: data },
          });
        }
      } catch (err) {
        setLoading(false);
        console.error(err.status, JSON.stringify(err));
        if (err.status === 404) {
          setNotFound(true);
        }
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

  if (loading) {
    return (
      <Loading
        title={"Get QR Code Page"}
        paragraph={"Please wait for the page to load."}
      />
    );
  }

  if (notFound) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div
          className={`flex flex-col items-center ${primaryBgClass} ${primaryTextClass} p-10 rounded-3xl m-2 text-center`}
        >
          <h1 className="text-2xl font-extralight text-center">Not Found</h1>
          <p className="mt-3 font-bold text-sm mb-5">
            Sorry, the contact number you entered does not exist in this queue.
          </p>
          <p className={`${secondaryTextClass}`}>
            Please join the queue at our kiosk page.
          </p>
          <button
            className={`mt-3 transition ease-in ${primaryTextClass} bg-primary-green cursor-pointer font-light py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline min-w-20`}
            onClick={handleBack}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  if (errors) {
    return <Error error={errors} />;
  }
  return (
    <div>
      <div className=" flex-row md:pt-5 md:pb-5 justify-self-center relative">
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

            {validationError && (
              <p className={errorClass}>{validationError.general}</p>
            )}
            <div className="flex w-full justify-center pt-2 text-center">
              <div className={buttonClass} onClick={handleSubmitQRCode}>
                Get Previous QR Code
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetQRCode;
