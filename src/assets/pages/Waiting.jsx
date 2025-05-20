import React, { useContext, useEffect, useState } from "react";

import { useLocation, Link, useNavigate } from "react-router-dom";

import moment from "moment";

import api from "../api/axios";

import SocketContext from "../context/SocketContext";

const Waiting = () => {
  const { socket, isConnected, reconnect } = useContext(SocketContext);

  const [accountInfo, setAccountInfo] = useState("");
  const [outlet, setOutlet] = useState("");
  const [queueItem, setQueueItem] = useState(null);
  const [customer, setCustomer] = useState("");
  const [pax, setPax] = useState("");
  const [newPax, setNewPax] = useState("");
  const [message, setMessage] = useState("");
  const [currentlyServing, setCurrentlyServing] = useState("");
  const [customerPosition, setCustomerPosition] = useState("");
  const [connection, setConnection] = useState(true);
  //ewt = estimated wait time
  const [ewt, setEwt] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalLeave, setModalLeave] = useState(false);
  const [barType, setBarType] = useState("");
  const [progressBar, setProgressBar] = useState("");
  const [partiesAhead, setPartiesAhead] = useState("");

  //* useStuff

  const navigate = useNavigate();

  const location = useLocation();

  const receivedData = location.state?.data;

  //* Helper functions

  const formatLastUpdated = (date) => {
    return moment(date).fromNow();
  };

  const calculateEstWaitTime = (custPos, currServ, estWaitTime) => {
    const inMs = (custPos - currServ + 1) * estWaitTime;
    const inMins = inMs / 1000 / 60;
    return inMins;
  };

  //* Tailwind class

  const labelClass = `text-gray-500 text-sm `;
  const dotClass = "animate-pulse bg-stone-800 w-1 h-1 rounded-full";
  const youClass =
    "bg-primary-light-green text-white text-xs text-center min-w-10 h-full flex items-center justify-center border-r-1 border-stone-100";

  const dotBGClass = "bg-stone-200 flex rounded-r w-full items-center h-full";
  const progBarClass =
    "flex w-full max-w-md justify-self-center mt-3 items-center h-[25px]";
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-full focus:outline-none focus:shadow-outline min-w-20`;

  //* INSTANTIATE

  useEffect(() => {
    console.log("This is the received data: ", receivedData);
    setAccountInfo(receivedData.accountInfo);
    setOutlet(receivedData.outlet);
    setQueueItem(receivedData.queueItem);
    setCustomer(receivedData.customer);
    setMessage(receivedData.message);
    setCustomerPosition(receivedData.position);
    setLastUpdated(new Date());
    setPax(receivedData.queueItem.pax);
    setEwt(receivedData.outlet.defaultEstWaitTime);
    setDataLoaded(true);
  }, []);

  //* SOCKET HERE
  //!SOMETHING WRONG WITH THE SOCKET. CURRENTLY SERVING AND YOUR NUMBER AND EWT NOT SHOWING. WE GET THESE INFO FROM SOCKET ONLY.
  useEffect(() => {
    if (socket && isConnected && queueItem?.queueId && queueItem?.customerId) {
      console.log(
        "Socket connected and queueItem available in Waiting. Setting up listeners and emitting initial events."
      );
      socket.emit("join_queue", `queue_${queueItem.queueId}`);
      console.log("Trying to set customer id, ", queueItem);
      socket.emit("set_customer_id", queueItem.customerId);
      socket.emit("cust_req_queue_refresh", queueItem.queueId);
      setConnection(true); // Update local connection state
    } else if (socket && !isConnected) {
      console.log(
        "Socket not connected, attempting to reconnect in 5 seconds..."
      );
      const timer = setTimeout(reconnect, 5000); // Retry every 5 seconds
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [socket, isConnected, queueItem?.queueId, queueItem?.customerId]);

  useEffect(() => {
    if (dataLoaded && queueItem !== null && !!socket && isConnected) {
      console.log(
        "Data is loaded and queueItem exist",
        !!dataLoaded,
        !!queueItem,
        socket
      );

      socket.on("queue_update", (data) => {
        console.log("connecting in socket");
        setLastUpdated(new Date());
        setProgressBar(data.queueList.arr);
        setCurrentlyServing(data.currentlyServing);
        setCustomerPosition(data.yourPosition);
        setBarType(data.queueList.type);
        setPartiesAhead(data.queueList.partiesAhead);
        setPax(data.pax);
      });

      socket.on("res_queue_refresh", (data) => {
        try {
          setLastUpdated(new Date());
          setProgressBar(data.queueList.arr);
          setCurrentlyServing(data.currentlyServing);
          setCustomerPosition(data.yourPosition);
          setBarType(data.queueList.type);
          setPartiesAhead(data.queueList.partiesAhead);
          setPax(data.pax);
          console.log("Res queue ", data);
        } catch (error) {
          console.error("Error in res_queue_refresh handler:", error);
        }
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("queue_update");
        socket.off("res_queue_refresh");
      };
    }
  }, [
    dataLoaded,
    queueItem?.queueId,
    queueItem?.id,
    customer?.id,
    socket,
    isConnected,
  ]);

  const leaveQueue = async (e) => {
    e.preventDefault();
    setModalLeave(true);
  };

  const handleLeaveQueue = async (e) => {
    e.preventDefault();

    try {
      const acctSlug = accountInfo.slug;
      const queueId = queueItem.queueId;
      const queueItemId = queueItem.id;
      console.log("Customer is trying to leave queue: ", queueItemId);
      const res = await api.post(
        `/customerQuit/${acctSlug}/${queueId}/${queueItemId}`
      );

      if (res?.status === 201) {
        console.log("201 status for leaving queue: ", res.data);
        console.log("This is the queueId before quit: ", queueId);

        socket.emit("queue_update", queueId);
        const navStateData = { ...res?.data };
        setTimeout(() => {
          navigate(`/${acctSlug}/leftQueue/${queueItemId}`, navStateData);
        }, 100);
      }
    } catch (error) {
      //* If error, we need to kick user out of queue and redirect to left queue page still.
      // as long as user hits this button, we kick them out
      console.error(error);
    }
  };

  const paxUpdate = (e) => {
    e.preventDefault();
    setModalUpdate(true);
  };

  const handlePaxUpdate = async (e) => {
    e.preventDefault();

    try {
      const acctSlug = accountInfo.slug;
      const queueId = queueItem.queueId;
      const queueItemId = queueItem.id;
      const dataToSend = { pax: newPax };
      const res = await api.post(
        `/customerUpdatePax/${acctSlug}/${queueId}/${queueItemId}`,
        dataToSend
      );

      if (res?.data) {
        if (socket && socket.connected && queueItem?.queueId) {
          socket.emit("cust_req_queue_refresh", queueItem.queueId);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setModalUpdate(false);
    setNewPax("");
  };

  //* REFRESH QUEUE USING SOCKETS

  const requestQueueRefresh = () => {
    if (socket && socket.connected && queueItem) {
      socket.emit("cust_req_queue_refresh", queueItem.queueId);
    } else {
      setConnection(false);
    }
  };

  return (
    <div className="flex-row items-center justify-center p-3 sm:p-5 md:pt-8 relative ">
      {modalLeave && (
        <div className="bg-primary-ultra-dark-green/85 min-w-full min-h-full absolute top-0 left-0 z-5">
          <div className="bg-primary-cream z-10 min-w-sm rounded-3xl text-center text-stone-700 absolute top-1/2 left-1/2 -translate-1/2 p-10 md:min-w-md">
            <h1 className="text-red-900 font-semibold text-2xl">Warning:</h1>

            <p>Do you want to leave the queue?</p>

            <br />

            <p className="text-xs/4 italic font-light">
              Agreeing to do so will <span className="font-semibold">kick</span>{" "}
              you out of the queue and you will lose your spot{" "}
              <span className="font-semibold">permanently.</span>
            </p>

            <p
              className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
              onClick={() => setModalLeave(false)}
            >
              X
            </p>

            <br />

            <button
              className={`${buttonClass} bg-primary-green hover:bg-primary-dark-green mr-3`}
              onClick={(e) => handleLeaveQueue(e)}
            >
              Yes
            </button>

            <button
              className={`${buttonClass} bg-red-700 hover:bg-red-900`}
              onClick={() => setModalLeave(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {modalUpdate && (
        <div className="bg-primary-ultra-dark-green/85 min-w-full min-h-full absolute top-0 left-0 z-5">
          <div className="bg-primary-cream z-10 min-w-sm rounded-3xl text-center text-stone-700 absolute top-1/2 left-1/2 -translate-1/2 p-10 md:min-w-md">
            <h1 className="text-red-900 font-semibold text-2xl">Warning:</h1>

            <p>
              Do you want to update the{" "}
              <span className="font-semibold">PAX?</span>
            </p>

            <br />

            <p className="text-xs/4 italic font-light">
              Agreeing to do so will permanently change your pax count and may
              lead to <span className="font-semibold">longer wait time. </span>
            </p>

            <form>
              <div className="mb-1">
                <label htmlFor="customer-pax" className={labelClass}>
                  New PAX
                </label>

                <input
                  className={`border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black`}
                  id="customer-pax"
                  type="number"
                  min="1"
                  max="12"
                  onChange={(e) => {
                    setNewPax(e.target.value);
                  }}
                  required
                />
              </div>
            </form>

            <p
              className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
              onClick={() => setModalUpdate(false)}
            >
              X
            </p>

            <br />

            <button
              className={`${buttonClass} bg-primary-green hover:bg-primary-dark-green mr-3`}
              onClick={(e) => handlePaxUpdate(e)}
            >
              Yes
            </button>

            <button
              className={`${buttonClass} bg-red-700 hover:bg-red-900`}
              onClick={() => setModalUpdate(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      <Link
        to={`/${accountInfo.slug}`}
        className="flex items-center pb-3 border-b-2 border-stone-400 "
      >
        <img
          src={accountInfo.logo || null}
          alt={`${accountInfo.companyName || null} logo`}
          className="w-20"
        />

        <h1 className="font-bold pl-3 text-2xl sm:text-4xl sm:pl-6 lg:text-6xl ">
          {accountInfo.companyName || null}
        </h1>
      </Link>

      <div className="text-center ">
        <h1 className="text-3xl font-light pt-3 text-stone-600">
          {outlet.name}
        </h1>

        <h4 className=" font-lg font-semibold py-3 text-primary-dark-green">
          {message}
        </h4>

        <h2 className="text-xs font-light italic text-stone-600 w-full md:w-md justify-self-center mb-1">
          Please keep this page open for us to notify you when it is your turn.
          This page will refresh every 30 seconds automatically.
        </h2>

        {/* GRID FOR QUEUE INFO */}

        {!dataLoaded && <div>Loading...</div>}

        <div className="grid grid-cols-2 w-full max-w-md bg-primary-cream rounded-lg shadow justify-self-center ">
          <div className="p-4 grid grid-rows-3 text-center border-b-1 border-r-1 border-stone-300 ">
            <div className="text-sm text-stone-600 ">Currently Serving</div>

            <div className="text-5xl row-span-2 font-bold">
              {currentlyServing || "N/A"}
            </div>
          </div>

          <div className="grid grid-cols-3 text-center border-b-1 border-stone-300">
            <div className="col-span-2 grid-rows-3 p-4">
              <div className="text-sm text-stone-600 ">Your Number</div>

              <div className="text-5xl row-span-2 font-bold">
                {customerPosition || "N/A"}
              </div>
            </div>

            {/* PAX Update */}

            <div
              className=" grid grid-rows-3 border-stone-300 border-l-1 p-4 cursor-pointer "
              onClick={paxUpdate}
            >
              <div className="text-sm text-stone-600 ">PAX</div>

              <div className="text-5xl row-span-2 font-bold text-primary-light-green hover:text-primary-dark-green transition ease-in-out duration-600">
                {pax}
              </div>
            </div>
          </div>

          {/* Estimated Wait Time */}

          <div className="p-4 text-center border-r-1 border-b-1 border-stone-300 grid grid-rows-3">
            <div className="text-sm text-stone-600 ">Estimated Wait Time</div>

            <div className="row-span-2">
              <div className="">
                {calculateEstWaitTime(customerPosition, currentlyServing, ewt) >
                30 ? (
                  <span className="font-semibold ">More than 30 minutes</span>
                ) : (
                  <span className="text-2xl/4 font-semibold">
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

          {/* Last Updated Time */}

          <div className="p-4 text-center border-b-1 border-stone-300 grid grid-rows-3">
            <div className="text-sm text-stone-600 ">Last Updated Time</div>

            <div className="text-md font-semibold px-1 row-span-2 ">
              <div className="flex justify-center">
                <span
                  className="cursor-pointer text-primary-light-green hover:text-primary-green active:text-primary-dark-green transition ease-in"
                  onClick={requestQueueRefresh}
                >
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </span>

                <span className="pl-2 text-[18px]/4 self-center">
                  {formatLastUpdated(lastUpdated)}
                </span>
              </div>

              <div className="text-[10px] font-light text-stone-400 mt-1">
                {connection
                  ? "Automatically updates if there are changes in the queue."
                  : "There are connectivity issues. Please refresh page."}
              </div>
            </div>
          </div>
        </div>

        {barType === "large-bar" && (
          <div className="grid grid-cols-6 w-full max-w-md justify-self-center mt-2">
            <div className="col-span-4 bg-primary-green text-white text-xs py-1 px-2 rounded-l text-start border-r-1 border-stone-100">
              {partiesAhead} parties ahead...
            </div>

            <div className={youClass}>YOU</div>

            <div className={dotBGClass + " justify-center"}>
              <div className={dotClass}></div>

              <div className={dotClass + " ml-1 [animation-delay:-0.3s]"}></div>

              <div className={dotClass + " ml-1 [animation-delay:-0.5s]"}></div>
            </div>
          </div>
        )}

        {barType === "short-bar" && (
          <div className="grid grid-cols-8 mt-3 h-7 justify-self-center w-full md:w-md">
            {progressBar.map((party, index) => (
              <div key={index} className="flex h-full">
                {party === customerPosition ? (
                  <span className="bg-primary-light-green text-white text-xs text-center w-full flex items-center justify-center border-r-1 border-stone-100">
                    YOU
                  </span>
                ) : (
                  <span className="bg-primary-green text-white text-xs text-center w-full flex items-center justify-center border-r-1 border-stone-100">
                    {party}
                  </span>
                )}
              </div>
            ))}

            <div
              className={`${dotBGClass} col-span-${8 - progressBar.length} `}
            >
              <div className={dotClass + " ml-1"}></div>

              <div className={dotClass + " ml-1 [animation-delay:-0.3s]"}></div>

              <div className={dotClass + " ml-1 [animation-delay:-0.5s]"}></div>
            </div>
          </div>
        )}

        {barType === "serving-you-bar" && (
          <div className={progBarClass}>
            <div className={youClass}>
              <span>YOU</span>
            </div>

            <div className={dotBGClass}>
              <div className={dotClass + " ml-1"}></div>

              <div className={dotClass + " ml-1 [animation-delay:-0.3s]"}></div>

              <div className={dotClass + " ml-1 [animation-delay:-0.5s]"}></div>
            </div>
          </div>
        )}

        <div className="p-4 text-center col-span-2">
          <div className="mb-3">
            <button
              onClick={leaveQueue}
              className="px-5 py-2 bg-red-700 rounded-full text-primary-cream font-light hover:bg-red-800 cursor-pointer transition ease-in"
            >
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
