import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  primaryButtonClass as buttonClass,
  primaryBgTransparentClass,
  primaryTextClass,
} from "../../styles/tailwind_styles";
import ThemeSettings from "../../components/ThemeSettings";
import { primaryBgClass } from "../../styles/tailwind_styles";
import { useBusinessType } from "../../hooks/useBusinessType";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailAddress = import.meta.env.VITE_FEEDBACK_EMAIL_ADDRESS;

  const { accountId } = useAuth();
  const { config } = useBusinessType();
  const subject = `Feedback for ${accountId}`;
  //Tailwind Classes
  const activeButton = `bg-primary-light-green font-semibold `;

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
    <div
      className={`${primaryBgTransparentClass} ${primaryTextClass} lg:mt-15 mx-3 p-3 lg:size-5/6 h-[80vh] lg:h-[75vh] lg:m-20 lg:p-5 rounded-3xl border border-primary-green `}
    >
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
          {config.label}
        </div>
      </div>

      {pathnameEndsWithSettings && (
        <div
          className={`border-1 border-primary-light-green ${primaryBgTransparentClass} ${primaryTextClass} overflow-y-scroll max-h-[63vh] h-full lg:max-h-[55vh] lg:p-10 `}
        >
          <div className="">
            <ThemeSettings />
          </div>
          <div className={`${primaryBgClass} p-6 mt-10 rounded-lg shadow-md`}>
            <h1 className="text-4xl pb-3">Notices</h1>
            <h2 className={`text-2xl font-extralight ${primaryTextClass} mb-3`}>
              <i className="fa-solid fa-hammer pr-5"></i>More features are in
              the works!
            </h2>
            <p className="font-light italic text-sm">
              Send me feedback about how you would like this app to be further
              improved.
            </p>
            <small className="text-primary-green dark:text-primary-light-green">
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
            <h2>Pending Features to Implement</h2>
            {/* <div className="text-sm flex justify-center items-center ">
              <i className="fa-solid fa-fire"></i>
              <p className="pl-3 pt-5  w-full">
                Automatically open or close of store so that customers know that
                the store is opened or closed in the Customer Viewing Page.
              </p>
            </div> */}
            <div className="text-sm flex justify-center items-center ">
              <i className="fa-solid fa-fire"></i>
              <p className="pl-3 pt-5 w-full">
                Estimate wait time algorithm to average wait time data
              </p>
            </div>
            {/* <div className="text-sm flex justify-center items-center">
              <i className="fa-solid fa-fire"></i>
              <p className="pl-3 pt-5  w-full">
                Option to allow accounts to add notes to a customer. Egs. Need 1
                baby chair, Complained of tenderness in shin, Request for Ms
                Lily, Request full mani and pedicure.
              </p>
            </div> */}
            <br />
            <small>
              Contact me to discuss further features you'd like to see!
            </small>
          </div>
        </div>
      )}

      {!pathnameEndsWithSettings && (
        <div
          className={`border-1 p-0 border-primary-light-green ${primaryBgTransparentClass} `}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Settings;
