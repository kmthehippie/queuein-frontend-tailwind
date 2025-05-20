import React, { useEffect, useState } from "react";
import { apiPrivate } from "../api/axios";
import { useParams, Link } from "react-router-dom";

const Sidenav = () => {
  const [outlets, setOutlets] = useState([]);
  const [showSideNav, setShowSideNav] = useState(false); // Controls visibility on small screens
  const params = useParams();

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
    <div className="">
      {/* Bar Icon for Small Screens */}
      {/* This icon should ONLY show on screens smaller than 'md' */}
      <p
        className="p-5 cursor-pointer hover:text-primary-dark-green ease-in md:hidden"
        onClick={toggleSideNav}
      >
        <i className="fa-solid fa-bars"></i>
      </p>
      {/* Side Navigation Container */}
      {/* This div should be hidden by default on small screens, 
          shown when showSideNav is true, 
          and always shown on md screens and up. */}
      <div
        className={`
          bg-primary-cream pt-3 h-full 
          absolute top-0 left-0 
          w-2/3
          md:relative md:w-full md:pl-2 md:mt-5 md:block z-10
          ${showSideNav ? "block" : "hidden"}
        `}
      >
        {/* Bar Icon INSIDE the opened side nav (for closing on small screens) */}
        {/* This icon should ONLY show on screens smaller than 'md' */}
        <p
          className="pl-5 pt-2 cursor-pointer hover:text-primary-dark-green ease-in md:hidden"
          onClick={toggleSideNav}
        >
          <i className="fa-solid fa-bars"></i>
        </p>

        {/* Queue In Logo */}
        <Link to={`/db/${params.accountId}/outlets`}>
          <div className=" cursor-pointer block w-full md:left-auto">
            <span className="flex items-end font-black text-primary-green">
              <img src="/Q-logo.svg" alt="Queue In Logo" className=" w-15 " />{" "}
              UEUE IN
            </span>
          </div>
        </Link>

        {/* Outlets List */}
        {outlets.length > 0 ? (
          <div>
            {outlets.map((outlet) => (
              <Link
                to={`/db/${params.accountId}/outlet/${outlet.id}`}
                key={outlet.id}
                onClick={() => setShowSideNav(false)} // Close sidenav on link click
              >
                <div
                  className=" pl-5 pt-5 m-1 cursor-pointer transition ease-in
                  border border-transparent    
                  border-l-10 border-l-transparent 
                  hover:text-primary-dark-green
                  rounded-xl
                  hover:border-primary-green   
                  hover:border-l-primary-green md:pl-2
                  leading-4"
                >
                  {outlet.name}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div>No outlets available.</div>
        )}
        {/* You can add a "Create New Outlet" link or button here */}
      </div>
    </div>
  );
};

export default Sidenav;
