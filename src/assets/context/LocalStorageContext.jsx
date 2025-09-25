import React, {
  createContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getWithExpiry, removeLocalStorageItem } from "../utils/localStorage";
import api from "../api/axios";

const LocalStorageContext = createContext(null);

export const LocalStorageProvider = ({ children }) => {
  const [activeQueueSession, setActiveQueueSession] = useState(false);
  const [queueItemId, setQueueItemId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkSession = useCallback(async () => {
    console.log("Checking session");
    setIsLoading(true);
    const storedSession = getWithExpiry("queueItemLS");
    if (storedSession === null) {
      setActiveQueueSession(false);
      return;
    }

    if (storedSession) {
      try {
        const res = await api.post("customerVerifyLS", storedSession);

        console.log(
          "Inside local storage context, checking customer verify ls: ",
          res
        );
        if (res.status === 200) {
          setQueueItemId(res.data.queueItemId);
          setActiveQueueSession(true);
          setIsLoading(false);
          return;
        } else {
          console.log("No res from customer verify local storage");
          removeLocalStorageItem("queueItemLS");
          setActiveQueueSession(false);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error(
          "Stored session customer verify local storage error",
          error
        );
        removeLocalStorageItem("queueItemLS");
        setActiveQueueSession(false);
        setIsLoading(false);

        return;
      }
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const contextValue = useMemo(() => {
    return {
      setActiveQueueSession,
      activeQueueSession,
      queueItemId,
      isLoading,
      checkSession,
    };
  }, [activeQueueSession, queueItemId, isLoading, checkSession]);

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export default LocalStorageContext;
