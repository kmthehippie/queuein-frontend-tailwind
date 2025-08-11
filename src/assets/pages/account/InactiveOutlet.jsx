import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import AuthorisedUser from "./AuthorisedUser";
import useApiPrivate from "../../hooks/useApiPrivate";

const InactiveOutlet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [queueName, setQueueName] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const apiPrivate = useApiPrivate();
  const location = useLocation();
  const { outletData } = location.state || {}; // Get basic outlet info from state
  const [inactiveQueues, setInactiveQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //TAILWIND CLASSES
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800`;
  const inputClass = `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:border-black peer active:border-black`;
  useEffect(() => {
    setQueueName(moment().format("llll"));
  }, []);

  useEffect(() => {
    // Crucial: Handle direct access/refresh where location.state might be null
    if (!outletData) {
      // If outletData is missing, you'd likely need to refetch basic outlet info
      // based on params.outletId or redirect to an error page.
      console.warn(
        "Missing outletData on InactiveOutlet, consider fetching or redirecting."
      );
      // Example: fetchOutletData(params.outletId);
    }
    fetchInactiveQueueStats(currentPage); // Fetch the initial page of stats
  }, [params.accountId, params.outletId, currentPage, apiPrivate, outletData]); // Add dependencies

  const fetchInactiveQueueStats = async (page) => {
    setLoading(true);
    setError(null);
    try {
      // Make a new API call to your dedicated inactive queues endpoint
      const res = await apiPrivate.get(
        `/inactiveQueues/${params.accountId}/${params.outletId}?page=${page}`
      );
      setInactiveQueues(res.data.inactiveQueueStats);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(
        "Error fetching inactive queue stats:",
        err.response || err
      );
      setError("Failed to load past queue data.");
    } finally {
      setLoading(false);
    }
  };
  const startQueueAllowed = async () => {
    console.log("Here is to start queue: ");
    if (queueName.length === 0) {
      setQueueName(moment().format("llll"));
    }
    try {
      const data = {
        name: queueName,
      };
      console.log(data);
      const res = await apiPrivate.post(
        `newQueue/${params.accountId}/${params.outletId}`,
        data
      );
      console.log("Created new queue! ", res.data);
      if (res?.status === 201) {
        navigate(
          `/db/${params.accountId}/outlet/${params.outletId}/active/${res.data.id}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartQueue = async (e) => {
    e.preventDefault();
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    //Navigate -1 ?
  };

  return (
    <div>
      <form className="bg-primary-cream p-3 rounded-2xl">
        <p className="text-lg font-light italic text-primary-dark-green">
          Let's start a new queue!
        </p>
        <label htmlFor="queue_name" className={labelClass}>
          Name of Queue
        </label>
        <input
          type="text"
          id="queue_name"
          value={queueName}
          onChange={(e) => setQueueName(e.target.value)}
          className={inputClass}
        />
        <button
          className={
            buttonClass +
            " bg-primary-green hover:bg-primary-dark-green mr-3 border-1 border-primary-light-green"
          }
          onClick={handleStartQueue}
        >
          Start Queue
        </button>
      </form>
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
              onSuccess={startQueueAllowed}
              onFailure={handleAuthModalClose}
              actionPurpose="Start New Queue"
              minimumRole="HOST"
              outletId={params.outletId}
            />
          </div>
        </div>
      )}
      <div className="bg-primary-cream p-3 rounded-2xl mt-5">
        <p className="text-lg font-light italic text-primary-dark-green">
          Previous Queue Report
        </p>
        <div>
          <h1>Inactive Queues for {outletData.name}</h1>
          {/* <p>Your role: {staffInfo?.staffRole}</p> // If staffInfo is needed and checked */}
          <h2>Past Queue Statistics</h2>
          {inactiveQueues.length === 0 ? (
            <p>No past queues available.</p>
          ) : (
            <div>
              {inactiveQueues.map((queue) => (
                <div key={queue.id} className="mb-4 p-4 border rounded-lg">
                  <h3>Name: {queue.name}</h3>
                  <p>
                    Start Time: {new Date(queue.startTime).toLocaleString()}
                  </p>
                  <p>End Time: {new Date(queue.endTime).toLocaleString()}</p>
                  <p>Total Items: {queue.totalQueueItems}</p>
                  <p>Seated: {queue.seatedCount}</p>
                  <p>Quit: {queue.quitCount}</p>
                  <p>No Show: {queue.noShowCount}</p>
                  <p>Active (at end): {queue.activeCount}</p>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InactiveOutlet;
