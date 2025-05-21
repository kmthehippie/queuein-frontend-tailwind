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

  useEffect(() => {
    console.log("Use effect in ALL outlets", params);
    const fetchOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/allOutlets/${params.accountId}`);
        if (res?.data) {
          setOutlets(res.data);
        }
      } catch (error) {
        console.error(error);
        console.log("Error fetching data in ALL outlets");
      }
    };
    fetchOutlets();
  }, [params.accountId]); // Depend on accountId if it can change

  console.log(params);

  return (
    <div className="">
      <div className=" rounded-2xl p-3 relative m-1 text-center bg-primary-cream/50 shadow-lg border-1 border-transparent hover:border-white hover:shadow-white/90 cursor-pointer hover:text-primary-dark-green transition ease-in-out md:my-10">
        <Link
          to={`/db/${params.accountId}/outlets/new`}
          className="font-light text-2xl"
        >
          Create New Outlet +
        </Link>
      </div>
      <div className="grid grid-cols-2 ">
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
            <div className="z-10 pt-1 border-1 border-transparent">
              <p className="text-xs font-semibold">Location </p>
              <p className="font-light text-xs">{outlet.location}</p>
            </div>

            <p className="z-10 text-primary-green pt-1 border-1 border-primary-green rounded-xl my-2 cursor-pointer hover:text-primary-dark-green hover:border-primary-dark-green transition ease-in">
              <Link to={`${outlet.googleMaps}`}>Google Map Link</Link>
            </p>
            <p className="z-10 text-primary-green pt-1 border-1 border-primary-green rounded-xl my-2 cursor-pointer hover:text-primary-dark-green hover:border-primary-dark-green transition ease-in">
              <Link to={`${outlet.wazeMaps}`}>Waze Link</Link>
            </p>
            <div className="z-10 pt-1 border-1 border-transparent">
              <p className="text-xs font-semibold">Estimate Wait Time: </p>
              <p className="font-light text-sm">
                {msToMins(outlet.defaultEstWaitTime)} minutes
              </p>
            </div>
            <div className="z-10 pt-1 border-1 border-transparent">
              <p className="text-xs font-semibold">Contact Number: </p>
              <p className="font-light text-sm">{outlet.phone}</p>
            </div>
            <div className="z-10 pt-1 border-1 border-transparent">
              <p className="text-xs font-semibold">Opening Hours:</p>
              <p className="font-light text-sm">{outlet.hours}</p>
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
