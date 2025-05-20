import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiPrivate } from "../api/axios";

const AllOutlets = () => {
  const [outlets, setOutlets] = useState([]);
  const params = useParams();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [wazeMaps, setWazeMaps] = useState("");
  const [defaultEstWaitTime, setDefaultEstWaitTime] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");

  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const buttonClass = `bg-primary-green mt-3 hover:bg-primary-dark-green w-full transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline`;
  const inputDivClass = `px-3 py-1`;
  const inputClass = `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:border-black peer active:border-black`;

  const toggleEdit = (outletId) => {
    console.log("This is the outlet id you clicked", typeof outletId);

    setName("");
    setImgUrl("");
    setLocation("");
    setGoogleMaps("");
    setWazeMaps("");
    setDefaultEstWaitTime("");
    setPhone("");
    setHours("");
    if (typeof outletId === "number") {
      updateModalData(outletId);
    }

    setShowModal(!showModal);
  };

  const updateModalData = (outletId) => {
    const selectedOutlet = outlets.filter(
      (outlet) => outlet.id === outletId
    )[0];
    console.log("Filtered outlets:", selectedOutlet);

    setName(selectedOutlet.name);
    setImgUrl(selectedOutlet.imgUrl);
    setLocation(selectedOutlet.location);
    setGoogleMaps(selectedOutlet.googleMaps);
    setWazeMaps(selectedOutlet.wazeMaps);
    setDefaultEstWaitTime(selectedOutlet.defaultEstWaitTime);
    setPhone(selectedOutlet.phone);
    setHours(selectedOutlet.hours);
  };

  //* Helper functions
  const msToMins = (milliseconds) => {
    if (typeof milliseconds !== "number") {
      throw new TypeError("Input must be a number");
    }
    if (milliseconds < 0) {
      throw new RangeError("Input must be a non-negative number");
    }
    return milliseconds / (1000 * 60);
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
  }, []);

  const handleUpdate = () => {};

  if (showModal) {
    return (
      <div className="absolute w-[80%] md:w-md top-1/2 left-1/2 -translate-1/2  bg-primary-cream/80 rounded-3xl p-5">
        <button
          className="text-red-700 font-semibold absolute top-0 right-0 p-5 hover:text-red-900 transition ease-in cursor-pointer"
          onClick={toggleEdit}
        >
          X
        </button>
        <h1 className="text-2xl font-light text-center">
          {" "}
          Updating Your Outlet Details
        </h1>

        <form className="mt-5">
          <div className={inputDivClass}>
            <label htmlFor="name" className={labelClass}>
              Name:
            </label>
            <input
              id="name"
              type="text"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={inputDivClass}>
            <label htmlFor="location" className={labelClass}>
              Location:
            </label>
            <input
              id="location"
              type="text"
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className={inputDivClass}>
            <label htmlFor="googleMaps" className={labelClass}>
              Google Maps URL:
            </label>
            <input
              id="googleMaps"
              type="text"
              className={inputClass}
              value={googleMaps}
              onChange={(e) => setGoogleMaps(e.target.value)}
            />
            {/* //TODO: add a modal to guide users how to grab their google maps */}
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
              className={inputClass}
              value={wazeMaps}
              onChange={(e) => setWazeMaps(e.target.value)}
            />
            <p className="text-xs">
              Not sure how to find your waze maps url?{" "}
              <span>Click This For Guide</span>
            </p>
          </div>
          <div className={inputDivClass}>
            {/* //TODO: Eventually need to add the cloudinary and multer to handle this part */}

            <label htmlFor="imgUrl" className={labelClass}>
              URL for an image to your store:
            </label>
            <input
              id="imgUrl"
              type="text"
              className={inputClass}
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
          </div>
          <div className={inputDivClass}>
            {/* //TODO: add function to convert minutes to ms vice versa */}
            <label htmlFor="defaultEstWaitTime" className={labelClass}>
              An estimate wait time in ms:
            </label>
            <input
              id="defaultEstWaitTime"
              type="text"
              className={inputClass}
              value={defaultEstWaitTime}
              onChange={(e) => setDefaultEstWaitTime(e.target.value)}
            />
          </div>

          <button className={buttonClass} onClick={handleUpdate}>
            Submit Update
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="">
      <div className=" rounded-2xl p-3 relative m-1 text-center bg-primary-cream/50 shadow-lg border-1 border-transparent hover:border-white hover:shadow-white/90 cursor-pointer hover:text-primary-dark-green transition ease-in-out">
        <Link to="new outlet" className="font-light text-2xl">
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
              <img src={`${outlet.imgUrl}`} alt="" className="rounded-xl" />
            </Link>
            <h1 className="z-10 text-xl font-semibold pt-2 text-primary-dark-green ">
              {outlet.name}{" "}
              <span
                className="hover:text-primary-green transition ease-in cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  toggleEdit(outlet.id);
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
    </div>
  );
};

export default AllOutlets;
