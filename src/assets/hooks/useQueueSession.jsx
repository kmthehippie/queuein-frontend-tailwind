import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getWithExpiry, removeLocalStorageItem } from "../utils/localStorage";
import api from "../api/axios";

const useQueueSession = (initialReceivedData) => {
  const [queueData, setQueueData] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const navigate = useNavigate();

  const fetchQueueData = useCallback(
    async (storedSession) => {
      setIsLoadingSession(true);
      try {
        console.log("Stored session in use queue session: ", storedSession);
        const response = await api.post(
          `/customerWaitingPage/${storedSession.acctSlug}/${storedSession.queueId}/${storedSession.queueItemId}`
        );
        if (response.status === 200 && response.data.queueItem.active) {
          console.log(
            "This is the response data from use queue session: ",
            response.data
          );
          setQueueData(response.data);
        } else {
          console.log(
            "Queue session no longer active or valid. (We deleted the LS)"
          );
          removeLocalStorageItem("queueItemLS");
          navigate(`/${storedSession.accountSlug}`);
        }
      } catch (error) {
        console.error(
          "Failed to verify queue session: (We deleted the LS)",
          error
        );
        removeLocalStorageItem("queueItemLS");
        navigate(`/${storedSession.accountSlug}`);
      } finally {
        setIsLoadingSession(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    console.log("initial received data: ", initialReceivedData);
    if (initialReceivedData) {
      setQueueData(initialReceivedData);
      setIsLoadingSession(false);
      return;
    } else {
      const storedSession = getWithExpiry("queueItemLS");
      if (storedSession) {
        fetchQueueData(storedSession);
      } else {
        // No valid session in localStorage
        console.log("No active queue session found in localStorage.");
        setIsLoadingSession(false);
        // navigate("/"); // Redirect to homepage or join queue page
      }
    }
  }, [initialReceivedData, fetchQueueData]);

  return { queueData, isLoadingSession };
};

export default useQueueSession;
