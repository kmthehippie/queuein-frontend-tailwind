// src/components/PermissionNotification.jsx
import React, { useCallback, useEffect, useState } from "react";
import useToast from "../hooks/useToast";

const PermissionNotification = ({ close }) => {
  const toast = useToast();
  const [localNotificationPermission, setLocalNotificationPermission] =
    useState(Notification.permission);

  const handleNotification = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      setLocalNotificationPermission(permission);

      if (permission === "granted") {
        toast.open("Notifications enabled! We'll alert you soon.", "success");
        close();
      } else if (permission === "denied") {
        toast.open(
          "Permission denied again. Please enable manually in browser settings.",
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

  useEffect(() => {
    if (localNotificationPermission === "granted") {
      close();
    }
  }, [localNotificationPermission, close]);

  const showUpdateButton = localNotificationPermission === "denied";

  return (
    <div className="text-center">
      <h3 className="font-bold text-lg mb-2">Notifications Off!</h3>
      <p className="text-sm">
        We will <span className="font-semibold">NOT</span> be able to properly
        notify you of your turn.
      </p>
      <p className="text-sm">
        Please either remain on this page, or{" "}
        {showUpdateButton && (
          <button
            className="mt-3 px-4 py-2 bg-white text-primary-green rounded-full font-semibold hover:bg-gray-100 transition ease-in-out duration-200"
            onClick={handleNotification}
          >
            Enable Notifications Now
          </button>
        )}
        {!showUpdateButton && (
          <span className="mt-3 text-sm italic text-gray-300">
            (Permission already granted or not applicable)
          </span>
        )}
        settings.
      </p>
    </div>
  );
};

export default PermissionNotification;
