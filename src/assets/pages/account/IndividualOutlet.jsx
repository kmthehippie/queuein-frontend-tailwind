import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useApiPrivate from "../../hooks/useApiPrivate";
import AuthorisedUser from "./AuthorisedUser";
import Loading from "../../components/Loading";

const IndividualOutlet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const apiPrivate = useApiPrivate();
  const [loading, setLoading] = useState(false);
  const [outletName, setOutletName] = useState(null);
  const [errors, setErrors] = useState("");
  // showAuthModal will now store an object { onSuccess: Function }
  const [showAuthModalState, setShowAuthModalState] = useState(null); // Renamed to avoid confusion with the primitive boolean you had before
  const [refresh, setRefresh] = useState(false);

  const handleAuthModalClose = () => {
    setErrors({ general: "Authorization cancelled." });
    setShowAuthModalState(null); // Set to null to hide modal
  };

  const buttonClass = `mt-5 transition ease-in text-white bg-primary-green font-light py-2 px-8 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20 hover:bg-primary-dark-green hover:text-primary-light-green`;

  useEffect(() => {
    const checkQueueAndRedirect = async () => {
      setLoading(true);
      setErrors("");
      try {
        const res = await apiPrivate.get(
          `queueActivity/${params.accountId}/${params.outletId}`
        );

        if (res?.data?.outlet) {
          setOutletName(res.data.outlet.name);
          console.log("API response data:", res.data); // Keep this log for debugging

          const currentOutletData = res.data.outlet; // Capture outlet data
          const currentQueueData = res.data.queue; // Capture queue data (can be null)

          if (currentQueueData) {
            // Found an active/relevant queue, prompt for authorization
            const handleAuthSuccess = (staffInfo) => {
              setLoading(false);
              setShowAuthModalState(null); // Hide modal

              console.log("Navigating to ActiveOutlet with:", {
                staffInfo,
                outletData: currentOutletData,
                queueData: currentQueueData,
              });
              navigate(
                `/db/${params.accountId}/outlet/${params.outletId}/active/${currentQueueData.id}`,
                {
                  replace: true,
                  state: {
                    staffInfo: staffInfo, // This is the validated staff info
                    outletData: currentOutletData, // Pass the outlet data
                    queueData: currentQueueData, // Pass the queue data
                  },
                }
              );
            };
            // Set the success handler for the modal, which will then open the modal
            setShowAuthModalState({ onSuccess: handleAuthSuccess });
          } else {
            // No active/relevant queue, redirect to inactive page
            console.log(
              "No active/relevant queue found. Redirecting to inactive."
            );
            navigate(
              `/db/${params.accountId}/outlet/${params.outletId}/inactive`,
              {
                replace: true,
                state: {
                  outletData: currentOutletData, // Pass the outlet data
                },
              }
            );
          }
        } else {
          // If res.data.outlet is null/undefined, something is wrong
          setErrors({ general: "Received invalid outlet data from server." });
          navigate(`/db/${params.accountId}/error`, { replace: true });
        }
      } catch (error) {
        console.error(
          "Error checking queue activity:",
          error.response || error
        );
        if (error.response) {
          if (
            error.response.status === 404 &&
            error.response.data.message === "Error, outlet not found"
          ) {
            setErrors({ general: "Error, outlet not found" });
          } else {
            setErrors({
              general: `Error: ${error.response.data.message || error.message}`,
            });
            navigate(`/db/${params.accountId}/error`, {
              replace: true,
              state: {
                errorMessage: error.response.data.message || error.message,
              },
            });
          }
        } else {
          setErrors({ general: `Network Error: ${error.message}` });
          navigate(`/db/${params.accountId}/error`, {
            replace: true,
            state: { errorMessage: error.message },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.outletId) {
      checkQueueAndRedirect();
    }
  }, [params.accountId, params.outletId, refresh, apiPrivate, navigate]);

  if (loading) {
    return (
      <Loading title={"Loading..."} paragraph={"Please wait while it loads."} />
    );
  }
  if (errors) {
    return (
      <div className="flex flex-col items-center justify-center bg-primary-cream/50 p-10 m-10 rounded-3xl border-5 border-red-800">
        <h1 className="text-3xl text-red-800 font-semibold ">Error </h1>
        <p className="font-light text-xl mt-5">
          Error Message: {errors.general}
        </p>
        <button className={buttonClass} onClick={() => setRefresh(!refresh)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center md:w-full  ">
      <div className="w-[90%] h-[90%] rounded-2xl p-5 m-1 bg-primary-cream/50 shadow-lg text-left relative my-8 ">
        <h1 className="font-semibold text-2xl pb-2">{outletName}</h1>
        <Outlet />
        {/* Conditionally render the modal only if showAuthModalState is an object with onSuccess */}
        {showAuthModalState &&
          typeof showAuthModalState === "object" &&
          showAuthModalState.onSuccess && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
                <button
                  onClick={handleAuthModalClose}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                  &times;
                </button>
                <AuthorisedUser
                  onSuccess={showAuthModalState.onSuccess} // <--- Pass the captured handler here
                  onFailure={handleAuthModalClose}
                  actionPurpose="Enter active queue"
                  minimumRole="TIER_3"
                  outletId={params.outletId}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default IndividualOutlet;
