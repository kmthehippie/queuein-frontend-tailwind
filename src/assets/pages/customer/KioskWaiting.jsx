import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { setWithExpiry } from "../../utils/localStorage";
import useLSContext from "../../hooks/useLSContext";

// This page is to fetch all the data we need. We are on a different browser.
// We need to grab data and set context...etc so that we can navigate to waiting.jsx
const KioskWaiting = () => {
  const { acctSlug, queueItem } = useParams();
  const { checkSession } = useLSContext();
  const localStorageExpiry = parseInt(import.meta.env.VITE_QUEUEITEMLS_EXPIRY);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //Fetch data that we need to go to waiting.jsx
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`kiosk/${acctSlug}/${queueItem}`);
      if (res.status === 201 || res.status === 200) {
        setLoading(false);
        console.log(res?.data);
        const data = { ...res.data };
        const storeToLocalStorage = {
          queueItemId: queueItem,
          queueId: res.data.queueItem.queueId,
          acctSlug: acctSlug,
        };
        setWithExpiry("queueItemLS", storeToLocalStorage, localStorageExpiry);
        checkSession();
        navigate(`/${acctSlug}/queueItem/${queueItem}`, {
          state: { data: data },
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleRetry = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    console.log("Fetching data in kiosk waiting page.");
    fetchData();
  }, []);

  return (
    <div className=" flex-row md:pt-5 md:pb-5 justify-self-center relative text-center">
      {loading && (
        <div className="flex flex-col justify-center items-center my-10">
          <h1 className="text-2xl font-bold text-center">Loading</h1>
          <div className="h-15 w-15 rounded-full border-4 border-gray-300 border-t-primary-light-green animate-spin"></div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center my-10 bg-primary-cream px-2 py-5 rounded-xl m-3 lg:px-6 lg:py-10 lg:rounded-4xl ">
        <h2 className="font-light text-2xl text-center text-stone-600 md:mt-5 mt-2 md:text-3xl lg:text-4xl mb-2 lg:max-w-2/3">
          Did we fail to load your waiting page?
        </h2>
        <button
          className="bg-primary-green w-auto mt-5 hover:bg-primary-dark-green transition ease-in text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default KioskWaiting;
