import React, { useState } from "react";
import { minsToMs } from "../../utils/timeConverter";
import { useNavigate, useParams } from "react-router-dom";
import useApiPrivate from "../../hooks/useApiPrivate";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";
import AuthorizedUser from "./AuthorisedUser";

const NewOutlet = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const apiPrivate = useApiPrivate();
  const { setReloadNav, outletText } = useAuth();
  //DATA TO SET
  const [name, setName] = useState(""); // Initialize with empty string
  const [location, setLocation] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [wazeMaps, setWazeMaps] = useState("");
  const [defaultEstWaitTime, setDefaultEstWaitTime] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  //Errors
  const [errors, setErrors] = useState({});
  const [defaultEstWaitTimeError, setDefaultEstWaitTimeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [hoursError, setHoursError] = useState(false);
  const [imgUrlError, setImgUrlError] = useState(false);

  //Tailwind Classes
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-full focus:outline-none focus:shadow-outline min-w-20`;
  const errorClass = `text-red-600 text-center`;
  const inputDivClass = `px-3 py-1`;
  const inputClass = (hasError) =>
    `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:border-black peer active:border-black  ${
      hasError ? "border-red-500" : ""
    }`;
  const handleCreate = async (e) => {
    e.preventDefault();
    setShowAuthModal(true);
  };

  const handleAuthFailure = () => {
    setShowAuthModal(false);
    setErrors({
      general: "Authorization failed. Please try again with valid credentials.",
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImgFile(file);
      setImgUrl(newUrl);
      console.log("This is new url: ", newUrl);
    } else {
      setImgFile(null);
      setImgUrl(null);
    }
  };
  const createAccountAllowed = async () => {
    setErrors({});
    setDefaultEstWaitTimeError(false);
    setNameError(false);
    setLocationError(false);
    setPhoneError(false);
    setHoursError(false);
    setImgUrlError(false);

    let hasError = false;
    let currentErrors = {};

    //Validation
    if (name.length < 2) {
      currentErrors.name = "Name must be longer than 2 characters";
      setNameError(true);
      hasError = true;
    }

    if (location.length === 0) {
      currentErrors.location = "Address can't be empty";
      setLocationError(true);
      hasError = true;
    }
    if (phone.length < 10) {
      currentErrors.phone = "Contact number must be at least 10 numbers long";
      setPhoneError(true);
      hasError = true;
    }
    if (hours.length < 1) {
      currentErrors.hours = "Hours must be entered";
      setHoursError(true);
      hasError = true;
    }

    let defEstWaitTimeInMs = null;
    const parsedDefaultEstWaitTime = parseFloat(defaultEstWaitTime);
    if (isNaN(parsedDefaultEstWaitTime)) {
      currentErrors.defaultEstWaitTime = "Estimated wait time must be a number";
      setDefaultEstWaitTimeError(true);
      hasError = true;
    } else if (parsedDefaultEstWaitTime < 0) {
      currentErrors.defaultEstWaitTime =
        "Estimated wait time cannot be negative";
      setDefaultEstWaitTimeError(true);
      hasError = true;
    } else {
      defEstWaitTimeInMs = minsToMs(parsedDefaultEstWaitTime);
    }

    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    const hasFileToUpload = imgFile !== null;
    let dataToSubmit;
    dataToSubmit = new FormData();

    if (hasFileToUpload) {
      dataToSubmit.append("outletImage", imgFile);
    }
    dataToSubmit.append("name", name);
    dataToSubmit.append("location", location);
    dataToSubmit.append("googleMaps", googleMaps);
    dataToSubmit.append("wazeMaps;", wazeMaps);
    dataToSubmit.append("defaultEstWaitTime", defEstWaitTimeInMs);
    dataToSubmit.append("hours", hours);
    dataToSubmit.append("phone", phone);

    try {
      console.log("Trying to post to new outlet ", accountId);
      setIsLoading(true);
      // Authorised User
      const res = await apiPrivate.post(
        `/newOutlet/${accountId}/outlet_image`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res?.status === 201) {
        setIsLoading(false);
        setReloadNav();
        navigate(`/db/${accountId}/outlets/all`);
      } else {
        setIsLoading(false);
        setErrors({ general: "Failed to update outlet. Please try again" });
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) {
    return (
      <Loading
        title={"Create New Outlet"}
        paragraph={"Do Not Navigate Away. Please Wait. "}
      />
    );
  }
  return (
    <div>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
            <button onClick={handleAuthFailure}>&times;</button>
            <AuthorizedUser
              onSuccess={createAccountAllowed}
              onFailure={handleAuthFailure}
              actionPurpose="Create New Outlet"
              minimumRole="TIER_2"
              outletId={null}
            />
          </div>
        </div>
      )}

      <div className=" rounded-2xl p-3 relative mx-3 mt-2 md:mt-5 md:mx-5 bg-primary-cream/50 shadow-lg ">
        <h1 className="font-semibold text-2xl mb-3 text-center text-primary-dark-green">
          Create a new {outletText}
        </h1>
        <div className="flex flex-row justify-center items-center ">
          <form
            onSubmit={handleCreate}
            className="w-md bg-primary-cream/70 rounded-2xl pb-3"
          >
            <div className={inputDivClass}>
              <label htmlFor="name" className={labelClass}>
                Name:*
              </label>
              <input
                id="name"
                type="text"
                className={inputClass(nameError) + " w-full "}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {nameError && errors.name && (
                <p className={errorClass}>{errors.name}</p>
              )}
            </div>
            <div className={inputDivClass}>
              <label htmlFor="location" className={labelClass}>
                Location:
              </label>
              <input
                id="location"
                type="text"
                className={inputClass(locationError) + " w-full "}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {locationError && errors.location && (
                <p className={errorClass}>{errors.location}</p>
              )}
            </div>
            <div className={inputDivClass}>
              <label htmlFor="googleMaps" className={labelClass}>
                Google Maps URL:
              </label>
              <input
                id="googleMaps"
                type="text"
                className={inputClass() + " w-full "}
                value={googleMaps}
                onChange={(e) => setGoogleMaps(e.target.value)}
              />
              {errors.googleMaps && (
                <p className={errorClass}>{errors.googleMaps}</p>
              )}
              {/* <p className="text-xs">
                Not sure how to find your google maps url?{" "}
                <span>Click This For Guide</span>
              </p> */}
            </div>
            <div className={inputDivClass}>
              <label htmlFor="wazeMaps" className={labelClass}>
                Waze Maps URL:
              </label>
              <input
                id="wazeMaps"
                type="text"
                className={inputClass() + " w-full "}
                value={wazeMaps}
                onChange={(e) => setWazeMaps(e.target.value)}
              />
              {errors.wazeMaps && (
                <p className={errorClass}>{errors.wazeMaps}</p>
              )}
              {/* TODO! */}
              {/* <p className="text-xs">
                Not sure how to find your waze maps url?{" "}
                <span>Click This For Guide</span>
              </p> */}
            </div>
            <div className={inputDivClass}>
              <label htmlFor="imgUrl" className={labelClass}>
                Upload the image of your {outletText}
              </label>

              <div>
                <input
                  id="imgFile"
                  type="file"
                  className={inputClass(imgUrlError) + " w-full "}
                  onChange={handleFileChange}
                />
              </div>

              {imgUrlError && errors.imgUrl && (
                <p className={errorClass}>{errors.imgUrl}</p>
              )}
              <div>
                <p className="text-xs font-light mt-3">A sample of the image</p>
                <img
                  src={
                    imgUrl ||
                    "https://placehold.co/150x100/eeeeee/333333?text=Image+Error"
                  }
                  alt="Sample of image"
                  className="object-cover w-full h-32 rounded-md my-2"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/150x100/eeeeee/333333?text=Image+Error")
                  }
                />
              </div>
            </div>
            <div className={inputDivClass}>
              <label htmlFor="defaultEstWaitTime" className={labelClass}>
                An estimate wait time in minutes:*
              </label>
              <span className="flex items-center text-center">
                <input
                  id="defaultEstWaitTime"
                  type="text"
                  className={
                    inputClass(defaultEstWaitTimeError) + " w-20 mr-[10px]"
                  }
                  value={defaultEstWaitTime}
                  onChange={(e) => setDefaultEstWaitTime(e.target.value)}
                />{" "}
                minutes
              </span>
              {defaultEstWaitTimeError && errors.defaultEstWaitTime && (
                <p className={errorClass}>{errors.defaultEstWaitTime}</p>
              )}
            </div>
            <div className={inputDivClass}>
              <label htmlFor="phone" className={labelClass}>
                Phone Number:
              </label>
              <input
                id="phone"
                type="text"
                className={inputClass(phoneError) + " w-full "}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneError && errors.phone && (
                <p className={errorClass}>{errors.phone}</p>
              )}
            </div>
            <div className={inputDivClass}>
              <label htmlFor="hours" className={labelClass}>
                Opening Hours:
              </label>
              <input
                id="hours"
                type="text"
                className={inputClass(hoursError) + " w-full "}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              {hoursError && errors.hours && (
                <p className={errorClass}>{errors.hours}</p>
              )}
            </div>
            <p className="text-center text-primary-dark-green">
              * indicate required fields
            </p>
            {errors.general && (
              <p className={errorClass + " mt-3"}>{errors.general}</p>
            )}
            <div className="flex justify-center">
              <button
                onClick={(e) => handleCreate(e)}
                className={
                  buttonClass +
                  " bg-primary-green hover:bg-primary-dark-green mr-3"
                }
              >
                Submit New {outletText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOutlet;
