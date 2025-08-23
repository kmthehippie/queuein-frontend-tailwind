import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailAddress = import.meta.env.VITE_FEEDBACK_EMAIL_ADDRESS;

  const { accountId, outletText } = useAuth();
  const subject = `Feedback for ${accountId}`;
  //Tailwind Classes
  const activeButton = `bg-primary-light-green font-semibold `;
  const buttonClass = `bg-primary-cream py-2 text-sm cursor-pointer hover:bg-primary-light-green hover:text-white hover:px-6 transition delay-100 duration-300 ease-in-out px-4 `;

  const handleNavigateSettings = () => {
    navigate(`/db/${accountId}/settings`);
  };
  const handleNavigateOutlet = () => {
    navigate(`/db/${accountId}/settings/outlet`);
  };

  const handleNavigateAccount = () => {
    navigate(`/db/${accountId}/settings/account`);
  };

  const pathnameEndsWithSettings = location.pathname.endsWith("settings");
  const pathnameEndsWithAccount = location.pathname.endsWith("account");
  const pathnameEndsWithOutlet = location.pathname.endsWith("outlet");

  return (
    <div className="bg-primary-cream/80 mt-15 mx-3 p-3 lg:size-5/6 h-[75vh] lg:m-20 lg:p-5 rounded-3xl border border-primary-green ">
      <div className="lg:mt-3 flex justify-center">
        <button
          className="text-3xl lg:text-4xl font-bold text-center mb-3 cursor-pointer"
          onClick={handleNavigateSettings}
        >
          Settings
        </button>
      </div>
      <div className="flex">
        <div
          className={`${buttonClass}
            border-l-1 border-t-1 border-primary-light-green ${
              pathnameEndsWithAccount ? activeButton : ""
            } `}
          onClick={handleNavigateAccount}
        >
          Account
        </div>
        <div
          className={`${buttonClass} border-l-1 border-t-1  border-r-1 border-primary-light-green ${
            pathnameEndsWithOutlet ? activeButton : ""
          }`}
          onClick={handleNavigateOutlet}
        >
          {outletText}
        </div>
      </div>

      {pathnameEndsWithSettings && (
        <div className="border-1 border-primary-light-green bg-primary-cream/80 overflow-y-scroll max-h-[63vh] h-full lg:max-h-[55vh] p-10 ">
          <h1 className="text-4xl pb-3">Notices</h1>
          <h2 className="text-2xl font-extralight text-gray-500 mb-3">
            <i className="fa-solid fa-hammer pr-5"></i>More features are in the
            works!
          </h2>
          <p className="font-light italic text-sm">
            Send me feedback about how you would like this app to be further
            improved.
          </p>
          <small className="text-primary-green">
            Email me at:{" "}
            <a
              href={`mailto:${emailAddress}?subject=${encodeURIComponent(
                subject
              )}`}
            >
              {" "}
              {emailAddress}{" "}
            </a>
          </small>

          <div className="text-sm flex justify-center items-center">
            <i className="fa-solid fa-fire"></i>
            <p className="pl-3 pt-5">
              Automatically open or close of store so that customers know that
              the store is opened or closed.
            </p>
          </div>
          <div className="text-sm flex justify-center items-center">
            <i className="fa-solid fa-fire"></i>
            <p className="pl-3 pt-5">
              Estimate wait time algorithm to average wait time data
            </p>
          </div>
          <div className="text-sm flex justify-center items-center">
            <i className="fa-solid fa-fire"></i>
            <p className="pl-3 pt-5">
              Option to allow accounts to add notes to a customer. Egs. Need 1
              baby chair, Complained of tenderness in shin, Request for Ms Lily,
              Request full mani and pedicure.
            </p>
          </div>

          <br />
          <small>And many more...!</small>
        </div>
      )}

      {!pathnameEndsWithSettings && (
        <div className="border-1 p-0 border-primary-light-green bg-primary-cream/80">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Settings;
