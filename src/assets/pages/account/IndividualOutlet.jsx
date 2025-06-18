import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useApiPrivate from "../../hooks/useApiPrivate";
import AuthorisedUser from "./AuthorisedUser";

const IndividualOutlet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const apiPrivate = useApiPrivate();
  const [loading, setLoading] = useState(false);
  const [outletName, setOutletName] = useState(null);
  const [errors, setErrors] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [queueId, setQueueId] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleAuthModalClose = () => {
    setErrors({ general: "Forbidden" });
    setShowAuthModal(false);
  };

  const activeQueueAllowed = (info) => {
    setLoading(false);
    setShowAuthModal(false);
    console.log("Active queue allowed: ", info);
    navigate(
      `/db/${params.accountId}/outlet/${params.outletId}/active/${queueId}`,
      { replace: true, state: { info: info } }
    );
  };

  const buttonClass = `mt-5 transition ease-in text-white bg-primary-green font-light py-2 px-8 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20 hover:bg-primary-dark-green hover:text-primary-light-green`;

  //* FIND IF OUTLET IS ACTIVE OR NOT?
  useEffect(() => {
    const checkQueueAndRedirect = async () => {
      setLoading(true);
      setErrors("");
      try {
        const res = await apiPrivate.get(
          `queueActivity/${params.accountId}/${params.outletId}`
        );
        console.log("Here we are trying to set data name", res?.data);
        if (res?.data) {
          setOutletName(res.data.outlet.name);
          if (res.status === 200 && res?.data.queue) {
            setQueueId(res.data.queue.id);
            setShowAuthModal(true);
          } else {
            setErrors({
              general: "Received empty response for outlet activity.",
            });
            navigate(`/db/${params.accountId}/error`, { replace: true });
          }
        }
      } catch (error) {
        console.error(error);

        if (
          error.response.status === 404 &&
          error.response.data.message ===
            "No active queues. No active queue items."
        ) {
          setOutletName(error.response.data.outlet.name);
          navigate(
            `/db/${params.accountId}/outlet/${params.outletId}/inactive`,
            {
              replace: true,
            }
          );
        } else if (
          error.response.status === 404 &&
          error.response.data.message === "Error, outlet not found"
        ) {
          setErrors({ general: "Error, outlet not found" });
        } else {
          setErrors({ general: `Error ${error}` });
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.outletId) {
      checkQueueAndRedirect();
    }
  }, [params.outletId, refresh]);

  if (loading) {
    return <div className="">Loading...</div>;
  }
  if (errors) {
    return (
      <div className="flex flex-col items-center justify-center bg-primary-cream/50 p-10 m-10 rounded-3xl border-5 border-red-800">
        <h1 className="text-3xl text-red-800 font-semibold ">Error </h1>{" "}
        <p className="font-light text-xl mt-5">
          Error Message: {errors.general}
        </p>
        <button className={buttonClass} onClick={() => setRefresh(!refresh)}>
          Retry
        </button>
      </div>
    );
  }
  //* REDO INDIVIDUAL OUTLET. WE HAVE A PAGE THAT OUTLET TO TWO PAGES. ACTIVEOUTLET AND INACTIVEOUTLET
  return (
    <div className="flex items-center justify-center md:w-full md:h-full pt-12">
      <div className="w-[90%] h-[90%] rounded-2xl p-5 m-1 bg-primary-cream/50 shadow-lg text-left relative">
        <h1 className="font-semibold text-2xl pb-2">{outletName}</h1>

        <Outlet />

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
                onSuccess={activeQueueAllowed}
                onFailure={handleAuthModalClose}
                actionPurpose="Enter active queue"
                minimumRole="HOST"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualOutlet;
