import React, { useEffect, useState, useCallback, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import CreateCustomer from "../../components/CreateCustomer";
import moment from "moment";
import SocketContext from "../../context/SocketContext";
import useApiPrivate from "../../hooks/useApiPrivate";
import useAuth from "../../hooks/useAuth";
import AuthorisedUser from "./AuthorisedUser";
import useToast from "../../hooks/useToast";
import PermissionNotification from "../../components/PermissionNotification";

const ActiveOutlet = () => {
  const { socket, isConnected } = useContext(SocketContext);
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const location = useLocation();
  const apiPrivate = useApiPrivate();
  const toast = useToast();
  const { staffInfo } = location.state || {}; // Ensure it's an object, even if empty

  const [activeQueue, setActiveQueue] = useState(true);
  const [queueItems, setQueueItems] = useState([]);
  const [lg, setLg] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notice, setNotice] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [currentTime, setCurrentTime] = useState(moment());

  const [userInteracted, setUserInteracted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  //HELPER FUNCTION
  const convertedTime = (date) => moment(date).fromNow();

  //TAILWIND CLASSES:
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const activeTableHeader = `text-xs text-primary-dark-green mr-5 ml-2`;
  const activeTableAnswer = `flex items-center justify-center text-sm `;
  const landscapeHeaderClass = `border-l-1 border-t-1 border-b-1 border-r-1 border-primary-green p-1`;
  const errorClass = `text-red-600 text-center`;
  const [highlightedItem, setHighlightedItem] = useState(null);
  const getWaitingTimeClass = useCallback(
    (date) => {
      const createdAt = moment(date);
      const minutesWaited = currentTime.diff(createdAt, "minutes");
      if (minutesWaited >= 20) {
        return " text-red-500";
      } else if (minutesWaited >= 10) {
        return " text-orange-500";
      } else {
        return " ";
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
        } else {
          return " ";
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
    if (staffInfo) {
      console.log("Staff info has been set: ", staffInfo);
    }

    const activeQueueItems = async () => {
      try {
        const res = await apiPrivate.get(`activeQueue/${params.queueId}`);
        if (res?.data) {
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

  //HANDLE INTERACTION FOR NOTIFICATIONS
  //* HANDLE INTERACTION
  const handleUserInteraction = () => {
    if (!userInteracted) {
      const silentAudio = new Audio("/Ding.mp3");
      silentAudio.volume = 0;
      silentAudio
        .play()
        .catch((e) => console.error("Audio playback failed: ", e));
      setUserInteracted(true);
    }
  };
  //HANDLE USER INTERACTIONS
  useEffect(() => {
    setNotificationPermission(Notification.permission);
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("keydown", handleUserInteraction, { once: true });
    document.addEventListener("scroll", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction, {
        once: true,
      });
      document.removeEventListener("touchstart", handleUserInteraction, {
        once: true,
      });
      document.removeEventListener("keydown", handleUserInteraction, {
        once: true,
      });
      document.removeEventListener("scroll", handleUserInteraction, {
        once: true,
      });
    };
  }, [userInteracted]);
  //HANDLE NOTIFICATIONS
  useEffect(() => {
    if (!("Notification" in window)) {
      toast.open(
        "Your browser does not support notifications. We will not be able to notify you.",
        {
          type: "info",
          duration: null,
          sticky: true,
          id: "browser-notfi-unsupported",
        }
      );
    } else if (notificationPermission === "granted") {
      toast.open(
        "Notifications are active. We will notify you of your customers actions.",
        {
          type: "success",
          duration: 5000,
          sticky: false,
          id: "notif-perms-allowed",
        }
      );
    } else if (notificationPermission === "denied") {
      toast.open(PermissionNotification, {
        type: "info",
        duration: null,
        sticky: true,
        id: "notif-perms-denied",
      });
    } else if (notificationPermission === "default") {
      toast.open(PermissionNotification, {
        type: "info",
        duration: null,
        sticky: true,
        id: "notif-perms-default",
      });
    }
  }, [notificationPermission, toast.open]);
  //SOCKET HERE
  //EMIT
  useEffect(() => {
    if (socket && isConnected) {
      // socket.emit("join_queue", `queue_${params.queueId}`);
      const infoForSocket = {
        staffId: staffInfo.staffId,
        staffRole: staffInfo.staffRole,
        staffName: staffInfo.staffName,
        outletId: params.outletId,
        accountId: params.accountId,
        queueId: params.queueId,
      };
      socket.emit("set_staff_info", infoForSocket);
      socket.emit("join_host", `host_${params.queueId}`);
    }
  }, [socket, isConnected, params.outletId, params.accountId, params.queueId]);
  //LISTEN
  useEffect(() => {
    //if notificationPermission === "granted" then we open a toast to say notifications are active. We will update you when a customer joins the queue or changes the pax
    //Else just create a toast that says there is no notifications.
    if (socket && isConnected) {
      const alert = (header, body) => {
        if ("Notification" in window && Notification.permission === "granted") {
          const audio = new Audio("/Ding.mp3");
          audio
            .play()
            .catch((e) => console.error("Audio playback failed: ", e));
          new Notification(header, {
            body: body,
            vibrate: [200, 100],
          });
        }
      };
      const handleHostQueueUpdate = (data) => {
        if (data) {
          setQueueItems(data.queueItems);
          if (data.notice && data.notice.action === "pax") {
            const newQueueItems = data.queueItems;
            const newQueueItem = newQueueItems.filter(
              (item) => item.id === data.notice.queueItemId
            );
            const old = queueItems.filter(
              (items) => items.id === data.notice.queueItemId
            );
            alert(
              "There is a pax change",
              `${old[0].name} has changed pax from ${old[0].pax} to ${newQueueItem[0].pax} `
            );

            setHighlightedItem(newQueueItem[0].id);

            // Clear the highlight after 2 minutes (120000 ms)
            setTimeout(() => {
              setHighlightedItem(null);
            }, 120000);
            //Need a way to highlight the queueItemId that has changes and these highlighted changes only last maybe 5 minutes or something.
          } else if (data.notice && data.notice.action === "join") {
            const newQueueItems = data.queueItems;
            const newQueueItem = newQueueItems.filter(
              (item) => item.id === data.notice.queueItemId
            );
            alert(
              "New Customer has Joined the Queue!",
              `${newQueueItem[0].name} has joined with ${newQueueItem[0].pax} pax`
            );
            //Need a way to highlight the queueItemId that has changes and these highlighted changes only last maybe 5 minutes or something.
          }
        }
      };
      socket.on("host_queue_update", handleHostQueueUpdate);
      socket.on("host_update", handleHostQueueUpdate);
      return () => {
        socket.off("host_queue_update");
        socket.off("host_update");
      };
    }
  }, [socket, isConnected, params.outletId, params.accountId, params.queueId]);

  //HANDLES
  const handleAddCustomer = useCallback((e) => {
    e.preventDefault();
    setCreateCustomerModal(true);
  }, []);
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
        prevItems.map((item) => {
          return item.id === id ? { ...item, seated: newSeatedStatus } : item;
        })
      );

      try {
        const res = await apiPrivate.patch(`/seatQueueItem/${id}`, {
          seated: newSeatedStatus,
        });

        // The patch here also calls the emit from the backend, we don't need to do socket emit from the front end.

        if (res?.status === 201) {
          console.log("Call status updated on backend.");
        } else {
          setQueueItems((prevItems) =>
            prevItems.map((item) => {
              return item.id === id
                ? { ...item, seated: !newSeatedStatus }
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
              ? { ...item, seated: !newSeatedStatus }
              : item;
          })
        );
        console.error("Error updating call status.");
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
    setErrors("");
    setShowAuthModal(true);
  }, []);
  const endQueueAllowed = async () => {
    try {
      const res = await apiPrivate.post(
        `/endQueue/${params.accountId}/${params.outletId}/${params.queueId}`
      );
      if (res.status === 201) {
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
    socket.emit("queue_update", params.queueId);
  };
  const handleNoShow = useCallback(
    async (e, id) => {
      const newNoShowStatus = e.target.checked;

      try {
        const res = await apiPrivate.patch(`/noShowQueueItem/${id}`, {
          noShow: !!newNoShowStatus,
        });
        if (res?.status === 201) {
          console.log("no show status updated on backend.");
        } else {
          console.error("Failed to update no show status on backend.");
        }
      } catch (error) {
        console.error(error);
        console.error("Error updating no show status.");
      }
    },
    [apiPrivate, socket, params.queueId]
  );

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
              outletId={params.outletId}
            />
          </div>
        </div>
      )}
      {activeQueue && (
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
                                {item.name || item?.customer?.name || "N/A"}
                                {item?.customer && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                                    VIP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 border-b-1">
                            <div className="col-span-1 flex items-center p-1 border-r-1">
                              <div className={activeTableHeader}>PAX</div>
                              <div
                                className={
                                  activeTableAnswer +
                                  ` ${
                                    item.id === highlightedItem
                                      ? "bg-yellow-200 animate-pulse px-5"
                                      : ""
                                  }`
                                }
                              >
                                {item.pax || "N/A"}
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
                              {item.contactNumber ||
                                item?.customer?.number ||
                                "N/A"}
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
                              <div
                                className={
                                  activeTableAnswer + " flex items-center ml-5"
                                }
                              >
                                <input
                                  type="checkbox"
                                  id={`noShow-${item.id}`}
                                  className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                                  onChange={(e) => handleNoShow(e, item.id)}
                                  checked={item.noShow || false}
                                />
                                <label
                                  htmlFor={`noShow-${item.id}`}
                                  className={activeTableAnswer + " ml-2 mr-5 "}
                                >
                                  No Show
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
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
                                {item?.customer?.name || item.name || "N/A"}
                                {item?.customer && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                                    VIP
                                  </span>
                                )}
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
                  if (item?.active === false && item?.quit === true) {
                    return (
                      <div className="" key={item?.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-red-950/50 text-white ">
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
                                {item?.customer?.name || item?.name || "N/A"}
                                {item?.customer && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                                    VIP
                                  </span>
                                )}
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
                    " text-primary-dark-green col-span-1 border-l-10 rounded-l-xl"
                  }
                >
                  Cust Q#
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
                    landscapeHeaderClass + " text-primary-dark-green col-span-3"
                  }
                >
                  Customer Name
                </div>
                <div
                  className={
                    landscapeHeaderClass + " text-primary-dark-green col-span-2"
                  }
                >
                  Customer Contact Number
                </div>
                <div
                  className={
                    landscapeHeaderClass +
                    " text-primary-dark-green col-span-4 rounded-r-xl"
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
                          " col-span-1 border-l-10 rounded-l-xl p-1"
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
                      <div
                        className={
                          landscapeHeaderClass +
                          `col-span-1
                           ${
                             item.id === highlightedItem
                               ? "bg-yellow-200 animate-pulse"
                               : ""
                           }`
                        }
                      >
                        {item.pax}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-3"}>
                        {item?.customer?.name || item?.name}
                        {item?.customer && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-2"}>
                        {item.contactNumber || item?.customer?.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-4 rounded-r-xl"
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
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`noShow-landscape-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleNoShow(e, item.id)}
                              checked={item.noShow || false}
                            />
                            <label
                              htmlFor={`noShow-landscape-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              No Show
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
                // INACTIVE + NEVER QUIT
                if (item.active === false && item.quit === false) {
                  return (
                    <div
                      className="grid grid-cols-13 px-2 pb-1 shadow-2xl bg-primary-cream text-center"
                      key={item.id}
                    >
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-1 border-l-10 rounded-l-xl p-1 bg-stone-300"
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
                          landscapeHeaderClass + " col-span-3 bg-stone-300"
                        }
                      >
                        {item?.customer?.name || item.name}
                        {item?.customer && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                            VIP
                          </span>
                        )}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-2 bg-stone-300"
                        }
                      >
                        {item.contactNumber || item?.customer?.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-4 rounded-r-xl bg-stone-300"
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
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`noShow-inactive-${item.id}`} // Unique ID
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleNoShow(e, item.id)}
                              checked={item.noShow || false}
                            />
                            <label
                              htmlFor={`noShow-inactive-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              No Show
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
                          " col-span-1 border-l-10 rounded-l-xl p-1 bg-red-950/50 text-white"
                        }
                      >
                        {item.position || "N/A"}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 bg-red-950/50 text-white"
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-1 bg-red-950/50 text-white"
                        }
                      >
                        {item.pax}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-3 bg-red-950/50 text-white"
                        }
                      >
                        {item.name || "N/A"}
                        {item?.customer && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                            VIP
                          </span>
                        )}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 bg-red-950/50 text-white"
                        }
                      >
                        {item.contactNumber || item?.customer?.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-4 rounded-r-xl bg-red-950/50 text-white"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 text-white">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id={`called-quit-${item.id}`}
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
                              id={`seated-quit-${item.id}`}
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
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`noShow-quit-${item.id}`}
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleNoShow(e, item.id)}
                              checked={item.noShow || false}
                            />
                            <label
                              htmlFor={`noShow-quit-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              No Show
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
