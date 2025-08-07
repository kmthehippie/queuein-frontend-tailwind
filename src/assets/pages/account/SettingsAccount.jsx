import React, { useEffect, useState, useRef } from "react";
import EditableField from "../../components/EditableField";
import { apiPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";

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

  const [companyNameError, setCompanyNameError] = useState(false);
  const [slugError, setSlugError] = useState(false);
  const [errors, setErrors] = useState();

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
    if (account.companyName !== companyName) {
      console.log("Name diff", account.name, companyName);
      return setChangesExist(true);
    }
    if (account.slug !== slug) {
      console.log("slug diff", account.slug, slug);
      return setChangesExist(true);
    }
    if (account.logo !== null && account.logo !== imgFile) {
      console.log("logo diff", account.logo, imgFile);
      return setChangesExist(true);
    }
    return setChangesExist(false);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setCompanyNameError(false);
    setSlugError(false);
    setErrors({});

    if (companyName.length < 5) {
      setCompanyNameError(true);
      setErrors({ general: "Name must be longer than 5 characters" });
      return;
    }
    if (slug.length < 5) {
      setSlugError(true);
      setErrors({ general: "Slug must be longer than 5 characters" });
      return;
    }
    //! HALF WAY DOING HERE
  };
  const handleReset = (e) => {
    e.preventDefault();
    setCompanyName(account.companyName);
    setLogo(account.logo);
    setSlug(account.slug);
  };
  useEffect(() => {
    if (companyName || imgFile || slug) {
      checkChange();
    }
  }, [companyName, imgFile, slug]);

  useEffect(() => {
    fetchAccountInfo();
  }, []);
  const inputDivClass = `px-3 py-1 lg:grid lg:grid-cols-5 items-center lg:pl-5`;
  const labelClass = `lg:col-span-1 text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const inputClass = (hasError) =>
    `appearance-none block py-2 pl-1 text-gray-700 text-sm leading-tight focus:outline-none focus:border-b-1 border-gray-400 peer ${
      hasError ? "border-red-500" : ""
    }`;
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-full focus:outline-none focus:shadow-outline min-w-20`;
  const errorClass = `text-red-600 text-center`;

  return (
    <div className="h-[63vh]">
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
              Sorry, this field cannot be changed. If you really need to, please
              contact the admin at ....
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
      <div className="text-sm ">
        <div className="pl-5 lg:pl-10 mt-5">
          <div className=" text-md ">Welcome to your account settings</div>
          <div className="text-xs font-extralight italic ">
            Your account was created on {createdAt}
          </div>
        </div>

        <form className="mt-5" onSubmit={handleUpdate}>
          <div className={inputDivClass}>
            <label htmlFor="companyName" className={labelClass}>
              Company Name:*
            </label>
            <input
              id="companyName"
              type="text"
              className={
                inputClass(companyNameError) + " lg:col-span-4  w-full "
              }
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className={inputDivClass}>
            <label htmlFor="slug" className={labelClass}>
              Company Slug:*{" "}
              <i
                className="fa-solid fa-circle-info"
                onClick={() => {
                  setSlugModalInfo(true);
                }}
              ></i>
            </label>
            <input
              id="slug"
              type="text"
              className={inputClass(slugError) + " w-full lg:col-span-4 "}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div className={inputDivClass}>
            <label htmlFor="companyEmail" className={labelClass}>
              Company Email:{" "}
              <i
                className="fa-solid fa-circle-info p-3 cursor-pointer"
                onClick={() => {
                  setEmailModalInfo(!emailModalInfo);
                }}
              ></i>
            </label>
            <p
              className={
                " w-full lg:col-span-4 appearance-none block  pl-1 text-gray-700 text-sm leading-tight border-gray-400 peer pb-4"
              }
            >
              {companyEmail}
            </p>
          </div>
          <div className={inputDivClass}>
            <label htmlFor="logo" className={labelClass}>
              Company Logo:*
            </label>
            <input
              id="logo"
              type="file"
              className={inputClass() + "col-span-4 w-full "}
              onChange={handleFileChange}
            />
            {logo && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs font-light mt-3">A sample of the image</p>
                <img
                  src={logo}
                  alt="Sample of image"
                  className="object-cover w-50 rounded-md my-2 "
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
              onClick={handleReset}
            >
              Reset Form
            </button>
          </div>
        </form>
        {errors && <div className={errorClass}>{JSON.stringify(errors)}</div>}
      </div>
    </div>
  );
};

export default SettingsAccount;
