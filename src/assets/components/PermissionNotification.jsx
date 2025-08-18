// src/components/PermissionNotification.jsx
import React, { useCallback, useEffect, useState } from "react";
import useToast from "../hooks/useToast";

const PermissionNotification = ({ close }) => {
  const toast = useToast();
  const [localNotificationPermission, setLocalNotificationPermission] =
    useState(Notification.permission);
  // const [showModal, setShowModal] = useState(false);

  const handleNotification = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      setLocalNotificationPermission(permission);

      if (permission === "granted") {
        toast.open("Notifications enabled! We'll alert you soon.", "success");
        close();
      } else if (permission === "denied") {
        toast.open(
          "Permission to notify was denied. Please remain on this page to check if your turn is being called. If you would like to change the permission, you will need to go to settings of your browser and manually reset the site permissions.",
          "error",
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.open(
        "Failed to request notification permission. Please try manually.",
        "error"
      );
    }
  }, [close, toast]);
  // const handleToggleModal = () => {
  //   setShowModal(!showModal);
  // };
  useEffect(() => {
    if (localNotificationPermission === "granted") {
      close();
    }
  }, [localNotificationPermission, close]);

  const showUpdateButton = localNotificationPermission === "default";

  return (
    <div className="text-center">
      <h3 className="font-bold text-lg mb-2">Notifications Off!</h3>
      <p className="text-sm">
        We will <span className="font-semibold">NOT</span> be able to properly
        notify you.
      </p>

      <p className="text-sm">
        Please remain on this page <br />
        {showUpdateButton && (
          <span>
            {" "}
            or{" "}
            <button
              className="mt-3 px-4 py-2 bg-white text-primary-green rounded-full font-semibold hover:bg-gray-100 transition ease-in-out duration-200"
              onClick={handleNotification}
            >
              Enable Notifications Now
            </button>
          </span>
        )}
        {!showUpdateButton && (
          <span className="mt-3 text-sm italic text-gray-300">
            (Permission has already been denied.)
            {/* <br />
            <br />
            <button
              className=" text-primary-cream hover:text-primary-dark-green transition ease-in-out duration-200 cursor-pointer"
              onClick={handleToggleModal}
            >
              For more information to enable notifications:
            </button> */}
          </span>
        )}
      </p>
    </div>
  );
};

export default PermissionNotification;
