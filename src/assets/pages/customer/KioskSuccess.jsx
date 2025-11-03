import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import useSocket from "../../hooks/useSocket";
import {
  primaryBgClass,
  primaryButtonClass,
  primaryTextClass,
  secondaryTextClass,
} from "../../styles/tailwind_styles";

//This path is for us to create a qr code that will direct customer to kioskWaiting page.
const KioskSuccess = () => {
  const { socket, isConnected } = useSocket();

  const location = useLocation();
  const data = location.state || {};
  const params = useParams();
  const navigate = useNavigate();
  const [queueItem, setQueueItem] = useState({});
  const [headingText, setHeadingText] = useState("");
  const [fromNewJoined, setFromNewJoined] = useState(false);

  const kioskWaitingPageUrl = `${window.location.origin}/${params.acctSlug}/kiosk/${queueItem.id}/qrScanned`;
  const kioskViewPageUrl = `/${params.acctSlug}/outlet/${data.data.outletId}/kiosk/${queueItem.queueId}`;

  const handleWaitWithoutScan = () => {
    navigate(kioskViewPageUrl, { replace: true });
  };
  useEffect(() => {
    console.log("Data from kioskSuccess", data.data);
    if (data.data.queueItem.length > 0) {
      //When data sent from Lost Waiting Page Button
      setQueueItem(data.data.queueItem[0]);
      setFromNewJoined(false);
      setHeadingText("QR Code for your waiting page.");
    } else {
      //When data sent from New Joined Queue in Kiosk View
      setQueueItem(data.data.queueItem);
      if (data.data.status === "existing") {
        setHeadingText("Your phone number exists for our queue.");
        setFromNewJoined(false);
      } else {
        setHeadingText("You've successfully joined the queue!");
        setFromNewJoined(true);
      }
    }
  }, [queueItem]);

  //SOCKET JOIN ROOM
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join_queue_item_id", `queueitem_${queueItem.id}`);
    }
  }, [socket, isConnected, queueItem]);

  //SOCKET LISTENING
  useEffect(() => {
    if (socket && isConnected) {
      console.log("Socket is connected. waiting for customer_waiting");
      socket.on("customer_waiting", (payload) => {
        console.log("There is a payload: ", payload);
        if (payload.queueItemId === queueItem.id) {
          navigate(kioskViewPageUrl, { replace: true });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("customer_waiting");
      }
    };
  }, [socket, isConnected]);

  return (
    <div className=" relative text-center flex justify-center">
      <div
        className={`flex flex-col  items-center justify-center p-5 lg:p-10 ${primaryBgClass} lg:max-w-2/3 rounded-2xl mt-5 lg:mt-15`}
      >
        <h1 className="text-2xl font-bold mb-4">{headingText}</h1>
        <div className="lg:flex gap-2 ">
          <div
            className={`flex flex-col items-center justify-center lg:flex-1/2 shadow-2xl lg:p-5 rounded-2xl p-5 lg:mb-0 mb-5 ${primaryBgClass}`}
          >
            <p className={`${primaryTextClass} mb-6 text-center text-xs`}>
              <span className={`font-light ${primaryTextClass} text-2xl`}>
                Scan
              </span>{" "}
              <br /> QR code below to view your real-time queue status on your
              phone.
              {JSON.stringify(kioskWaitingPageUrl)}
            </p>
            <div
              className={`p-5 ${primaryBgClass} rounded shadow-lg max-w-[240px]`}
            >
              <QRCode value={kioskWaitingPageUrl} size={200} />
            </div>
            {!fromNewJoined && (
              <button
                className={primaryButtonClass}
                onClick={handleWaitWithoutScan}
              >
                Wait Without Scanning QR Code
              </button>
            )}
          </div>
          {fromNewJoined && (
            <div
              className={`lg:flex-1/2 px-5 shadow-2xl lg:p-5 rounded-2xl py-5 ${primaryBgClass}`}
            >
              <p className={`${primaryTextClass} text-xs mb-5`}>
                <span className={`font-light ${primaryTextClass} text-2xl`}>
                  Or{" "}
                </span>{" "}
                <br />
                Click this button to confirm that you will be waiting within the
                confines of the store
              </p>
              <button
                className={primaryButtonClass}
                onClick={handleWaitWithoutScan}
              >
                Wait Without Scanning QR Code
              </button>{" "}
              <br />
              <p className={`${secondaryTextClass} italic mt-3 text-xs`}>
                If at anytime, you change your mind and would like to scan the
                qr code, please come back to the kiosk and select "Lost Waiting
                Page"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KioskSuccess;
