import React, { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import api from "../../api/axios";
import Error from "../Error";
import moment from "moment";
import { formatMilliseconds } from "../../utils/timeConverter";
import Loading from "../../components/Loading";
import GetQRCode from "../../components/GetQRCode";

const OutletLanding = () => {
  const [accountInfo, setAccountInfo] = useState("");
  const [outlet, setOutlet] = useState("");
  const [queue, setQueue] = useState("");
  const [queueItemsLength, setQueueItemsLength] = useState(0);
  const [estWaitTime, setEstWaitTIme] = useState("N/A");
  const [status, setStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [lastUpdated, setLastUpdate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);

  const [showJoinButton, setShowJoinButton] = useState(false);
  const { acctSlug, outletId, queueId } = useParams();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const formatLastUpdated = (date) => {
    return moment(date).fromNow();
  };

  const fetchOutletData = useCallback(async () => {
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
      console.log("res from outlet data", res.data);
      if (res?.data) {
        setAccountInfo(res?.data?.accountInfo);
        setOutlet(res?.data?.outlet);
        if (res?.data?.queue) {
          console.log("Data from outlet landing page: ", res.data);
          setQueue(res?.data?.queue[0]);
          const activeItemsLength = res?.data?.activeItemsLength;
          setQueueItemsLength(activeItemsLength || "0");
          const ewt = res?.data?.outlet?.defaultEstWaitTime;
          const formattedEwt = formatMilliseconds(ewt, activeItemsLength);
          console.log(formattedEwt);
          setEstWaitTIme(formattedEwt);
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
  }, []);

  //TODO: LOGIC: ADD PAGE NAV FOR CUSTOMER TO ADD NAME AND NUMBER TO GET THEIR WAITING PAGE
  const handleNavigateQRCode = () => {
    console.log("Navigate to qr code scanning page for customer");
    //OR WE CAN JUST ADD A DIV ON TOP OF THE CURRENT PAGE FOR THEM TO ENTER THE DATA THEN FETCH THE QR CODE FOR THEM TO SCAN
  };

  useEffect(() => {
    console.log("Fetch data again! ");
    fetchOutletData();
  }, [fetchOutletData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("source") === "qr") {
      setShowJoinButton(true);
    }
  }, [location.search]);

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

  if (errors) {
    return <Error error={errors} />;
  }
  if (loading) {
    return (
      <Loading title={"Page"} paragraph={"The page you are on is loading"} />
    );
  }

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 ">
        <div className="flex flex-col items-center bg-primary-cream p-10 rounded-3xl m-2 relative lg:max-w-1/3">
          <h1 className="text-2xl font-extralight text-center">
            Get your waiting page.
          </h1>
          <p className="mt-3 font-bold ">
            Please fill in your name and number that you used to join queue.
          </p>
          <GetQRCode onClose={() => setShowModal(false)} />
          <button
            className={`absolute top-0 right-0 p-3 mr-2 font-bold text-red-800`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            X
          </button>
        </div>
      </div>
    );
  }

  if (queueId && queue) {
    return (
      <div className="flex-row items-center justify-items-center p-1 md:p-3 sm:p-5 md:pt-8 relative ">
        <div className="flex items-center justify-center pb-3 border-b-2 w-full border-stone-400 ">
          <img
            src={accountInfo.logo}
            alt={`${accountInfo.companyName} logo`}
            className="w-20"
          />
          <h1 className="font-bold pl-3 text-2xl sm:text-4xl sm:pl-6 lg:text-6xl ">
            {accountInfo.companyName}
          </h1>
        </div>
        <h1 className="font-light text-2xl text-center text-stone-600 md:mt-5 mt-2 md:text-3xl lg:text-4xl mb-2">
          {outlet.name}
        </h1>

        <div className="flex h-full gap-0 flex-col md:flex-row md:items-center rounded-xl max-w-4xl bg-primary-cream ">
          <div className="flex-1/2  h-full lg:flex justify-center md:p-2  items-center lg:flex-col">
            <div className="grid grid-cols-2 w-full justify-self-center">
              <div className="p-4 text-center border-r-1 md:border-y-1 border-b-1 md:border-l-1 border-stone-300 grid grid-rows-2">
                <div className="text-sm text-stone-600 font-semibold text-balance flex justify-center items-center">
                  Current # of Queuers in Queue
                </div>
                <div className="text-5xl font-bold text-primary-light-green">
                  {queueItemsLength}
                </div>
              </div>
              <div className="p-4 text-center md:border-y-1 border-b-1  border-stone-300 md:border-r-1 grid grid-rows-2 ">
                <div className="text-sm text-stone-600 font-semibold flex justify-center items-center">
                  Queue Status
                </div>
                <div className={statusClass}>{status}</div>
              </div>
              <div className="p-4 text-center border-r-1 border-b-1 h-full md:border-l-1 border-stone-300 grid grid-rows-4 gap-2">
                <div className="text-sm text-stone-600 font-semibold row-span-1">
                  Estimated Wait Time
                </div>
                <div className="md:text-xl text-lg row-span-2 flex justify-center items-center font-semibold">
                  {estWaitTime}
                </div>
                <div className="text-xs text-stone-400 row-span-1 flex justify-center items-center ">
                  Maybe inaccurate*
                </div>
              </div>
              <div className="p-4 text-center border-b-1 border-stone-300 md:border-r-1 grid grid-rows-4  h-full gap-2">
                <div className="text-sm text-stone-600 font-semibold row-span-1">
                  Last Updated Time
                </div>
                <div className=" font-semibold row-span-2 flex justify-center items-center">
                  <div className="flex pl-3">
                    <button
                      onClick={fetchOutletData}
                      className="cursor-pointer text-primary-light-green hover:text-primary-green active:text-primary-dark-green transition ease-in"
                    >
                      <i className="fa-solid fa-arrow-rotate-right"></i>
                    </button>
                    <span className="pl-1 text-sm md:text-md text-balance self-center">
                      {formatLastUpdated(lastUpdated)}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-light text-stone-400  flex justify-center items-center row-span-1">
                  Press <i className="fa-solid fa-arrow-rotate-right px-2"></i>{" "}
                  to refresh
                </div>
              </div>
            </div>

            <div className=" font-semibold text-center ">
              <button
                className="bg-primary-green mt-5  hover:bg-primary-dark-green transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Lost Waiting Page
              </button>
            </div>
          </div>
          <div className="flex-1/2 flex items-center justify-center">
            <div className="">
              <Outlet
                context={{ outletId, businessType: accountInfo.businessType }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
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
                <i
                  className="fa-brands fa-waze"
                  style={{ color: "#497B04" }}
                ></i>
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
        {queue && (
          <div className="grid grid-cols-2 w-full max-w-md bg-primary-cream rounded-lg shadow justify-self-center">
            <div className="p-4 text-center border-r-1 border-b-1 border-stone-300 grid grid-rows-2">
              <div className="text-sm text-stone-600 font-semibold">
                Current # of Queuers in Queue
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
              <div className="text-2xl font-semibold">{estWaitTime}</div>
              <div className="text-xs text-stone-400">Maybe inaccurate*</div>
            </div>
            <div className="p-4 text-center border-b-1 border-stone-300 grid grid-rows-3">
              <div className="text-sm text-stone-600 font-semibold">
                Last Updated Time
              </div>
              <div className="text-xl font-semibold px-1  row-span-2 ">
                <div className="flex">
                  <button
                    onClick={fetchOutletData}
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
            <div className="mt-2 text-xs text-center col-span-2 text-stone-600 px-5">
              <p className="">
                *This outlet's Estimated Wait Time maybe inaccurate due to it
                being new to our system.*
              </p>
            </div>
            {queue && showJoinButton && (
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
                  Please meet with our host. Join the queue via QR or ask the
                  host to add you to Queue.
                </div>
              </div>
            )}
          </div>
        )}
        {!queue && (
          <div className="flex items-center justify-center w-full">
            <img
              src={outlet.imgUrl}
              alt={`${outlet.name} store front`}
              className="w-180"
            />
          </div>
        )}
      </div>
    );
  }
};

export default OutletLanding;
