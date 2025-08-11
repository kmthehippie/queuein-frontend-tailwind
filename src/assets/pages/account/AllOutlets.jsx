import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { msToMins } from "../../utils/timeConverter";
import UpdateOutletModal from "../../components/UpdateOutletModal";
import useApiPrivate from "../../hooks/useApiPrivate";
import AuthorisedUser from "./AuthorisedUser";
import useAuth from "../../hooks/useAuth";
import QRCode from "../../components/QRCodeButton";
import { numericalSort } from "../../utils/sortList";

const AllOutlets = () => {
  // Functional States
  const { isAuthenticated, accountId } = useAuth();
  const apiPrivate = useApiPrivate();

  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [acctName, setAcctName] = useState("");
  const [selectedOutletData, setSelectedOutletData] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [errors, setErrors] = useState("");
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
    setShowModal(!showModal);
  };

  const handleAuthModalClose = () => {
    setErrors({ general: "Forbidden" });
    setShowAuthModal(false);
    //Navigate -1 ?
  };

  const handleDelete = async (outlet) => {
    console.log("Handle delete of this outlet ", outlet.id);
    setErrors("");
    setOutletId(outlet.id);
    setShowAuthModal(true);
  };
  const deleteOutletAllowed = async () => {
    console.log(outletId, " is the outlet we are deleting");
    try {
      const res = await apiPrivate.delete(
        `/delOutlet/${accountId}/${outletId}`
      );
      if (res.status === 201) {
        setRefreshTrigger((prev) => !prev);
        setShowAuthModal(false);
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: `Error deleting outlet ${outletId}` });
      setShowAuthModal(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !accountId) {
      console.log("Account id is not defined ", accountId);
      return;
    }

    const fetchOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/allOutlets/${accountId}`);
        if (res?.data) {
          const sort = numericalSort(res.data);
          setOutlets(sort);
          setAcctName(sort[0].account.companyName);
        }
      } catch (error) {
        console.error(error);
        console.log("Error fetching data in ALL outlets");
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
          Create New Outlet +
        </Link>
      </div>

      <h1 className="ml-5 text-sm font-light italic text-stone-500 mb-5">
        Manage your existing outlets...
      </h1>
      {errors && <p className={errorClass}>{errors.general}</p>}
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
                <i className="fa-solid fa-trash"></i> Delete this outlet
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
