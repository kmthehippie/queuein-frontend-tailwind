import React, { useEffect, useState } from "react";
import { apiPrivate } from "../api/axios";
import { useParams, Link } from "react-router-dom";

const Sidenav = () => {
  const [outlets, setOutlets] = useState([]);
  const [showSideNav, setShowSideNav] = useState(false);
  const params = useParams();

  //Tailwind classes
  const sideNavButtonClass = ` pl-5 pt-3 m-1 pb-3 cursor-pointer transition ease-in rounded-xl leading-4
        border border-transparent border-l-10 border-l-transparent 
        hover:text-primary-dark-green hover:border-primary-green hover:border-l-primary-green md:pl-2`;

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  useEffect(() => {
    console.log("Use effect in sidenav ", params);
    const fetchOutlets = async () => {
      try {
        const response = await apiPrivate.get(`/sidenav/${params.accountId}`);
        if (response?.data) {
          console.log("Response from /sidenav");
          console.log(response.data);
          setOutlets(response.data);
        }
      } catch (error) {
        console.error(error);
        console.log("Error trying to fetch data for all outlets");
      }
    };
    fetchOutlets();
  }, [params]);

  return (
    <div className=" ">
      <p
        className="p-5 cursor-pointer hover:text-primary-dark-green ease-in md:hidden"
        onClick={toggleSideNav}
      >
        <i className="fa-solid fa-bars"></i>
      </p>
      <div
        className={`
          bg-primary-cream pt-3 h-full 
          fixed top-0 left-0
          w-[300px]
          md:relative md:w-full md:pl-2  z-10
       ${showSideNav ? "block" : "hidden"} md:block 
        `}
      >
        <p
          className="pl-5 pt-2 cursor-pointer hover:text-primary-dark-green ease-in md:hidden"
          onClick={toggleSideNav}
        >
          <i className="fa-solid fa-bars"></i>
        </p>

        <div className="cursor-pointer w-full hidden md:left-auto md:block">
          <span className="flex items-end font-black text-primary-green">
            <img src="/Q-logo.svg" alt="Queue In Logo" className=" w-15 " />{" "}
            UEUE IN
          </span>
        </div>

        <Link to={`/db/${params.accountId}/outlets/all`}>
          <div className="pl-3 pt-5 m-1 leading-4 text-primary-green pb-1 hover:text-primary-light-green transition ease-in cursor-pointer">
            <i className="fa-solid fa-house"></i> Outlets
          </div>
        </Link>

        {outlets.length > 0 ? (
          <div>
            {outlets.map((outlet) => (
              <Link
                to={`/db/${params.accountId}/outlet/${outlet.id}`}
                key={outlet.id}
                onClick={() => setShowSideNav(false)} // Close sidenav on link click
              >
                <div className={sideNavButtonClass}>{outlet.name}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div>No outlets available.</div>
        )}

        <div>
          <Link to={`/db/${params.accountId}/outlets/new`}>
            <div className={sideNavButtonClass + " font-semibold"}>
              Create a new outlet +
            </div>
          </Link>
        </div>

        <div className="pl-3 pt-3 m-1 leading-4 text-primary-green pb-1 hover:text-primary-light-green transition ease-in cursor-pointer">
          <i className="fa-solid fa-gear"></i> Settings
        </div>
        <div className="cursor-pointer absolute bottom-5 left-5 w-full md:left-auto ">
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
