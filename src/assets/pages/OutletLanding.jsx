import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Error from "./Error";
import moment from "moment";

const OutletLanding = () => {
  const [accountInfo, setAccountInfo] = useState("");
  const [outlet, setOutlet] = useState("");
  const [queue, setQueue] = useState("");
  const [queueItemsLength, setQueueItemsLength] = useState(0);
  const [status, setStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [lastUpdated, setLastUpdate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const { acctSlug, outletId } = useParams();

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queueItemsLength > 5) {
      setStatus("Very Busy");
      setStatusClass("text-xl font-semibold text-red-600");
    } else if (queueItemsLength > 3) {
      setStatus("Busy");
      setStatusClass("text-xl font-semibold text-orange-400");
    } else if (queueItemsLength === 0) {
      setStatus("No Wait!");
      setStatusClass("text-xl font-semibold text-primary-light-green");
    } else {
      setStatus("Short Wait");
      setStatusClass("text-xl font-semibold text-primary-green");
    }
  }, [queueItemsLength]);

  const formatLastUpdated = (date) => {
    return moment(date).fromNow();
  };

  const fetchOutletLandingPageData = async () => {
    setAccountInfo("");
    setOutlet("");
    setQueue("");
    setLoading(true);
    setErrors("");
    setQueueItemsLength(0);
    setStatus("");
    setStatusClass("");

    try {
      const res = await api.get(`/outletLandingPage/${acctSlug}/${outletId}`);

      if (res?.data) {
        setAccountInfo(res?.data?.accountInfo);
        setOutlet(res?.data?.outlet);
        if (res?.data?.queue) {
          setQueue(res?.data?.queue[0]);
          setQueueItemsLength(res?.data?.queueItemsLength || "0");
        }
        setLastUpdate(new Date());
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching outlet landing page ", err);
      setLoading(false);
      setErrors({
        message: err?.response?.data?.message || err?.message,
        statusCode: err.response?.status || err?.status,
      });
    }
  };

  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setCurrentTime(new Date());
      console.log(formatLastUpdated(currentTime));
    }, 30000);

    const dataFetchInterval = setInterval(() => {
      fetchOutletLandingPageData();
      console.log("Fetching data due to set interval");
    }, 150000);

    fetchOutletLandingPageData(); // Initial fetch if no queueId
    return () => {
      console.log("clearing intervals");
      clearInterval(timeIntervalId);
      clearInterval(dataFetchInterval);
    };
  }, [outletId]);

  if (errors) {
    return <Error error={errors} />;
  }
  if (loading) {
    return <div>Loading Information...</div>;
  }

  return (
    <div className="flex-row items-center justify-center p-3 sm:p-5 md:pt-8 relative ">
      <Link
        to={`/${accountInfo.slug}`}
        className="flex items-center  pb-3 border-b-2 border-stone-400 "
      >
        <img
          src={accountInfo.logo}
          alt={`${accountInfo.companyName} logo`}
          className="w-20"
        />
        <h1 className="font-bold pl-3 text-2xl sm:text-4xl sm:pl-6 lg:text-6xl ">
          {accountInfo.companyName}
        </h1>
      </Link>
      <h1 className="font-light text-3xl text-center text-stone-600 mt-5 lg:text-4xl mb-2">
        {outlet.name}
      </h1>
      <div className="flex items-center justify-center space-x-4 mb-2 text-sm text-stone-500">
        {outlet.wazeMaps && (
          <div className="">
            <a href={outlet.wazeMaps} className="">
              <i className="fa-brands fa-waze" style={{ color: "#497B04" }}></i>
              <span className="pl-3  hover:text-primary-green">Waze</span>
            </a>
          </div>
        )}
        {outlet.googleMaps && (
          <div className=" ">
            <a href={outlet.googleMaps}>
              <i
                className="fa-solid fa-location-dot"
                style={{ color: "#497B04" }}
              ></i>
              <span className="pl-4  hover:text-primary-green">Maps</span>
            </a>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-stone-500">
        {outlet.hours && (
          <p className="">
            <i className="fa-solid fa-clock" style={{ color: "#497B04" }}></i>
            <span className="pl-3">{outlet.hours}</span>
          </p>
        )}
        {outlet.phone && (
          <p className="">
            <i className="fa-solid fa-phone" style={{ color: "#497B04" }}></i>
            <a
              href={`tel:${outlet.phone}`}
              className="pl-3  hover:text-primary-green"
            >
              {outlet.phone}
            </a>
          </p>
        )}
      </div>
      {/* Queue Information Grid */}
      <div className="grid grid-cols-2 w-full max-w-md bg-primary-cream rounded-lg shadow justify-self-center">
        <div className="p-4 text-center border-r-1 border-b-1 border-stone-300 grid grid-rows-2">
          <div className="text-sm text-stone-600 font-semibold">
            Current Customers in Queue
          </div>
          <div className="text-5xl font-bold text-primary-light-green">
            {queueItemsLength}
          </div>
        </div>
        <div className="p-4 text-center border-b-1 border-stone-300 grid grid-rows-2">
          <div className="text-sm text-stone-600 font-semibold">
            Queue Status
          </div>
          <div className={statusClass}>{status}</div>
        </div>
        <div className="p-4 text-center border-r-1 border-b-1 border-stone-300 grid grid-rows-3">
          <div className="text-sm text-stone-600 font-semibold">
            Estimated Wait Time
          </div>
          <div className="text-2xl font-semibold">17 minutes</div>
          <div className="text-xs text-stone-400">Maybe inaccurate*</div>
        </div>
        <div className="p-4 text-center border-b-1 border-stone-300 grid grid-rows-3">
          <div className="text-sm text-stone-600 font-semibold">
            Last Updated Time
          </div>
          <div className="text-xl font-semibold px-1  row-span-2 ">
            <div className="flex">
              <button
                onClick={fetchOutletLandingPageData}
                className="cursor-pointer text-primary-light-green hover:text-primary-green active:text-primary-dark-green transition ease-in"
              >
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </button>
              <span className="pl-2 text-md self-center">
                {formatLastUpdated(lastUpdated)}
              </span>
            </div>
            <div className="text-xs font-light text-stone-400">
              Press <i className="fa-solid fa-arrow-rotate-right"></i> to
              refresh
            </div>
          </div>
        </div>
        {queue && (
          <div className="p-4 text-center col-span-2">
            <div className="font-bold text-xl mb-3">
              <h1>Save your spot! </h1>
            </div>
            <Link to={`/${acctSlug}/join/${queue.id}`}>
              <div className="mb-3">
                <button className="px-5 py-2 bg-primary-light-green rounded-full text-primary-cream font-light hover:bg-primary-green cursor-pointer transition ease-in">
                  Join Queue{" "}
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                </button>
              </div>
            </Link>
            <div className="text-stone-400 text-xs italic ">
              Please meet with our host. Join the queue via QR or ask the host
              to add you to Queue.
            </div>
          </div>
        )}
      </div>
      {queue && (
        <p className="mt-2 text-xs text-center text-stone-600 max-w-md justify-self-center">
          *This outlet's Estimated Wait Time maybe inaccurate due to it being
          new to our system.*
        </p>
      )}
    </div>
  );
};

export default OutletLanding;
