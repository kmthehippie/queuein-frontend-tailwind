import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import moment from "moment";
import { io } from "socket.io-client";
import api from "../api/axios";

const Waiting = () => {
  const [accountInfo, setAccountInfo] = useState("");
  const [outlet, setOutlet] = useState("");
  const [queueItem, setQueueItem] = useState("");
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState("");

  const [currentlyServing, setCurrentlyServing] = useState("");
  const [queueLength, setQueueLength] = useState("");
  const [customerPosition, setCustomerPosition] = useState("");
  const [connection, setConnection] = useState(true);
  const [socket, setSocket] = useState(null);

  const [ewt, setEwt] = useState("");
  const [test, setTest] = useState("");

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dataLoaded, setDataLoaded] = useState(false);
  const location = useLocation();
  const receivedData = location.state?.data;
  const formatLastUpdated = (date) => {
    return moment(date).fromNow();
  };
  const calculateEstWaitTime = (custPos, currServ, estWaitTime) => {
    const inMs = (custPos - currServ + 1) * estWaitTime;
    const inMins = inMs / 1000 / 60;
    return inMins;
  };

  useEffect(() => {
    console.log("Check received data here", receivedData);
    setAccountInfo(receivedData.accountInfo);
    setOutlet(receivedData.outlet);
    setQueueItem(receivedData.queueItem);
    setCustomer(receivedData.customer);
    setMessage(receivedData.message);
    setLastUpdated(new Date());
    setDataLoaded(true);
    setEwt(receivedData.outlet.defaultEstWaitTime);
  }, []);

  useEffect(() => {
    console.log("Turn on sockets?");
    console.log(dataLoaded, queueItem);
    if (dataLoaded && queueItem?.queueId) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        query: {
          queueItem: queueItem.id,
        },
      });
      console.log("Yes sockets turned on");
      socket.on("connect", () => {
        console.log("Connected to Socket IO server");
        socket.emit("join_queue", `queue_${queueItem.queueId}`);
        setConnection(true);
        setSocket(socket);
      });
      socket.on("disconnect", () => {
        console.log("Disconnect from Socket IO server");
        setConnection(false);
      });

      socket.on("queue_update", (data) => {
        setLastUpdated(new Date());
        setCurrentlyServing(data.currentlyServing);
        setQueueLength(data.queueLength);
        setCustomerPosition(data.yourPosition);
        setTest(data);
        console.log(ewt * (customerPosition - currentlyServing));
      });

      socket.on("res_queue_refresh", (data) => {
        try {
          console.log("REFRESH!", data);
          setLastUpdated(new Date());
          setTest(data);
          setCurrentlyServing(data.currentlyServing);
          setQueueLength(data.queueLength);
          setCustomerPosition(data.yourPosition);
          setTest(data);
        } catch (error) {
          console.error("Error in res_queue_refresh handler:", error);
        }
      });

      return () => {
        console.log("Unmounting so disconnecting sockets");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("queue_update");
        socket.off("res_queue_refresh");
        socket.disconnect();
      };
    }
  }, [dataLoaded, queueItem?.queueId, queueItem?.id, customer?.id]);

  const leaveQueue = async (e) => {
    e.preventDefault();
    //TODO: first we need to have a modal pop up to confirm that user wishes to leave the queue.
    //TODO: if we get second confirmation, then we can proceed to TRY CATCH block
    try {
      const acctSlug = accountInfo.slug;
      const queueId = queueItem.queueId;
      const queueItemId = queueItem.id;
      const res = await api.post(
        `/customerQuit/${acctSlug}/${queueId}/${queueItemId}`
      );
      //* If leave queue is successful, navigate to Left Queue Page.
      if (res?.data) {
        //navigate to left queue page
      }
    } catch (error) {
      //* If error, we need to kick user out of queue and redirect to left queue page still.
      // as long as user hits this button, we kick them out.
      console.error(error);
    }
  };
  const requestQueueRefresh = () => {
    if (socket && socket.connected && queueItem) {
      socket.emit("cust_req_queue_refresh", queueItem.queueId);
    } else {
      setConnection(false);
    }
  };
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
      <div className="text-center">
        <h1 className="text-3xl font-light pt-3 text-stone-600">
          {outlet.name}
        </h1>
        <h4 className=" font-lg font-semibold py-3 text-red-900">{message}</h4>
        <h2 className="text-xs font-light italic  text-stone-600">
          Please keep this page open for us to notify you when it is your turn.
          This page will refresh every 30 seconds automatically.
        </h2>
        {/* GRID FOR QUEUE INFO */}
        {JSON.stringify(test)}
        <div className="grid grid-cols-2 w-full max-w-md bg-primary-cream rounded-lg shadow justify-self-center">
          <div className="grid grid-rows-3 p-4 text-center border-r-1 border-b-1 border-stone-300">
            <div className="text-sm  text-stone-600 ">Your Number</div>
            <div className="text-5xl row-span-2 font-bold">
              {customerPosition || "N/A"}
            </div>
          </div>
          <div className="p-4 grid-rows-3  text-center border-b-1 border-stone-300 grid ">
            <div className="text-sm text-stone-600 ">Currently Serving</div>
            <div className="text-5xl row-span-2 font-bold">
              {currentlyServing || "N/A"}
            </div>
          </div>
          <div className="p-4 text-center border-r-1 border-b-1 border-stone-300 grid grid-rows-3">
            <div className="text-sm text-stone-600 ">Estimated Wait Time</div>
            <div className="row-span-2">
              <div className="">
                {calculateEstWaitTime(customerPosition, currentlyServing, ewt) >
                30 ? (
                  <span className="font-semibold">More than 30 minutes</span>
                ) : (
                  <span className="text-2xl font-semibold">
                    {calculateEstWaitTime(
                      customerPosition,
                      currentlyServing,
                      ewt
                    )}{" "}
                    minutes
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-400">
                Maybe inaccurate due to new account*
              </div>
            </div>
          </div>
          <div className="p-4 text-center border-b-1 border-stone-300 grid grid-rows-3">
            <div className="text-sm text-stone-600 ">Last Updated Time</div>
            <div className="text-md font-semibold px-1  row-span-2 ">
              <div className="flex justify-center">
                <span
                  className="cursor-pointer text-primary-light-green hover:text-primary-green active:text-primary-dark-green transition ease-in"
                  onClick={requestQueueRefresh}
                >
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </span>
                <span className="pl-2 text-md self-center">
                  {formatLastUpdated(lastUpdated)}
                </span>
              </div>
              <div className="text-xs font-light text-stone-400">
                {connection
                  ? "Automatically updates if there are changes in the queue."
                  : "There are connectivity issues. Please refresh page."}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 text-center col-span-2">
          <div className="mb-3" onClick={leaveQueue}>
            <button className="px-5 py-2 bg-red-700 rounded-full text-primary-cream font-light hover:bg-red-800 cursor-pointer transition ease-in">
              <span className="font-semibold">LEAVE</span> Queue{" "}
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
          </div>

          <div className=" text-xs font-medium italic ">
            *Clicking this button will kick you out of the queue. <br />
            You will lose your spot and have to rejoin the queue again.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
