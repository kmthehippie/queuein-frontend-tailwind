import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useApiPrivate from "../hooks/useApiPrivate";
import { alphabeticalSort } from "../utils/sortList";

const Sidenav = () => {
  const [outlets, setOutlets] = useState([]);
  const [showSideNav, setShowSideNav] = useState(false);

  const sideNavRef = useRef(null);
  const params = useParams();
  const { isAuthenticated, accountId, reloadNav, outletText } = useAuth();
  const apiPrivate = useApiPrivate();
  const navigate = useNavigate();

  //Tailwind classes
  const sideNavButtonClass = ` pl-5 pt-3 m-1 pb-3 cursor-pointer transition ease-in rounded-xl leading-4
        border border-transparent border-l-10 border-l-transparent 
        hover:text-primary-dark-green hover:border-primary-green hover:border-l-primary-green lg:pl-2`;

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };
  const handleNav = (outletId) => {
    if (
      location.pathname.includes(`outlet/${outletId}/active`) ||
      location.pathname.includes(`outlet/${outletId}/inactive`)
    ) {
      console.log("True the pathname ends with outletid");
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
      className="lg:relative absolute top-0 left-0 h-[85vh] lg:col-span-1 print:hidden"
      ref={sideNavRef}
    >
      <p
        className="p-5 cursor-pointer z-8 bg-white rounded-3xl flex justify-center items-center hover:text-primary-dark-green ease-in lg:hidden max-w-20 w-10 h-10 m-3 fixed"
        onClick={toggleSideNav}
      >
        <i className="fa-solid fa-bars"></i>
      </p>
      {/* Need to fix the nav so that it fixes on the page */}
      <div
        className={`
          bg-primary-cream pt-3 h-full
          fixed top-0 left-0
          w-[300px]
          lg:sticky lg:h-fit lg:w-full md:pl-2  z-10
       ${showSideNav ? "block" : "hidden"} lg:block 
        `}
      >
        <p
          className="pl-5 pt-2 cursor-pointer hover:text-primary-dark-green ease-in lg:hidden "
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
            className="pl-3 pt-5 m-1 leading-4 text-primary-green pb-1 hover:text-primary-light-green transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-house pr-1"></i> {outletText}
          </div>
        </Link>

        {outlets.length > 0 ? (
          <div>
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                onClick={() => handleNav(outlet.id)} // Close sidenav on link click
              >
                <div className={sideNavButtonClass}>{outlet.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-4 text-sm text-gray-500">
            No {outletText}s Available.
          </div>
        )}
        <Link to={`/db/${params.accountId}/outlets/new`}>
          <div onClick={toggleSideNav}>
            <div className={sideNavButtonClass + " font-semibold"}>
              Create a new {outletText} +
            </div>
          </div>
        </Link>
        <Link to={`/db/${params.accountId}/settings`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green pb-1 hover:text-primary-light-green transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-gear pr-1"></i> Settings
          </div>
        </Link>
        <Link to={`/db/${params.accountId}/staff`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green pb-1 hover:text-primary-light-green transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-users"></i> Staff
          </div>{" "}
        </Link>
        <Link to={`/db/${params.accountId}/quit`}>
          <div
            className="pl-3 pt-3 m-1 leading-4 text-primary-green pb-1 hover:text-primary-light-green transition ease-in cursor-pointer"
            onClick={toggleSideNav}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Quit
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
