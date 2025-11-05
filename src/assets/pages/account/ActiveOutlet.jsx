import React, { useEffect, useState, useCallback, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateCustomer from "../../components/CreateCustomer";
import moment from "moment";
import SocketContext from "../../context/SocketContext";
import useApiPrivate from "../../hooks/useApiPrivate";
import useAuth from "../../hooks/useAuth";
import AuthorisedUser from "./AuthorisedUser";
import useToast from "../../hooks/useToast";
import PermissionNotification from "../../components/PermissionNotification";
import NotificationModal from "../../components/NotificationModal";
import {
  primaryButtonClass as buttonClass,
  checkBoxClass,
  primaryTextClass,
  primaryBgClass,
  errorClass,
} from "../../styles/tailwind_styles";
import { useBusinessType } from "../../hooks/useBusinessType";

const ActiveOutlet = () => {
  const { socket, isConnected } = useContext(SocketContext);
  const { isAuthenticated, accountId, acctSlug } = useAuth();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const apiPrivate = useApiPrivate();
  const toast = useToast();
  const { staffInfo } = location.state || {}; // Ensure it's an object, even if empty
  const { config } = useBusinessType();

  const [activeQueue, setActiveQueue] = useState(true);

  const [queue, setQueue] = useState({});
  const [showPax, setShowPax] = useState(false);
  const [queueItems, setQueueItems] = useState([]);
  const [maxQueueItems, setMaxQueueItems] = useState(0);
  const [lg, setLg] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [maxQueuersModal, setMaxQueuersModal] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notice, setNotice] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [currentTime, setCurrentTime] = useState(moment());
  const [highlightedItem, setHighlightedItem] = useState(null);

  const [updateMaxQueueItemsModal, setUpdateMaxQueueItemsModal] =
    useState(false);
  const [updateMaxQueueItemsModalError, setUpdateMaxQueueItemsModalError] =
    useState({});

  const [endQueueErrorModal, setEndQueueErrorModal] = useState(false);
  const [openNotifModal, setOpenNotifModal] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  //HELPER FUNCTION
  const convertedTime = (date) => moment(date).fromNow();

  //TAILWIND CLASSES:
  const activeTableHeader = `text-xs text-primary-dark-green dark:text-primary-light-green md:mr-5 mr-3 ml-2`;
  const activeTableAnswer = `flex items-center justify-center text-sm `;
  const landscapeHeaderClass = `border-l-1 border-t-1 border-b-1 border-r-1 border-primary-green p-1 `;
  const buttonClassInModals = `mt-3 transition ease-in text-white bg-primary-green cursor-pointer font-light py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline min-w-20 hover:bg-primary-dark-green`;
  const errorButtonInModals = `mt-3 transition ease-in text-white bg-red-700 cursor-pointer font-light py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline min-w-20 hover:bg-red-900`;

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
      setShowAuthModal(false);
    } else {
      //When user has left off
      navigate(`/db/${accountId}/outlet/${params.outletId}`, { replace: true });
    }
    setOpenNotifModal(true);
    const activeQueueItems = async () => {
      try {
        const res = await apiPrivate.get(
          `activeQueue/${params.accountId}/${params.queueId}/${params.outletId}`
        );
        if (res?.data) {
          console.log(
            "res data from active queue items: ",
            JSON.stringify(res?.data)
          );
          setQueueItems(res.data.queue.queueItems);
          setShowPax(res.data.showPax);
          setMaxQueueItems(res.data.queue.maxQueueItems);
          setQueue(res.data.queue);
        }
      } catch (error) {
        if (error.response.status === 406) {
          console.log("Max number of queue items allowed has been reached.");
        }
        console.error(error);
        console.log("Error in trying to fetch active queue data");
      }
    };
    activeQueueItems();
  }, [isAuthenticated, params.queueId, apiPrivate, params.outletId]);
  useEffect(() => {
    setShowPax(false); // Reset to default value
  }, [params.queueId, params.outletId]);
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
    if (socket && isConnected) {
      const alert = (header, body, soundEffect) => {
        console.log("when alert: ", header, body);
        if ("Notification" in window && Notification.permission === "granted") {
          const audio = new Audio(soundEffect);
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
          const newQueueItems = data.queueItems;
          setQueueItems(newQueueItems);
          console.log("Data notice: ", data.notice);

          if (data.notice && data.notice.action) {
            if (data.notice.action === "pax") {
              console.log(
                "Data notice action is pax: ",
                data.notice.queueItemId
              );
              const newQueueItem = newQueueItems.filter(
                (item) => item.id === data.notice.queueItemId
              );
              if (newQueueItem.length > 0) {
                alert(
                  "There is a pax change",
                  `${newQueueItem[0].name} has changed pax to ${newQueueItem[0].pax} `,
                  "/Ding.mp3"
                );
              } else {
                console.warn("Updated item not found in the new queue list.");
              }
              setHighlightedItem(data.notice.queueItemId);
              setTimeout(() => {
                setHighlightedItem(null);
              }, 120000);
            } else if (data.notice.action === "join") {
              console.log("someone joined queue", data.notice);
              const newQueueItem = newQueueItems.filter(
                (item) => item.id === data.notice.queueItemId
              );
              if (newQueueItem.length > 0) {
                alert(
                  "New Customer has Joined the Queue!",
                  `${newQueueItem[0].name} has joined with ${newQueueItem[0].pax} pax`,
                  "/Success.mp3"
                );
              }
            } else if (data.notice.action === "quit") {
              console.log("Someone quit the queue", data.notice);
              const newQueueItem = newQueueItems.filter(
                (item) => item.id === data.notice.queueItemId
              );
              if (newQueueItem) {
                alert(
                  "Customer has quit the queue.",
                  `${newQueueItem[0].name} has left the queue.`,
                  "/FailSound.mp3"
                );
              }
            } else if (data.notice.action === "noShow") {
              const newQueueItem = newQueueItems.filter(
                (item) => item.id === data.notice.queueItemId
              );
              console.log(`We set customer ${newQueueItem.name} as no show.`);
            } else if (data.notice.action === "updateMaxQueuers") {
              if (typeof data.notice.maxQueueItems === "number") {
                setMaxQueueItems(parseInt(data.notice.maxQueueItems));
                console.log("Prev queue: ", queue);
                setQueue((prev) => ({
                  ...prev,
                  maxQueueItems: data.notice.maxQueueItems,
                }));

                toast.open(
                  `Maximum number of queuers updated to ${data.notice.maxQueueItems}.`,
                  {
                    type: "info",
                    duration: 2000,
                    sticky: false,
                    id: "max-queue-items-updated",
                  }
                );
              }
            }
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
  const handleAddCustomer = useCallback(
    (e) => {
      e.preventDefault();
      console.log(
        "Max queue items and queueitems length: ",
        maxQueueItems,
        queueItems ? queueItems.length : 0
      );
      if (queueItems && queueItems.length >= maxQueueItems) {
        setMaxQueuersModal(true);
      } else {
        setCreateCustomerModal(true);
      }
    },
    [maxQueueItems, queueItems]
  );
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
  const handleEndQueue = () => {
    console.log("Trying to handle end queue", queueItems);
    queueItems.forEach((item) => {
      if (!item.seated && !item.noShow) {
        setEndQueueErrorModal(true);
        setShowAuthModal(false);
      } else {
        setEndQueueErrorModal(false);
        setShowAuthModal(true);
      }
    });
    setErrors("");
    if (maxQueuersModal === true) {
      setMaxQueuersModal(false);
    }
  };
  const endQueueAllowed = async () => {
    try {
      const res = await apiPrivate.post(
        `/endQueue/${accountId}/${params.outletId}/${params.queueId}`
      );
      console.log(res.data);
      if (res.status === 201) {
        setActiveQueue(false);
        //? Also, emit a socket event to inform others that the queue has ended. Do we want to do queue ended here, or should we do queue ended from the backend?
        socket.emit("queue_ended", res.data.queueId);
        navigate(`/db/${res.data.queueId}/outlet/${res.data.outletId}`, {
          replace: true,
        });
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
  const handleUpdateMaxQueueItems = async (e) => {
    e.preventDefault;
    setUpdateMaxQueueItemsModalError({});
    console.log(
      "Current max queue items and queueitems length: ",
      parseInt(maxQueueItems),
      queueItems ? queueItems.length : 0
    );
    if (queueItems ? parseInt(maxQueueItems) < queueItems.length : false) {
      console.log(
        maxQueueItems,
        queueItems.length,
        "Max queue items cf queue items length"
      );
      setUpdateMaxQueueItemsModalError({
        message: `Error: The maximum number of queuers [${maxQueueItems}] you tried to set is LESS THAN the current number of queuers [${queueItems.length}]`,
        classname: `border-1 p-2`,
      });
    } else if (
      parseInt(maxQueueItems) !== queue.maxQueueItems &&
      (queueItems ? parseInt(maxQueueItems) >= queueItems.length : true)
    ) {
      try {
        console.log("Try to send max queue items update ", maxQueueItems);
        console.log(queueItems ? queueItems.length : 0);
        console.log(queue.id);
        // SEND A POST TO UPDATE THE NUMBER OF QUEUERS.
        const res = await apiPrivate.patch(`/maxQueueItems/${queue.id}`, {
          maxQueueItems: parseInt(maxQueueItems),
        });
        console.log("Response from updating max queuers: ", res);
        if (res?.status === 201) {
          setQueue((prev) => ({
            ...prev,
            maxQueueItems: parseInt(maxQueueItems),
          }));
          setUpdateMaxQueueItemsModal(false);
          setUpdateMaxQueueItemsModalError({});
          toast.open(`Maximum number of queuers updated to ${maxQueueItems}.`, {
            type: "success",
            duration: 2000,
            sticky: false,
            id: "max-queue-items-updated-success",
          });

          console.log("Max Queuers Updated on Backend", res.data);
        } else {
          console.error("Failed to update max queuers on backend.");
          setUpdateMaxQueueItemsModalError({
            message: `Error: Unable to update maximum number of queuers to [${maxQueueItems}]`,
            classname: `border-1 p-2`,
          });
        }
      } catch (error) {
        console.error(error);
      }
    } else if (parseInt(maxQueueItems) === parseInt(queueItems.length)) {
      setUpdateMaxQueueItemsModalError({
        message: `Error: The maximum number of queuers [${maxQueueItems}] you tried to set is SAME AS the current number of queuers [${queueItems.length}]`,
        classname: `border-1 p-2`,
      });
      console.log("Cannot set max queuers to same as current queuers");
    } else if (parseInt(maxQueueItems) === parseInt(queue.maxQueueItems)) {
      setUpdateMaxQueueItemsModalError({
        message: `Error: The maximum number of queuers [${maxQueueItems}] you tried to set is SAME AS the current maximum number of queuers already set in the system [${queue.maxQueueItems}]`,
        classname: `border-1 p-2`,
      });
      console.log("Cannot set max queuers to same as current max queuers");
    }
  };
  const handleMaxQueuers = () => {
    console.log("Maximum number of queuers have been created for this queue");
    setNotice(
      "You can no longer add queuers as the maximum number of queuers have been reached"
    );
    setNotification(true);
    setMaxQueuersModal(true);
  };
  const handleNavKioskView = useCallback((e) => {
    e.preventDefault();
    console.log("This is the account slug", acctSlug);
    window.open(
      `${window.location.origin}/${acctSlug}/outlet/${params.outletId}/kiosk/${params.queueId}`
    );
  }, []);

  if (openNotifModal) {
    return (
      <NotificationModal
        title={`Hi ${staffInfo.staffName}!`}
        paragraph={`You have successfully logged in.`}
        onClose={() => {
          setOpenNotifModal(false);
        }}
      />
    );
  }

  if (endQueueErrorModal) {
    return (
      <NotificationModal
        title={`Error Ending Queue`}
        onClose={() => {
          setEndQueueErrorModal(false);
        }}
        content={
          <div className="text-center">
            <div className="font-semibold italic text-red-800 text-sm">
              Some {config.customerSingularLabel}/s are neither marked as No
              Show nor Seated.
            </div>
            <ul className="mt-2">
              {queueItems.map((item) => {
                if (!item.noShow && !item.seated) {
                  return (
                    <li key={item.id} className="text-xs">
                      <span className="font-bold text-primary-green p-2 text-lg">
                        {item.name}
                      </span>{" "}
                      is NOT marked as No Show nor {config.status.SEATED}.
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        }
        classNameDiv="max-w-md"
      />
    );
  }

  if (maxQueuersModal === true) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 ">
        <div className="flex flex-col items-center bg-primary-cream p-10 rounded-3xl m-2 max-w-[460px] text-center">
          <h1 className="text-2xl font-semibold text-center">Max queuers</h1>
          <p className="mt-3 font-light">
            You have reached the <span className="font-bold">maximum</span>{" "}
            number of queuers allowed in this queue.
          </p>
          <br />
          <div className="flex gap-3">
            <button
              className={buttonClassInModals}
              onClick={() => {
                setUpdateMaxQueueItemsModal(true);
                setMaxQueuersModal(false);
              }}
            >
              Change Max Queuers Allowed
            </button>
            <button
              className={errorButtonInModals}
              onClick={() => setMaxQueuersModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              minimumRole="TIER_3"
              outletId={params.outletId}
            />
          </div>
        </div>
      )}
      {activeQueue && (
        <button
          className={
            buttonClass +
            " bg-red-700 border-1 border-red-500 hover:bg-red-900 fixed top-0 right-0 lg:absolute mr-3 max-w-[180px]"
          }
          onClick={handleEndQueue}
        >
          <i className="fa-solid fa-ban"></i>{" "}
          <span className="pl-3">End Queue</span>
        </button>
      )}
      {updateMaxQueueItemsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            className={`flex flex-col items-center ${primaryBgClass} p-10 rounded-3xl m-2 max-w-[400px]`}
          >
            <h1 className="text-2xl font-extralight text-center">
              Update Maximum Queuers
            </h1>
            <p
              className={
                `text-red-700 text-center text-sm px-2 ` +
                updateMaxQueueItemsModalError.classname
              }
            >
              {updateMaxQueueItemsModalError.message}
            </p>
            <div className="flex flex-col items-center">
              <label htmlFor="maxQueueItems" className="mt-3 font-bold">
                Maximum number of Queuers Allowed
              </label>
              <input
                type="number"
                id="maxQueueItems"
                placeholder={maxQueueItems}
                onChange={(e) => {
                  setMaxQueueItems(e.target.value);
                }}
                className="border-1 p-2 text-center mt-2"
              />
            </div>
            <div className="flex gap-2">
              <div
                onClick={handleUpdateMaxQueueItems}
                className={buttonClassInModals}
              >
                Update
              </div>
              <div
                onClick={() => {
                  setUpdateMaxQueueItemsModal(false);
                  setMaxQueueItems(queue.maxQueueItems);
                  setUpdateMaxQueueItemsModalError({});
                }}
                className={errorButtonInModals}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}
      {createCustomerModal && (
        <div className="z-20 w-full flex items-center justify-center mt-8">
          <CreateCustomer
            onSuccess={handleRefresh}
            onFull={handleMaxQueuers}
            setModal={setCreateCustomerModal}
            showPax={showPax}
            setNotice={setNotice}
            setNotification={setNotification}
          />
        </div>
      )}
      {!updateMaxQueueItemsModal && !createCustomerModal && (
        <div
          className={` ${primaryTextClass} p-5 rounded-lg mb-5 md:ring-1 md:ring-primary-green/30`}
        >
          <div className="">
            <h3 className="lg:flex text-center lg:items-center">
              Current Maximum Number Of {config.customerLabel}:{" "}
              <div
                className="lg:px-5 lg:py-2 py-1 m-2 lg:ml-4 bg-primary-green text-white text-center rounded-lg cursor-pointer hover:bg-primary-dark-green "
                onClick={() => setUpdateMaxQueueItemsModal(true)}
              >
                {maxQueueItems}{" "}
                <i className="fa-solid fa-pen-to-square ml-2"></i>
              </div>
            </h3>
          </div>
          {queueItems && queueItems.length === 0 && (
            <div className="mt-3 font-semibold italic text-primary-dark-green dark:text-primary-light-green">
              There are no {config.customerSingularLabel} in queue yet...
            </div>
          )}
          {errors && <p className={errorClass}>{errors.general}</p>}
          <div className="flex gap-2 text-sm">
            <button
              className={
                "  bg-primary-green hover:bg-primary-dark-green md:max-w-[200px] border-1 border-primary-light-green transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
              }
              onClick={(e) => {
                handleAddCustomer(e);
              }}
            >
              + Add {config.customerSingularLabel}
            </button>
            <button
              className={
                "  bg-primary-green hover:bg-primary-dark-green md:max-w-[200px] border-1 border-primary-light-green transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
              }
              onClick={(e) => {
                handleNavKioskView(e);
              }}
            >
              Kiosk View
            </button>
          </div>
          {/* PORTRAIT */}
          {!lg && queueItems && queueItems.length > 0 && (
            <div className="">
              <div className="">
                <p
                  className={`text-sm ${primaryTextClass} font-semibold underline my-2`}
                >
                  Active {config.customerLabel}
                </p>
                {queueItems.map((item) => {
                  // Only render active items in the first block
                  if (item.active === true) {
                    return (
                      <div className="" key={item.id}>
                        <div
                          className={`flex-row w-full my-3 rounded-2xl p-2 shadow-2xl dark:shadow-white/20 dark:bg-stone-800/90`}
                        >
                          <div className="grid grid-cols-2 border-b-1">
                            <div className="flex items-center p-1 border-r-1">
                              <div className={activeTableHeader + " md:mr-5"}>
                                {config.customerSingularLabel} Number
                              </div>
                              <div
                                className={activeTableAnswer + "pr-2 md:pr-0"}
                              >
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 relative">
                              <div
                                className={`text-xs text-primary-dark-green dark:text-primary-light-green mr-3 ml-2`}
                              >
                                Name
                              </div>
                              <div className={activeTableAnswer + " "}>
                                <span className="z-1">
                                  {item.name || item?.Queuer?.name || "N/A"}
                                </span>
                                {item?.customer && (
                                  <span className="ml-2 px-2 py-0.5 absolute -top-2 -right-2 md:top-0 md:right-0 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                                    VIP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {showPax && (
                            <div className={`grid grid-cols-3 border-b-1`}>
                              <div className="col-span-1 flex items-center p-1 border-r-1">
                                <div className={activeTableHeader}>PAX</div>
                                <div
                                  className={
                                    activeTableAnswer +
                                    ` ${
                                      item.id === highlightedItem
                                        ? "bg-yellow-200 px-5"
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
                          )}

                          {!showPax && (
                            <div className="flex items-center p-1 border-b-1">
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
                          )}
                          <div className="flex items-center p-1 border-b-1">
                            <div className={activeTableHeader}>
                              <i className="fa-solid fa-phone"></i> Queuer
                            </div>
                            <div className={activeTableAnswer}>
                              {item.contactNumber ||
                                item?.customer?.number ||
                                "N/A"}
                            </div>
                          </div>
                          <form className="flex items-center mt-1">
                            <div className={activeTableHeader}>Status</div>
                            <div className="flex flex-wrap gap-1">
                              <div
                                className={
                                  activeTableAnswer +
                                  " flex items-center md:ml-5"
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
                                    " ml-1 md:ml-2 md:mr-5 " +
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
                                  className={
                                    activeTableAnswer + " ml-1 md:ml-2"
                                  }
                                >
                                  {config.status.SEATED}
                                </label>
                              </div>
                              <div
                                className={
                                  activeTableAnswer +
                                  " flex items-center md:ml-5"
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
                                  className={
                                    activeTableAnswer + " ml-1 md:ml-2 md:mr-5 "
                                  }
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
                <p
                  className={`text-sm ${primaryTextClass} font-semibold underline my-2`}
                >
                  Inactive {config.customerLabel}
                </p>
                {queueItems.map((item) => {
                  if (item.active === false && item.quit === false) {
                    return (
                      <div className="" key={item.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-stone-300 dark:bg-stone-900 ">
                          <div className="grid grid-cols-2">
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader + ""}>
                                Queuer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 relative">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                <span className="z-1">
                                  {item?.customer?.name || item.name || "N/A"}
                                </span>
                                {item?.customer && (
                                  <span className="ml-2 px-2 py-0.5 absolute -top-2 -right-2 md:top-0 md:right-0 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
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
                <p
                  className={`text-sm ${primaryTextClass} font-semibold underline my-2`}
                >
                  {config.customerLabel} Who Left The Queue
                </p>
                {queueItems.map((item) => {
                  if (item?.active === false && item?.quit === true) {
                    return (
                      <div className="" key={item?.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-red-950/50 text-white ">
                          <div className="grid grid-cols-2">
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader + ""}>
                                Queuer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 relative">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                <span className="z-1">
                                  {item?.customer?.name || item?.name || "N/A"}
                                </span>
                                {item?.customer && (
                                  <span className="ml-2 px-2 py-0.5 absolute -top-2 -right-2 md:top-0 md:right-0 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
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
          {lg && queueItems && queueItems.length > 0 && (
            <div className="hidden md:block overflow-auto">
              <div
                className={`grid grid-cols-13 mt-3 rounded-md p-2 shadow-2xl dark:shadow-white lg:shadow-none ${primaryBgClass} text-primary-dark-green dark:text-primary-light-green text-center `}
              >
                <div
                  className={
                    landscapeHeaderClass +
                    "  col-span-1 border-l-10 rounded-l-xl"
                  }
                >
                  Q#
                </div>
                <div className={landscapeHeaderClass + " col-span-2"}>
                  Time Waited
                </div>
                {showPax && (
                  <div className={landscapeHeaderClass + " col-span-1"}>
                    PAX
                  </div>
                )}
                <div className={landscapeHeaderClass + "  col-span-3"}>
                  {config.customerLabel} Name
                </div>
                <div className={landscapeHeaderClass + " col-span-2"}>
                  {config.customerLabel} Contact Number
                </div>
                <div
                  className={landscapeHeaderClass + "  col-span-4 rounded-r-xl"}
                >
                  Status <br />
                  {config.status.SEATED === "Seen" ? (
                    <div className="font-light text-xs mt-1">
                      <span className="font-semibold">Seen</span> -{" "}
                      <span className="italic">
                        Patient is being seen or has been seen.
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {queueItems.map((item) => {
                if (item.active === true) {
                  return (
                    <div
                      className={`grid grid-cols-13 px-2 pb-1 shadow-xl lg:shadow-none dark:text-primary-light-green text-center bg-white dark:bg-stone-600`}
                      key={item.id}
                    >
                      <div
                        className={
                          landscapeHeaderClass +
                          " dark:bg-stone-800/90 col-span-1 border-l-10 rounded-l-xl p-1"
                        }
                      >
                        {item.position}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " dark:bg-stone-800/90 col-span-2" +
                          getWaitingTimeClass(item.createdAt)
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      {showPax && (
                        <div
                          className={
                            landscapeHeaderClass +
                            ` dark:bg-stone-800/90 col-span-1
                           ${
                             item.id === highlightedItem ? "bg-yellow-200 " : ""
                           }`
                          }
                        >
                          {item.pax}
                        </div>
                      )}
                      <div
                        className={
                          landscapeHeaderClass +
                          " dark:bg-stone-800/90 col-span-3"
                        }
                      >
                        {item?.customer?.name || item?.name}
                        {item?.customer && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                            VIP
                          </span>
                        )}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " dark:bg-stone-800/90 col-span-2"
                        }
                      >
                        {item.contactNumber || item?.customer?.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " dark:bg-stone-800/90 col-span-4 rounded-r-xl"
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
                              {config.status.SEATED}
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
                      className={`grid grid-cols-13 px-2 pb-1 shadow-2xl lg:shadow-none text-center`}
                      key={item.id}
                    >
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-1 border-l-10 rounded-l-xl p-1 bg-stone-200 dark:bg-stone-900"
                        }
                      >
                        {item.position}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 bg-stone-200 dark:bg-stone-900"
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      {showPax && (
                        <div
                          className={
                            landscapeHeaderClass +
                            " col-span-1 bg-stone-200 dark:bg-stone-900"
                          }
                        >
                          {item.pax}
                        </div>
                      )}
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-3 bg-stone-200 dark:bg-stone-900"
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
                          landscapeHeaderClass +
                          " col-span-2 bg-stone-200 dark:bg-stone-900"
                        }
                      >
                        {item.contactNumber || item?.customer?.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-4 rounded-r-xl bg-stone-200 dark:bg-stone-900"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 bg-stone-200 dark:bg-stone-900">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id={`called-inactive-${item.id}`} // Unique ID
                              className={checkBoxClass}
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
                              className={checkBoxClass}
                              onChange={(e) => handleSeated(e, item.id)}
                              checked={item.seated || false}
                            />
                            <label
                              htmlFor={`seated-inactive-${item.id}`}
                              className={"text-xs ml-2"}
                            >
                              {config.status.SEATED}
                            </label>
                          </div>
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id={`noShow-inactive-${item.id}`} // Unique ID
                              className={checkBoxClass}
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
                      className={`grid grid-cols-13 px-2 pb-1 shadow-2xl lg:shadow-none ${primaryBgClass} text-center`}
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
                      {showPax && (
                        <div
                          className={
                            landscapeHeaderClass +
                            " col-span-1 bg-red-950/50 text-white"
                          }
                        >
                          {item.pax}
                        </div>
                      )}
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
                              {config.status.SEATED}
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
