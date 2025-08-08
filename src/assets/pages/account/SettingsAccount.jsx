import React, { useEffect, useState, useRef, useCallback } from "react";

import { apiPrivate, interceptedApiPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import AuthorisedUser from "../../pages/account/AuthorisedUser";
import Loading from "../../components/Loading";

const SettingsAccount = () => {
  const { accountId } = useAuth();
  const [account, setAccount] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [logo, setLogo] = useState("");
  const [slug, setSlug] = useState("");

  const [imgFile, setImgFile] = useState("");
  const [changesExist, setChangesExist] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [companyNameError, setCompanyNameError] = useState(false);
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [emailModalInfo, setEmailModalInfo] = useState(false);
  const [slugModalInfo, setSlugModalInfo] = useState(false);
  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchAccountInfo = async () => {
    try {
      const response = await apiPrivate.get(`/settings/account/${accountId}`);
      console.log(response);
      if (response.data) {
        setAccount(response.data);
        setCompanyName(response.data.companyName);
        setCompanyEmail(response.data.companyEmail);
        const updateDate = new Date(response.data.createdAt);
        const formattedTime = updateDate.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setCreatedAt(formattedTime);
        setLogo(response.data.logo);
        setSlug(response.data.slug);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImgFile(file);
      setLogo(newUrl);
      console.log("This is new url: ", newUrl);
    } else {
      setImgFile(null);
      setLogo(null);
    }
  };
  const checkChange = () => {
    const nameChanged = account.companyName !== companyName;

    // Check for a new file upload
    const fileChanged = imgFile !== null && imgFile !== "";

    // Set changesExist to true if any of the above are true
    setChangesExist(nameChanged || fileChanged);
  };
  const handleUpdate = useCallback((e) => {
    e.preventDefault();
    setErrors("");
    setShowAuthModal(true);
  }, []);
  const updateAccountAllowed = async (staffInfo) => {
    console.log(
      "Update account allowed called from settings account. This is the staff information: ",
      staffInfo
    );
    setCompanyNameError(false);
    setErrors({});

    if (companyName.length < 5) {
      setCompanyNameError(true);
      setErrors({ general: "Name must be longer than 5 characters" });
      return;
    }

    const hasFileToUpload = imgFile !== null;
    let dataToSubmit;
    let forView = {};
    dataToSubmit = new FormData();

    if (hasFileToUpload) {
      if (imgFile !== "") {
        dataToSubmit.append("outletImage", imgFile);
        forView.logo = imgFile;
      }
    }
    if (account.companyName !== companyName) {
      dataToSubmit.append("companyName", companyName);
      forView.companyName = companyName;
    }

    let hasContent = false;
    for (let pair of dataToSubmit.entries()) {
      hasContent = true;
      break;
    }
    if (!hasContent) {
      setErrors({ general: "No changes detected to update." });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Trying to patch to account ", accountId);
      console.log(forView);
      const res = await interceptedApiPrivate.patch(
        `/account/${accountId}/profile_picture`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        console.log("Res status 201", res.data);
        setIsLoading(false);
        setChangesExist(false);
        setCompanyName(res.data.companyName);
        setLogo(res.data.logo);
        setImgFile("");
        setAccount(res.data);
        setShowAuthModal(false);
      }
      console.log(dataToSubmit);
    } catch (error) {
      setIsLoading(false);
      setErrors({ general: "Failed to update account. Please try again." });
      console.error(error);
    }
  };
  const handleReset = (e) => {
    e.preventDefault();
    setCompanyName(account.companyName);
    setLogo(account.logo);
    setImgFile("");
    setSlug(account.slug);
  };
  const handleAuthModalClose = () => {
    setErrors({ general: "Forbidden" });
    setShowAuthModal(false);
  };
  useEffect(() => {
    if (companyName || imgFile || logo) {
      checkChange();
    }
  }, [companyName, imgFile]);

  useEffect(() => {
    fetchAccountInfo();
  }, []);
  const inputDivClass = `px-3 py-1 lg:grid lg:grid-cols-4 items-center lg:pl-5 pb-4`;
  const labelClass = `lg:col-span-1 text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800 pr-4`;
  const inputClass = (hasError) =>
    `appearance-none block py-2 pl-1 text-gray-700 text-sm leading-tight focus:outline-none focus:border-b-1 border-gray-400 peer ${
      hasError ? "border-red-500" : ""
    }`;
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-full focus:outline-none focus:shadow-outline min-w-20`;
  const errorClass = `text-red-600 text-center`;

  return (
    <div className="">
      {isLoading && (
        <Loading
          title={"Update Outlet Information"}
          paragraph={"Do Not Navigate Away. Please Wait. "}
        />
      )}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
            <button
              onClick={handleAuthModalClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <AuthorisedUser
              onSuccess={updateAccountAllowed}
              onFailure={handleAuthModalClose}
              actionPurpose="Update Account Data" // Changed actionPurpose for clarity
              minimumRole="MANAGER"
            />
          </div>
        </div>
      )}
      <div className="h-[63vh] lg:h-auto">
        {emailModalInfo && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
              <div
                className="absolute top-1 right-2 text-red-600 hover:text-red-950 cursor-pointer"
                onClick={() => {
                  setEmailModalInfo(false);
                }}
              >
                <i className="fa-solid fa-x "></i>
              </div>
              <small className="text-red-800 italic p-0 ">
                Sorry, this field cannot be changed. If you really need to,
                please contact the admin at ....
              </small>
            </div>
          </div>
        )}
        {slugModalInfo && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
              <div
                className="absolute top-1 right-2 text-red-600 hover:text-red-950 cursor-pointer"
                onClick={() => {
                  setSlugModalInfo(false);
                }}
              >
                <i className="fa-solid fa-x "></i>
              </div>
              <small className="text-red-800 italic p-0 ">
                <div className="">
                  <p>What is a slug?</p>
                  <p>This should be a modal</p>
                  <p>It's how your customers will look for your shop!</p>
                </div>
                <small className="text-red-800 italic p-0 ">
                  Sorry, this field cannot be changed. If you really need to,
                  please contact the admin at ....
                </small>
              </small>
            </div>
          </div>
        )}
        {changesExist && (
          <div
            className="fixed p-2 bg-primary-cream/90 top-1/5 right-1/10 rounded-xl shadow-red-900 shadow-lg/30 cursor-pointer z-20 lg:top-1/4 lg:right-1/5"
            onClick={scrollToBottom}
          >
            <div className="animate-ping bg-red-700 w-3 h-3 rounded-2xl absolute top-0 right-0"></div>
            Changes Exist
          </div>
        )}
        <div className="text-sm overflow-y-auto lg:overflow-auto h-full lg:h-auto pb-10">
          <div className="pl-5 lg:pl-10 mt-5">
            <div className=" text-md ">Welcome to your account settings</div>
            <div className="text-xs font-extralight italic ">
              Your account was created on {createdAt}
            </div>
          </div>

          <form className="mt-5 ">
            <div className={inputDivClass}>
              <label htmlFor="companyName" className={labelClass}>
                Company Name:*
              </label>
              <input
                id="companyName"
                type="text"
                className={
                  inputClass(companyNameError) + " lg:col-span-3  w-full "
                }
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div
              className={`px-3 py-1 h-full lg:grid lg:grid-cols-4 items-center lg:pl-5 pb-4`}
            >
              <label htmlFor="slug" className={labelClass}>
                <i
                  className="fa-solid fa-circle-info pr-1 cursor-pointer "
                  onClick={() => {
                    setSlugModalInfo(!slugModalInfo);
                  }}
                ></i>
                Company Slug:{" "}
              </label>
              <p
                className={
                  "lg:col-span-3 appearance-none block pl-1 pt-2 text-gray-700 text-sm leading-tight border-gray-400 peer "
                }
              >
                {slug}
              </p>
            </div>
            <div
              className={`px-3 py-1 h-full lg:grid lg:grid-cols-4 items-center lg:pl-5 pb-4`}
            >
              <label htmlFor="companyEmail" className={labelClass}>
                <i
                  className="fa-solid fa-circle-info pr-1 cursor-pointer "
                  onClick={() => {
                    setEmailModalInfo(!emailModalInfo);
                  }}
                ></i>
                Company Email:{" "}
              </label>
              <p
                className={
                  "lg:col-span-3 appearance-none block pl-1 pt-2 text-gray-700 text-sm leading-tight border-gray-400 peer "
                }
              >
                {companyEmail}
              </p>
            </div>
            <div className={inputDivClass}>
              <label htmlFor="logo" className={labelClass}>
                Company Logo:
              </label>
              <input
                id="logo"
                type="file"
                className={inputClass() + "col-span-3 w-full "}
                onChange={handleFileChange}
              />
              {logo && (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xs font-light mt-3">
                    A sample of the image
                  </p>
                  <img
                    src={logo}
                    alt="Sample of image"
                    className="object-cover rounded-md my-2 w-full"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/150x100/eeeeee/333333?text=Image+Error")
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex justify-center mt-5 " ref={bottomRef}>
              <button
                onClick={(e) => {
                  handleUpdate(e);
                }}
                className={
                  buttonClass +
                  " bg-primary-green hover:bg-primary-dark-green mr-3"
                }
              >
                Submit Update
              </button>
              <button
                className={buttonClass + " bg-red-700 hover:bg-red-900"}
                onClick={handleReset}
              >
                Reset Form
              </button>
            </div>
          </form>
          {errors && <div className={errorClass}>{errors.general}</div>}
        </div>
      </div>
    </div>
  );
};

export default SettingsAccount;
