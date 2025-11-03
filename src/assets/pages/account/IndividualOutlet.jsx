import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useApiPrivate from "../../hooks/useApiPrivate";
import AuthorisedUser from "./AuthorisedUser";
import Loading from "../../components/Loading";
import {
  primaryButtonClass as buttonClass,
  primaryBgClass,
  primaryBgTransparentClass,
  primaryTextClass,
  xButtonClass,
} from "../../styles/tailwind_styles";

const IndividualOutlet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const apiPrivate = useApiPrivate();
  const [loading, setLoading] = useState(false);
  const [outletName, setOutletName] = useState(null);
  const [errors, setErrors] = useState("");
  const [showAuthModalState, setShowAuthModalState] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleAuthModalClose = () => {
    setErrors({ general: "Authorization cancelled." });
    setShowAuthModalState(null);
  };

  useEffect(() => {
    const checkQueueAndRedirect = async () => {
      setLoading(true);
      setErrors("");
      try {
        const res = await apiPrivate.get(
          `queueActivity/${params.accountId}/${params.outletId}`
        );
        console.log("Individual data: ", JSON.stringify(res.data));

        if (res?.data?.outlet) {
          setOutletName(res.data.outlet.name);
          console.log("API response data:", res.data); // Keep this log for debugging

          const currentOutletData = res.data.outlet;
          const currentQueueData = res.data.queue;

          if (currentQueueData) {
            const handleAuthSuccess = (staffInfo) => {
              setLoading(false);
              setShowAuthModalState(null);

              console.log("Navigating to ActiveOutlet with:", {
                staffInfo,
                outletData: currentOutletData,
                queueData: currentQueueData,
              });
              navigate(
                `/db/${res.data.outlet.accountId}/outlet/${res.data.outlet.id}/active/${currentQueueData.id}`,
                {
                  replace: true,
                  state: {
                    staffInfo: staffInfo,
                    outletData: currentOutletData,
                    queueData: currentQueueData,
                  },
                }
              );
            };
            setShowAuthModalState({ onSuccess: handleAuthSuccess });
          } else {
            console.log(
              "No active/relevant queue found. Redirecting to inactive.",
              params
            );
            navigate(
              `/db/${res.data.outlet.accountId}/outlet/${res.data.outlet.id}/inactive`,
              {
                replace: true,
                state: {
                  outletData: currentOutletData,
                },
              }
            );
          }
        } else {
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
      <div
        className={`flex flex-col items-center justify-center ${primaryBgTransparentClass} p-10 m-10 rounded-3xl border-5 border-red-800`}
      >
        <h1 className="text-3xl text-red-800 font-semibold ">Error </h1>
        <p className={`font-light text-xl mt-5 ${primaryTextClass}`}>
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
      <div
        className={`w-[90%] h-[90%] rounded-2xl p-5 m-1 ${primaryBgClass} shadow-lg text-left relative my-8 `}
      >
        <h1 className={`font-semibold text-2xl pb-2 ${primaryTextClass}`}>
          {outletName}
        </h1>
        <Outlet />
        {showAuthModalState &&
          typeof showAuthModalState === "object" &&
          showAuthModalState.onSuccess && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
              <div
                className={`${primaryBgClass} ${primaryTextClass} p-6 rounded-lg shadow-xl relative max-w-sm w-full`}
              >
                <button
                  onClick={handleAuthModalClose}
                  className={xButtonClass + " text-2xl"}
                >
                  &times;
                </button>
                <AuthorisedUser
                  onSuccess={showAuthModalState.onSuccess}
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
