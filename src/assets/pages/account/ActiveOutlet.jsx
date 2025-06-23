import React, { useEffect, useState, useCallback, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import CreateCustomer from "../../components/CreateCustomer";
import moment from "moment";
import SocketContext from "../../context/SocketContext";
import useApiPrivate from "../../hooks/useApiPrivate";
import useAuth from "../../hooks/useAuth";
import AuthorisedUser from "./AuthorisedUser";

const ActiveOutlet = () => {
  const { socket, isConnected, reconnect } = useContext(SocketContext);
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const location = useLocation();
  const apiPrivate = useApiPrivate();
  const staffInfo = location.state?.info;
  const [activeQueue, setActiveQueue] = useState(true);
  const [queueItems, setQueueItems] = useState([]);
  const [lg, setLg] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notice, setNotice] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [currentTime, setCurrentTime] = useState(moment());

  //HELPER FUNCTION
  const convertedTime = (date) => moment(date).fromNow();

  //TAILWIND CLASSES:
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const activeTableHeader = `text-xs text-primary-dark-green mr-5 ml-2`;
  const activeTableAnswer = `flex items-center justify-center text-sm `;
  const landscapeHeaderClass = `border-l-1 border-t-1 border-b-1 border-r-1 border-primary-green p-1`;
  const errorClass = `text-red-600 text-center`;
  const getWaitingTimeClass = useCallback(
    (date) => {
      const createdAt = moment(date);
      const minutesWaited = currentTime.diff(createdAt, "minutes");
      if (minutesWaited >= 20) {
        return " text-red-500";
      } else if (minutesWaited >= 10) {
        return " text-orange-500";
      }
    },
    [currentTime]
  );
  const getCalledTimeClass = useCallback(
    (date) => {
      if (date === null) {
        return "";
      } else {
        const calledAt = moment(date);
        const minutesCalled = currentTime.diff(calledAt, "minutes");
        if (minutesCalled >= 10) {
          return " text-red-500";
        } else if (minutesCalled >= 5) {
          return " text-orange-500";
        }
      }
    },
    [currentTime]
  );

  //SETTING TIMER FOR UPDATING THE WAITING TIME
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  //INITIALIZE DATA
  useEffect(() => {
    if (!isAuthenticated) return;

    const activeQueueItems = async () => {
      console.log(
        "Trying to fetch active queue items",
        `activeQueue/${params.accountId}/${params.outletId}/${params.queueId}`
      );
      try {
        const res = await apiPrivate.get(`activeQueue/${params.queueId}`);
        if (res?.data) {
          console.log("Queue Items?", res.data?.queueItems);
          setQueueItems(res.data?.queueItems);
        }
      } catch (error) {
        console.error(error);
        console.log("Error in trying to fetch active queue data");
      }
    };
    activeQueueItems();
  }, [isAuthenticated, params.queueId, apiPrivate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleMediaQueryChange = (e) => setLg(e.matches);
    setLg(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  //SOCKET HERE
  useEffect(() => {
    console.log("We are in socket trying to set staff info: ", staffInfo);
    if (socket && isConnected) {
      socket.emit("join_queue", `queue_${params.queueId}`);
      const infoForSocket = {
        staffId: staffInfo.staffId,
        staffRole: staffInfo.staffRole,
        staffName: staffInfo.staffName,
        outletId: params.outletId,
        accountId: params.accountId,
        queueId: params.queueId,
      };
      console.log("Info for the staff info socket ", infoForSocket);
      socket.emit("set_staff_info", infoForSocket);

      // Listener for queue updates from the backend via socket
      const handleHostQueueUpdate = (data) => {
        console.log("Host-queue_update is emitting.");
        console.log("Data from BACKEND from host_queue_update: ", data);
        if (data && data[0] && data[0].queueItems) {
          setQueueItems(data[0].queueItems);
        }
      };

      socket.on("host_queue_update", handleHostQueueUpdate);

      return () => {
        // Clean up: remove the event listener when the component unmounts
        socket.off("host_queue_update", handleHostQueueUpdate);
        // You might also want to leave the queue room here if necessary
        // socket.emit("leave_queue", `queue_${params.queueId}`);
      };
    }
  }, [
    socket,
    isConnected,
    staffInfo,
    params.outletId,
    params.accountId,
    params.queueId,
  ]);

  //HANDLES
  const handleAddCustomer = useCallback((e) => {
    e.preventDefault();
    setCreateCustomerModal(true);
  }, []);

  //? This handle called looks pretty good. Need to handle seated next
  const handleCalled = useCallback(
    async (e, id) => {
      const newCalledStatus = e.target.checked;
      setQueueItems((prevItems) =>
        prevItems.map((item) => {
          return item.id === id ? { ...item, called: newCalledStatus } : item;
        })
      );

      try {
        const res = await apiPrivate.patch(`/callQueueItem/${id}`, {
          called: newCalledStatus,
        });

        // The patch here also calls the emit from the backend, we don't need to do socket emit from the front end.

        if (res?.status === 201) {
          console.log("Call status updated on backend.");
        } else {
          setQueueItems((prevItems) =>
            prevItems.map((item) => {
              return item.id === id
                ? { ...item, called: !newCalledStatus }
                : item;
            })
          );
          console.error("Failed to update call status on backend.");
        }
      } catch (error) {
        console.error(error);
        setQueueItems((prevItems) =>
          prevItems.map((item) => {
            return item.id === id
              ? { ...item, called: !newCalledStatus }
              : item;
          })
        );
        console.error("Error updating call status.");
      }
    },
    [apiPrivate, socket, params.queueId]
  );

  const handleSeated = useCallback(
    async (e, id) => {
      const newSeatedStatus = e.target.checked;
      setQueueItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, seated: newSeatedStatus } : item
        )
      );

      try {
        const res = await apiPrivate.patch(`/seatQueueItem/${id}`, {
          seat: newSeatedStatus,
        });
        //! ADD THE SOCKET EMIT IN THE BACKEND AT PATCH DB CONTROLLER
        if (res?.status === 201) {
          console.log("Seated status updated on backend.");
        } else {
          setQueueItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, seated: !newSeatedStatus } : item
            )
          );
          console.error("Failed to update seated status on backend.");
        }
      } catch (error) {
        console.error(error);
        // Revert optimistic change on network error
        setQueueItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, seated: !newSeatedStatus } : item
          )
        );
        console.error("Error updating seated status.");
      }
    },
    [apiPrivate, socket, params.queueId]
  );

  const handleAuthModalClose = () => {
    setErrors({ general: "Forbidden" });
    setShowAuthModal(false);
    //Navigate -1 ?
  };
  const handleEndQueue = useCallback(() => {
    console.log("End Queue");
    setErrors("");
    setShowAuthModal(true);
  }, []);
  const endQueueAllowed = async () => {
    try {
      const res = await apiPrivate.post(
        `/endQueue/${params.accountId}/${params.outletId}/${params.queueId}`
      );
      if (res.status === 201) {
        console.log("Success on ending queue");
        setActiveQueue(false);
        //? Also, emit a socket event to inform others that the queue has ended. Do we want to do queue ended here, or should we do queue ended from the backend?
        socket.emit("queue_ended", params.queueId);
      } else {
        setErrors({ general: `Error ending queue ${params.queueId}` });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: `Error ending queue ${params.queueId}` });
    } finally {
      setShowAuthModal(false);
    }
  };

  const handleRefresh = () => {
    console.log(params.queueId);
    socket.emit("queue_update", params.queueId);
  };
  return (
    <div className="">
      {notification && (
        <p className="text-primary-green light text-xs">{notice}</p>
      )}
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
              onSuccess={endQueueAllowed}
              onFailure={handleAuthModalClose}
              actionPurpose="End Queue" // Changed actionPurpose for clarity
              minimumRole="MANAGER"
            />
          </div>
        </div>
      )}
      {/* Conditionally render End Queue button: show only if queue is active */}
      {activeQueue && ( // Only show if queue is active
        <button
          className={
            buttonClass +
            " bg-red-700 border-1 border-red-500 hover:bg-red-900 fixed top-0 right-0 lg:absolute mr-3"
          }
          onClick={handleEndQueue}
        >
          <i className="fa-solid fa-ban"></i>{" "}
          <span className="pl-3">End Queue</span>
        </button>
      )}
      {createCustomerModal && (
        <div className="">
          <p
            className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
            onClick={() => {
              setCreateCustomerModal(false);
            }}
          >
            X
          </p>
          <CreateCustomer
            onSuccess={handleRefresh}
            setModal={setCreateCustomerModal}
            setNotice={setNotice}
            setNotification={setNotification}
          />
        </div>
      )}
      {!createCustomerModal && (
        <div className="">
          {queueItems.length === 0 && (
            <div className="mt-3 font-semibold italic text-primary-dark-green">
              There are no customers in queue yet...
            </div>
          )}
          {errors && <p className={errorClass}>{errors.general}</p>}
          <button
            className={
              buttonClass +
              "  bg-primary-green hover:bg-primary-dark-green mr-3 border-1 border-primary-light-green px-15"
            }
            onClick={(e) => {
              handleAddCustomer(e);
            }}
          >
            Add Customer
          </button>

          {/* PORTRAIT */}
          {!lg && queueItems.length > 0 && (
            <div className="">
              <div className="">
                {queueItems.map((item) => {
                  // Only render active items in the first block
                  if (item.active === true) {
                    return (
                      <div className="" key={item.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-primary-cream ">
                          <div className="grid grid-cols-2 border-b-1">
                            <div className="flex items-center p-1 border-r-1">
                              <div className={activeTableHeader + " mr-5"}>
                                Customer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                {item.customer.name}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 border-b-1">
                            <div className="col-span-1 flex items-center p-1 border-r-1">
                              <div className={activeTableHeader}>PAX</div>
                              <div className={activeTableAnswer}>
                                {item.pax}
                              </div>
                            </div>
                            <div className="col-span-2 flex items-center p-1 ">
                              <div className={activeTableHeader}>
                                <i className="fa-solid fa-clock"></i> Waited
                              </div>
                              <div
                                className={
                                  activeTableAnswer +
                                  " text-xs" +
                                  getWaitingTimeClass(item.createdAt)
                                }
                              >
                                {convertedTime(item.createdAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center p-1 border-b-1">
                            <div className={activeTableHeader}>
                              <i className="fa-solid fa-phone"></i> Customer
                            </div>
                            <div className={activeTableAnswer}>
                              {item.customer.number}
                            </div>
                          </div>
                          <form className="flex items-center mt-1">
                            <div className={activeTableHeader}>Status</div>
                            <div className="flex">
                              <div
                                className={
                                  activeTableAnswer + " flex items-center ml-5"
                                }
                              >
                                <input
                                  type="checkbox"
                                  id={`called-${item.id}`} // Ensure unique IDs for labels
                                  className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                                  onChange={(e) => handleCalled(e, item.id)}
                                  checked={item.called || false} // Provide a default if undefined
                                />
                                <label
                                  htmlFor={`called-${item.id}`}
                                  className={
                                    activeTableAnswer +
                                    " ml-2 mr-5 " +
                                    getCalledTimeClass(item.calledAt)
                                  }
                                >
                                  Called
                                </label>
                              </div>
                              <div
                                className={
                                  activeTableAnswer + " flex items-center" // Corrected flex class
                                }
                              >
                                <input
                                  type="checkbox"
                                  id={`seated-${item.id}`} // Ensure unique IDs for labels
                                  className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                                  onChange={(e) => handleSeated(e, item.id)}
                                  checked={item.seated || false} // Provide a default if undefined
                                />
                                <label
                                  htmlFor={`seated-${item.id}`}
                                  className={activeTableAnswer + " ml-2"}
                                >
                                  Seated
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  }
                  return null; // Don't render if not active
                })}
              </div>
              {/* Separate sections for active, inactive, and quit for clarity in JSX */}
              <div className="">
                {queueItems.map((item) => {
                  if (item.active === false && item.quit === false) {
                    return (
                      <div className="" key={item.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-stone-300 ">
                          <div className="grid grid-cols-2">
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader + ""}>
                                Customer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                {item.customer.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="">
                {queueItems.map((item) => {
                  if (item.active === false && item.quit === true) {
                    return (
                      <div className="" key={item.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-red-950 text-white ">
                          <div className="grid grid-cols-2">
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader + ""}>
                                Customer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                {item.customer.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
          {/* HEADER FOR LANDSCAPE*/}
          {lg && queueItems.length > 0 && (
            <div className="hidden md:block overflow-auto">
              <div className="grid grid-cols-13 mt-3 rounded-md p-2 shadow-2xl bg-primary-cream text-center">
                <div
                  className={
                    landscapeHeaderClass +
                    " text-primary-dark-green col-span-2 border-l-10 rounded-l-xl"
                  }
                >
                  Customer Queue Number
                </div>
                <div
                  className={
                    landscapeHeaderClass + " text-primary-dark-green col-span-2"
                  }
                >
                  Time Waited
                </div>
                <div
                  className={
                    landscapeHeaderClass + " text-primary-dark-green col-span-1"
                  }
                >
                  PAX
                </div>
                <div
                  className={
                    landscapeHeaderClass + " text-primary-dark-green col-span-2"
                  }
                >
                  Customer Name
                </div>
                <div
                  className={
                    landscapeHeaderClass + " text-primary-dark-green col-span-3"
                  }
                >
                  Customer Contact Number
                </div>
                <div
                  className={
                    landscapeHeaderClass +
                    " text-primary-dark-green col-span-3 rounded-r-xl"
                  }
                >
                  Status
                </div>
              </div>
              {queueItems.map((item) => {
                if (item.active === true) {
                  return (
                    <div
                      className="grid grid-cols-13 px-2 pb-1 shadow-2xl bg-primary-cream text-center"
                      key={item.id}
                    >
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 border-l-10 rounded-l-xl p-1"
                        }
                      >
                        {item.position}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2" +
                          getWaitingTimeClass(item.createdAt)
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-1"}>
                        {item.pax}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-2"}>
                        {item.customer.name}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-3"}>
                        {item.customer.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-3 rounded-r-xl"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 ">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id={`called-landscape-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleCalled(e, item.id)}
                              checked={item.called || false}
                            />
                            <label
                              htmlFor={`called-landscape-${item.id}`}
                              className={
                                " ml-2 mr-2 text-xs " +
                                getCalledTimeClass(item.calledAt)
                              }
                            >
                              Called
                            </label>
                          </div>
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`seated-landscape-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleSeated(e, item.id)}
                              checked={item.seated || false}
                            />
                            <label
                              htmlFor={`seated-landscape-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              Seated
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {queueItems.map((item) => {
                if (item.active === false && item.quit === false) {
                  return (
                    <div
                      className="grid grid-cols-13 px-2 pb-1 shadow-2xl bg-primary-cream text-center"
                      key={item.id}
                    >
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 border-l-10 rounded-l-xl p-1 bg-stone-300"
                        }
                      >
                        {item.position}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-2 bg-stone-300"
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-1 bg-stone-300"
                        }
                      >
                        {item.pax}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-2 bg-stone-300"
                        }
                      >
                        {item.customer.name}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-3 bg-stone-300"
                        }
                      >
                        {item.customer.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-3 rounded-r-xl bg-stone-300"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 bg-stone-300">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id={`called-inactive-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleCalled(e, item.id)}
                              checked={item.called || false}
                            />
                            <label
                              htmlFor={`called-inactive-${item.id}`}
                              className={
                                " ml-2 mr-2 text-xs " +
                                getCalledTimeClass(item.calledAt)
                              }
                            >
                              Called
                            </label>
                          </div>
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`seated-inactive-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleSeated(e, item.id)}
                              checked={item.seated || false}
                            />
                            <label
                              htmlFor={`seated-inactive-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              Seated
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {queueItems.map((item) => {
                if (item.active === false && item.quit === true) {
                  return (
                    <div
                      className="grid grid-cols-13 px-2 pb-1 shadow-2xl bg-primary-cream text-center"
                      key={item.id}
                    >
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 border-l-10 rounded-l-xl p-1 bg-red-950 text-white"
                        }
                      >
                        {item.position}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 bg-red-950 text-white"
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-1 bg-red-950 text-white"
                        }
                      >
                        {item.pax}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 bg-red-950 text-white"
                        }
                      >
                        {item.customer.name}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-3 bg-red-950 text-white"
                        }
                      >
                        {item.customer.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-3 rounded-r-xl bg-red-950 text-white"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 bg-red-950 text-white">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id={`called-quit-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleCalled(e, item.id)}
                              checked={item.called || false}
                            />
                            <label
                              htmlFor={`called-quit-${item.id}`}
                              className={
                                " ml-2 mr-2 text-xs " +
                                getCalledTimeClass(item.calledAt)
                              }
                            >
                              Called
                            </label>
                          </div>
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`seated-quit-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleSeated(e, item.id)}
                              checked={item.seated || false}
                            />
                            <label
                              htmlFor={`seated-quit-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              Seated
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveOutlet;
