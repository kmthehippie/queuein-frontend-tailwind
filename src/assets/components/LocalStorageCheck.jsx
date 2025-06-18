import { useNavigate, useParams } from "react-router-dom";
import useLSContext from "../hooks/useLSContext";

const LocalStorageCheck = () => {
  const { activeQueueSession, isQueueSessionLoading, queueItemId } =
    useLSContext();
  const { acctSlug } = useParams();
  const navigate = useNavigate();

  const handleGoToWaitingPage = () => {
    if (activeQueueSession) {
      navigate(`/${acctSlug}/queueItem/${queueItemId}`);
    }
  };

  if (isQueueSessionLoading) {
    return <div>Checking for active queue session...</div>;
  }

  if (activeQueueSession) {
    return (
      <div className="fixed top-20 right-5 z-50">
        <button
          onClick={handleGoToWaitingPage}
          className="bg-primary-cream hover:bg-primary-dark-green text-primary-green hover:text-white ease-in pointer-cursor transition font-bold py-2 px-4 rounded-full shadow-lg"
        >
          Click to go to waiting page
        </button>
      </div>
    );
  }

  return null;
};

export default LocalStorageCheck;
