import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { msToMins } from "../../utils/timeConverter";
import UpdateOutletModal from "../../components/UpdateOutletModal";
import useApiPrivate from "../../hooks/useApiPrivate";
import AuthorisedUser from "./AuthorisedUser";
import useAuth from "../../hooks/useAuth";
import QRCode from "../../components/QRCodeButton";
import { unescapeHtml } from "../../utils/unescapeHtml";
import { numericalSort } from "../../utils/sortList";

const AllOutlets = () => {
  // Functional States
  const { isAuthenticated, accountId, reloadNav, setReloadNav } = useAuth();
  const apiPrivate = useApiPrivate();
  const navigate = useNavigate();

  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [acctName, setAcctName] = useState("");
  const [selectedOutletData, setSelectedOutletData] = useState(null);
  const [logo, setLogo] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [outletText, setOutletText] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [errors, setErrors] = useState("");
  const [errorsModal, setErrorsModal] = useState(false);
  const errorClass = `text-red-600 text-center`;

  const toggleEdit = (outletId) => {
    if (outletId) {
      const outletToEdit = outlets.find((outlet) => outlet.id === outletId);
      setSelectedOutletData(outletToEdit);
    } else {
      setSelectedOutletData(null);
    }
    setShowModal(!showModal);
  };

  const handleUpdateSuccess = (updatedOutlet) => {
    setRefreshTrigger((prev) => !prev);
    setReloadNav(!reloadNav);
    setShowModal(!showModal);
  };

  const handleAuthModalClose = () => {
    setErrors({
      general:
        "Forbidden. There was an issue with validating your staff account. ",
    });
    setErrorsModal(true);
    setShowAuthModal(false);
    //Navigate -1 ?
  };
  const handleNavSettingsAcct = () => {
    navigate(`/db/${accountId}/settings/account`);
  };

  const handleDelete = async (outlet) => {
    console.log("This is the outlet inside handle delete: ", outlet);
    setErrors("");
    setErrorsModal(false);
    setSelectedOutletData(outlet);
    setOutletId(outlet.id);
    setShowAuthModal(true);
  };
  const deleteOutletAllowed = async () => {
    try {
      const res = await apiPrivate.delete(
        `/delOutlet/${accountId}/${outletId}`
      );
      if (res.status === 201) {
        setRefreshTrigger((prev) => !prev);
        setReloadNav(!reloadNav);
        setShowAuthModal(false);
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: `Error deleting outlet ${outletId}` });
      setErrorsModal(true);
      setShowAuthModal(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !accountId) {
      console.log("Account id is not defined ", accountId);
      return;
    }
    const handleOutletText = (type) => {
      if (type === "RESTAURANT") {
        setOutletText("Outlet");
      } else if (type === "CLINIC") {
        setOutletText("Clinic");
      } else if (type === "BASIC") {
        setOutletText("Event Location");
      }
    };
    const fetchOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/allOutlets/${accountId}`);
        console.log("Res from all outlets: ", res.data);
        if (res?.data) {
          console.log("Res from all outlets: ", res.data);
          const sort = numericalSort(res.data.outlets);
          setOutlets(sort);
          setLogo(res.data.accountInfo.logo);
          const name = unescapeHtml(res.data.accountInfo.companyName);
          setAcctName(name);
          setBusinessType(res.data.accountInfo.businessType);
          handleOutletText(res.data.accountInfo.businessType);
        }
      } catch (error) {
        console.error(error);
        console.log("Error fetching data in ALL outlets");
        setErrors({ general: { error } });
        setErrorsModal(true);
      }
    };
    fetchOutlets();
  }, [accountId, refreshTrigger, isAuthenticated]);

  return (
    <div className="pt-15 md:pt-3">
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
              onSuccess={deleteOutletAllowed}
              onFailure={handleAuthModalClose}
              actionPurpose="Delete Outlet"
              minimumRole="MANAGER"
              outletId={selectedOutletData.id}
            />
          </div>
        </div>
      )}
      <div className="md:mt-5">
        <h1 className="ml-5 font-semibold mt">Welcome back, {acctName}</h1>
        <small className="ml-5 text-sm font-light italic text-stone-500">
          Organizing your queues for your business
        </small>
      </div>

      <div className="rounded-2xl p-3 relative m-1 text-center bg-primary-cream/60 shadow-lg border-1 border-transparent hover:border-white hover:shadow-white/90 cursor-pointer hover:text-primary-dark-green transition ease-in-out my-3 max-w-sm mx-auto md:hidden">
        <Link
          to={`/db/${accountId}/outlets/new`}
          className="font-extralight text-3xl"
        >
          Create New {outletText} +
        </Link>
      </div>

      <h1 className="ml-5 text-sm font-light italic text-stone-500 mb-5">
        Manage your existing {outletText}s...
      </h1>

      {!logo && (
        <div className="font-light text-primary-dark-green lg:absolute lg:top-0 lg:right-0 lg:w-50 lg:z-1 text-center p-3 bg-primary-cream/80 m-3 border-1 border-red-900">
          <h1 className="font-bold text-lg">Notification</h1>
          <p className="text-sm">
            Your <span className="font-medium">logo</span> is not set up yet,
            please{" "}
            <button
              onClick={handleNavSettingsAcct}
              className="bg-primary-dark-green text-white px-2 py-1 rounded-xl hover:bg-primary-green cursor-pointer"
            >
              Update Your Logo
            </button>
            .
          </p>
        </div>
      )}

      {errorsModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
            <button
              onClick={() => {
                setErrorsModal(!errorsModal);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <p className={errorClass}>{errors.general}</p>
          </div>{" "}
        </div>
      )}
      <div className="grid lg:grid-cols-2 grid-cols-1 mb-10">
        {outlets.map((outlet) => (
          <div
            className=" rounded-2xl p-3 relative m-1 text-center bg-primary-cream/70 shadow-lg "
            key={outlet.id}
          >
            <Link to={`/db/${accountId}/outlet/${outlet.id}`}>
              <img
                src={`${outlet.imgUrl}`}
                alt=""
                className="rounded-xl w-full"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/150x100/eeeeee/333333?text=Image+Error")
                }
              />
            </Link>

            <div className="z-10 text-xl font-semibold pt-2 text-primary-dark-green flex justify-center">
              <QRCode
                value={outlet.id}
                text={""}
                cssSpan={
                  "hover:text-primary-green transition ease-in cursor-pointer"
                }
                prevLocation={window.location.pathname}
              />
              {outlet.name}{" "}
              <span
                className="hover:text-primary-green transition ease-in cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  toggleEdit(outlet.id); // Pass the ID to toggleEdit
                }}
              >
                <i className="fa-solid fa-pen-to-square pl-1"></i>
              </span>
            </div>
            {outlet.location !== null && (
              <div className="z-10 pt-1 border-1 border-transparent">
                <p className="text-xs font-semibold">Location </p>
                <p className="font-light text-xs">{outlet.location}</p>
              </div>
            )}
            {outlet.googleMaps !== null && (
              <p className="z-10 text-primary-green pt-1 border-1 border-primary-green rounded-xl my-2 cursor-pointer hover:text-primary-dark-green hover:border-primary-dark-green transition ease-in">
                <Link to={`${outlet.googleMaps}`}>Google Map Link</Link>
              </p>
            )}
            {outlet.wazeMaps && (
              <p className="z-10 text-primary-green pt-1 border-1 border-primary-green rounded-xl my-2 cursor-pointer hover:text-primary-dark-green hover:border-primary-dark-green transition ease-in">
                <Link to={`${outlet.wazeMaps}`}>Waze Link</Link>
              </p>
            )}
            <div className="z-10 pt-1 border-1 border-transparent">
              <p className="text-xs font-semibold">Estimate Wait Time: </p>
              <p className="font-light text-sm">
                {msToMins(outlet.defaultEstWaitTime)} minutes
              </p>
            </div>
            {outlet.phone && (
              <div className="z-10 pt-1 border-1 border-transparent">
                <p className="text-xs font-semibold">Contact Number: </p>
                <p className="font-light text-sm">{outlet.phone}</p>
              </div>
            )}
            {outlet.hours && (
              <div className="z-10 pt-1 border-1 border-transparent">
                <p className="text-xs font-semibold">Opening Hours:</p>
                <p className="font-light text-sm">{outlet.hours}</p>
              </div>
            )}
            <div className="flex justify-center">
              <div
                className="text-center mt-3 transition ease-in text-red-700 font-light border-1 border-red-700 cursor-pointer
              py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline 
              md:w-2/3 active:bg-red-700 hover:bg-red-900 hover:text-white"
                onClick={() => handleDelete(outlet)}
              >
                <i className="fa-solid fa-trash"></i> Delete this {outletText}
              </div>
            </div>
          </div>
        ))}
      </div>

      <UpdateOutletModal
        show={showModal}
        onClose={toggleEdit} // Pass toggleEdit as the close handler
        outletData={selectedOutletData} // Pass the full outlet object
        accountId={accountId}
        onUpdateSuccess={handleUpdateSuccess}
        view={"modal"}
      />
    </div>
  );
};

export default AllOutlets;
