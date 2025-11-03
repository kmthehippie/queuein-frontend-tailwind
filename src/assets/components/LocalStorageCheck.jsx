import { useLocation, useNavigate, useParams } from "react-router-dom";
import useLSContext from "../hooks/useLSContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { primaryBgClass } from "../styles/tailwind_styles";

const LocalStorageCheck = () => {
  const { activeQueueSession, isQueueSessionLoading, queueItemId } =
    useLSContext();

  const [isWaitingPage, setIsWaitingPage] = useState(false);
  const { acctSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoToWaitingPage = () => {
    if (activeQueueSession) {
      console.log("Active queue session, going to navigate");
      navigate(`/${acctSlug}/queueItem/${queueItemId}`);
      setIsWaitingPage(true);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("queueItem")) {
      setIsWaitingPage(true);
    } else {
      setIsWaitingPage(false);
    }
  }, [location.pathname]);

  if (isQueueSessionLoading) {
    return (
      <Loading
        title={"Queue session"}
        paragraph={"Checking for existing queue session"}
      />
    );
  }

  if (activeQueueSession && !isWaitingPage) {
    return (
      <div className="fixed top-20 right-5 z-50">
        <button
          onClick={handleGoToWaitingPage}
          className={`${primaryBgClass} hover:bg-primary-dark-green text-primary-green  hover:text-white ease-in pointer-cursor transition font-bold py-2 px-4 rounded-full shadow-lg`}
        >
          Click to go to Waiting Page
        </button>
      </div>
    );
  }

  return null;
};

export default LocalStorageCheck;
