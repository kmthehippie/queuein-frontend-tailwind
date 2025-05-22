import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiPrivate } from "../api/axios";
import { msToMins } from "../utils/timeConverter";
import UpdateOutletModal from "../components/UpdateOutletModal"; // Import the new modal component

const AllOutlets = () => {
  // Functional States
  const [outlets, setOutlets] = useState([]);
  const params = useParams();
  const [showModal, setShowModal] = useState(false);
  const [acctName, setAcctName] = useState("");
  const [selectedOutletData, setSelectedOutletData] = useState(null); // Store the full outlet object

  // Helper function to open modal and set data
  const toggleEdit = (outletId) => {
    if (outletId) {
      // Only set data if an ID is provided (opening for edit)
      const outletToEdit = outlets.find((outlet) => outlet.id === outletId);
      setSelectedOutletData(outletToEdit);
    } else {
      // If no ID, it's likely closing the modal
      setSelectedOutletData(null);
    }
    setShowModal(!showModal);
  };

  // Callback to update the outlets list after a successful edit
  const handleUpdateSuccess = (updatedOutlet) => {
    setOutlets((prevOutlets) =>
      prevOutlets.map((o) =>
        o.id === updatedOutlet.id ? { ...o, ...updatedOutlet } : o
      )
    );
  };

  //TODO: CHECK HOW TO HANDLE DELETE OF THE OUTLET. IF YES -> DELETE THE OUTLET
  //TODO: IF NO -> CLOSE THE MODAL
  const handleDelete = async (outlet) => {
    console.log("Handle delete of this outlet ", outlet);
    //are you sure you want to delete? yes -> delete no-> close modal
  };

  useEffect(() => {
    console.log("Use effect in ALL outlets", params);
    const fetchOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/allOutlets/${params.accountId}`);
        console.log("Res for all outlets ", res.data);
        if (res?.data) {
          setOutlets(res.data);
          setAcctName(res.data[0].account.companyName);
        }
      } catch (error) {
        console.error(error);
        console.log("Error fetching data in ALL outlets");
      }
    };
    fetchOutlets();
  }, [params.accountId]); // Depend on accountId if it can change

  return (
    <div className="">
      <div className="md:mt-5">
        <h1 className="ml-5 font-semibold">Welcome back, {acctName}</h1>
        <small className="ml-5 text-sm font-light italic text-stone-500">
          Organizing your queues for your business
        </small>
      </div>
      <div className="rounded-2xl p-3 relative m-1 text-center bg-primary-cream/50 shadow-lg border-1 border-transparent hover:border-white hover:shadow-white/90 cursor-pointer hover:text-primary-dark-green transition ease-in-out my-3 max-w-sm mx-auto md:hidden">
        <Link
          to={`/db/${params.accountId}/outlets/new`}
          className="font-extralight text-3xl"
        >
          Create New Outlet +
        </Link>
      </div>

      <h1 className="ml-5 text-sm font-light italic text-stone-500 mb-5">
        Manage your existing outlets...
      </h1>
      <div className="grid grid-cols-2 mb-10">
        {outlets.map((outlet) => (
          <div
            className=" rounded-2xl p-3 relative m-1 text-center bg-primary-cream/50 shadow-lg"
            key={outlet.id}
          >
            <Link to={`/db/${params.accountId}/outlet/${outlet.id}`}>
              <img
                src={`${outlet.imgUrl}`}
                alt=""
                className="rounded-xl"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/150x100/eeeeee/333333?text=Image+Error")
                }
              />
            </Link>
            <h1 className="z-10 text-xl font-semibold pt-2 text-primary-dark-green ">
              {outlet.name}{" "}
              <span
                className="hover:text-primary-green transition ease-in cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  toggleEdit(outlet.id); // Pass the ID to toggleEdit
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </span>
            </h1>
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
        accountId={params.accountId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default AllOutlets;
