import React, { useEffect, useState } from "react";
import { apiPrivate } from "../api/axios";
import { msToMins, minsToMs } from "../utils/timeConverter";

const OutletUpdateModal = ({
  show,
  onClose,
  outletData,
  accountId,
  onUpdateSuccess,
}) => {
  // --- ALL useState declarations must be at the top level, unconditionally ---
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [wazeMaps, setWazeMaps] = useState("");
  const [defaultEstWaitTime, setDefaultEstWaitTime] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");

  // Errors
  const [errors, setErrors] = useState({});
  const [defaultEstWaitTimeError, setDefaultEstWaitTimeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [hoursError, setHoursError] = useState(false);
  const [imgUrlError, setImgUrlError] = useState(false);

  // Tailwind Classes
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-full focus:outline-none focus:shadow-outline min-w-20`;
  const errorClass = `text-red-600 text-center`;
  const inputDivClass = `px-3 py-1`;
  const inputClass = (hasError) =>
    `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:border-black peer active:border-black  ${
      hasError ? "border-red-500" : ""
    }`;

  useEffect(() => {
    if (outletData) {
      setName(outletData.name || "");
      setLocation(outletData.location || "");
      setGoogleMaps(outletData.googleMaps || "");
      setWazeMaps(outletData.wazeMaps || "");
      setDefaultEstWaitTime(msToMins(outletData.defaultEstWaitTime) || "");
      setImgUrl(outletData.imgUrl || "");
      setPhone(outletData.phone || "");
      setHours(outletData.hours || "");
      setErrors({});
      setDefaultEstWaitTimeError(false);
      setNameError(false);
      setLocationError(false);
      setPhoneError(false);
      setHoursError(false);
      setImgUrlError(false);
    }
  }, [outletData]);

  if (!show || !outletData) {
    return null;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    setErrors({});
    setDefaultEstWaitTimeError(false);
    setNameError(false);
    setLocationError(false);
    setPhoneError(false);
    setHoursError(false);
    setImgUrlError(false);

    let hasError = false;
    let currentErrors = {};

    // Validation
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

    const payload = {};
    if (outletData.name !== name) payload.name = name;
    if (outletData.location !== location) payload.location = location;
    if (outletData.googleMaps !== googleMaps) payload.googleMaps = googleMaps;
    if (outletData.wazeMaps !== wazeMaps) payload.wazeMaps = wazeMaps;
    if (msToMins(outletData.defaultEstWaitTime) !== parsedDefaultEstWaitTime)
      payload.defaultEstWaitTime = defEstWaitTimeInMs;
    if (outletData.hours !== hours) payload.hours = hours;
    if (outletData.imgUrl !== imgUrl) payload.imgUrl = imgUrl;
    if (outletData.phone !== phone) payload.phone = phone;

    if (Object.keys(payload).length === 0) {
      setErrors({ general: "No changes detected to update." });
      return;
    }

    try {
      console.log("Trying to patch to :", accountId, outletData.id);
      const res = await apiPrivate.patch(
        `/updateOutlet/${accountId}/${outletData.id}`,
        payload
      );
      console.log(res.status);
      if (res?.status === 201) {
        console.log("Outlet updated successfully:", res.data);
        onUpdateSuccess(res.data);
        onClose();
      } else {
        setErrors({ general: "Failed to update outlet. Please try again." });
      }
    } catch (error) {
      console.error("Error updating outlet:", error);
      setErrors({
        general:
          error?.response?.data?.message ||
          "An unexpected error occurred during update.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="justify-self-center pb-10 w-[90%] md:w-md my-10 bg-primary-cream rounded-3xl p-5 relative max-h-[90vh] overflow-y-auto">
        <button
          className="text-red-700 font-semibold absolute top-0 right-0 p-5 hover:text-red-900 transition ease-in cursor-pointer"
          onClick={onClose}
        >
          X
        </button>
        <h1 className="text-2xl font-light text-center">
          Updating Your Outlet Details
        </h1>

        <form className="mt-5" onSubmit={handleUpdate}>
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
            <p className="text-xs">
              Not sure how to find your google maps url?{" "}
              <span>Click This For Guide</span>
            </p>
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
            {errors.wazeMaps && <p className={errorClass}>{errors.wazeMaps}</p>}
            <p className="text-xs">
              Not sure how to find your waze maps url?{" "}
              <span>Click This For Guide</span>
            </p>
          </div>
          <div className={inputDivClass}>
            <label htmlFor="imgUrl" className={labelClass}>
              URL for an image to your store:
            </label>
            {imgUrl && (
              <div>
                <p className="text-xs font-light">
                  A sample of how your image looks
                </p>
                <img
                  src={imgUrl}
                  alt="Sample of image"
                  className="object-cover w-full h-32 rounded-md my-2"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/150x100/eeeeee/333333?text=Image+Error")
                  }
                />
              </div>
            )}
            <small className="text-xs font-light">
              Enter the image URL here
            </small>
            <input
              id="imgUrl"
              type="text"
              className={inputClass(imgUrlError) + " w-full "}
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
            {imgUrlError && errors.imgUrl && (
              <p className={errorClass}>{errors.imgUrl}</p>
            )}
            <p className="text-xs">
              Not sure how to upload your image?{" "}
              <span>Click This For Guide</span>
            </p>
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
                required
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

          {errors.general && (
            <p className={errorClass + " mt-3"}>{errors.general}</p>
          )}
          <p>* indicate required fields</p>

          <div className="flex justify-center mt-5">
            <button
              type="submit"
              className={
                buttonClass +
                " bg-primary-green hover:bg-primary-dark-green mr-3"
              }
            >
              Submit Update
            </button>
            <button
              type="button"
              className={buttonClass + " bg-red-700 hover:bg-red-900"}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutletUpdateModal;
