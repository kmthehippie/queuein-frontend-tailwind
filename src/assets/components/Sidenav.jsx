import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useApiPrivate from "../hooks/useApiPrivate";
import { alphabeticalSort } from "../utils/sortList";
import { replaceEscaped } from "../utils/replaceRegex";
import { primaryBgClass, primaryTextClass } from "../styles/tailwind_styles";
import { useBusinessType } from "../hooks/useBusinessType";

const Sidenav = () => {
  const [outlets, setOutlets] = useState([]);
  const [showSideNav, setShowSideNav] = useState(false);

  const sideNavRef = useRef(null);
  const params = useParams();
  const { isAuthenticated, accountId, reloadNav } = useAuth();
  const { config } = useBusinessType();
  const apiPrivate = useApiPrivate();
  const navigate = useNavigate();

  //Tailwind classes
  const sideNavButtonClass = ` pl-5 pt-3 m-1 pb-3 cursor-pointer transition ease-in rounded-xl leading-4
        border border-transparent border-l-10 border-l-transparent 
        hover:text-primary-dark-green hover:border-primary-green dark:hover:text-primary-light-green dark:hover:border-primary-light-green   hover:border-l-primary-green lg:pl-2`;

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };
  const handleNav = (outletId) => {
    if (
      location.pathname.includes(`outlet/${outletId}/active`) ||
      location.pathname.includes(`outlet/${outletId}/inactive`)
    ) {
      console.log("True the pathname ends with outletid", { outletId });
      setShowSideNav(false);
      return;
    }

    setShowSideNav(false);
    navigate(`/db/${params.accountId}/outlet/${outletId}`);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sideNavRef.current && !sideNavRef.current.contains(e.target)) {
        setShowSideNav(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOutlets = async () => {
      try {
        const response = await apiPrivate.get(`/sidenav/${accountId}`);
        if (response?.data) {
          const sort = alphabeticalSort(response.data);
          setOutlets(sort);
        } else if (response?.status === 404) {
          setOutlets([]);
        }
      } catch (error) {
        console.error("Error fetching outlets for side nav:", error);
      }
    };
    fetchOutlets();
  }, [accountId, reloadNav, setOutlets]);

  return (
    <div
      className={`  ${primaryBgClass} lg:relative absolute top-0 left-0 h-[85vh] lg:col-span-1 print:hidden`}
      ref={sideNavRef}
    >
      <p
        className={`p-5 cursor-pointer z-8 ${primaryBgClass} text-primary-dark-green border-1 border-primary-light-green dark:text-primary-light-green rounded-3xl flex justify-center items-center hover:text-primary-dark-green dark:hover:text-primary-light-green ease-in lg:hidden max-w-20 w-10 h-10 m-3 fixed`}
        onClick={toggleSideNav}
      >
        <i className="fa-solid fa-bars"></i>
      </p>
      {/* Need to fix the nav so that it fixes on the page */}
      <div
        className={` ${primaryBgClass} ${primaryTextClass}
         pt-3 h-full
          fixed top-0 left-0
          w-[300px]
          lg:sticky lg:h-fit lg:w-full md:pl-2  z-10
       ${showSideNav ? "block" : "hidden"} lg:block 
        `}
      >
        <p
          className="pl-5 pt-2 cursor-pointer hover:text-primary-dark-green ease-in lg:hidden dark:hover:text-primary-light-green transition"
          onClick={toggleSideNav}
        >
          <i className="fa-solid fa-bars"></i>
        </p>

        <div className="cursor-pointer w-full hidden lg:left-auto lg:block">
          <span className="flex items-end font-black text-primary-green">
            <img src="/Q-logo.svg" alt="Queue In Logo" className=" w-15 " />{" "}
            UEUE IN
          </span>
        </div>

        <Link
          to={`/db/${params.accountId}/outlets/all`}
          onClick={toggleSideNav}
        >
          <div
            className="pl-3 pt-5 m-1 leading-4 text-primary-green dark:text-primary-light-green pb-1 font-bold tracking-wider uppercase hover:text-primary-light-green dark:hover:text-primary-cream transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-house mr-3"></i> {config.label}
          </div>
        </Link>

        {outlets.length > 0 ? (
          <div>
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                onClick={() => handleNav(outlet.id)} // Close sidenav on link click
              >
                <div className={sideNavButtonClass}>
                  {replaceEscaped(outlet.name)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`ml-4 text-sm ${primaryTextClass}`}>
            No {config.label}s Available.
          </div>
        )}
        <Link to={`/db/${params.accountId}/outlets/new`}>
          <div onClick={toggleSideNav}>
            <div className={sideNavButtonClass + " leading-5 font-semibold"}>
              Create a new {config.queueName} +
            </div>
          </div>
        </Link>
        <Link to={`/db/${params.accountId}/settings`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green dark:text-primary-light-green pb-1 hover:text-primary-light-green dark:hover:text-primary-cream transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-gear pr-1 mr-3"></i> Settings
          </div>
        </Link>
        <Link to={`/db/${params.accountId}/staff`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green dark:text-primary-light-green pb-1 hover:text-primary-light-green dark:hover:text-primary-cream transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-users mr-3"></i> Staff
          </div>{" "}
        </Link>
        <Link to={`/db/${params.accountId}/VIPs`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green dark:text-primary-light-green pb-1 hover:text-primary-light-green dark:hover:text-primary-cream transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-users-rectangle mr-3"></i> VIPs
          </div>
        </Link>
        <Link to={`/db/${params.accountId}/quit`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green dark:text-primary-light-green pb-1 hover:text-primary-light-green dark:hover:text-primary-cream transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-right-from-bracket mr-3"></i> Quit
          </div>
        </Link>

        <div className="cursor-pointer absolute bottom-5 left-5 w-full lg:hidden ">
          <span className="flex items-end font-black text-primary-green">
            <img src="/Q-logo.svg" alt="Queue In Logo" className=" w-15 " />{" "}
            UEUE IN
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
