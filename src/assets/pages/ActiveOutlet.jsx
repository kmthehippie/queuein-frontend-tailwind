import React, { useEffect, useState, useCallback } from "react";
import { apiPrivate } from "../api/axios";
import { useParams } from "react-router-dom";
import CreateCustomer from "../components/CreateCustomer";
import moment from "moment";

const ActiveOutlet = () => {
  const params = useParams();
  const [queueItems, setQueueItems] = useState([]);
  const [landscape, setLandscape] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notice, setNotice] = useState({});

  //HELPER FUNCTION
  const convertedTime = (date) => moment(date).fromNow();

  //TAILWIND CLASSES:
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const activeTableHeader = `text-xs text-primary-dark-green mr-5 ml-2`;
  const activeTableAnswer = `flex items-center justify-center text-sm `;
  const landscapeHeaderClass = `border-l-1 border-t-1 border-b-1 border-r-1 border-primary-green p-1`;

  //INITIALIZE DATA
  useEffect(() => {
    const activeQueueItems = async () => {
      console.log(
        "Trying to fetch active queue items",
        `activeQueue/${params.accountId}/${params.outletId}/${params.queueId}`
      );
      try {
        const res = await apiPrivate.get(`activeQueue/${params.queueId}`);
        if (res?.data) {
          console.log("Queue Items?", res.data[0].queueItems);
          setQueueItems(res.data[0].queueItems);
        }
      } catch (error) {
        console.error(error);
        console.log("Error in trying to fetch active queue data");
      }
    };
    activeQueueItems();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    const handleOrientationChange = (e) => setLandscape(e.matches);
    setLandscape(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleOrientationChange);
    return () =>
      mediaQuery.removeEventListener("change", handleOrientationChange);
  }, []);

  //SOCKET HERE

  //HANDLES
  const handleAddCustomer = useCallback((e) => {
    console.log("Add customer");
    e.preventDefault();
    setCreateCustomerModal(true);
  }, []);
  const handleSeated = useCallback((e, id) => {
    const seated = { seat: e.target.checked };
    try {
      const seat = async (id) => {
        const res = await apiPrivate.patch(`/seatQueueItem/${id}`, seated);
        if (res?.status === 201) {
          console.log("response", res);
        }
      };

      seat(id);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const handleCalled = useCallback((e, id) => {
    const called = { call: e.target.checked };
    try {
      const call = async (id) => {
        console.log(called, id);
        const res = await apiPrivate.patch(`/callQueueItem/${id}`, called);
        if (res?.status === 201) {
          console.log("response", res);
        }
      };

      call(id);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const handleEndQueue = useCallback(() => {
    console.log("End Queue");
  }, []);
  return (
    <div className="">
      {notification && (
        <p className="text-primary-green light text-xs">{notice}</p>
      )}
      {!createCustomerModal && (
        <button
          className={
            buttonClass +
            "  bg-red-700 border-1 border-red-500 hover:bg-red-900 fixed top-0 right-0 mr-3"
          }
          onClick={handleEndQueue}
        >
          <i className="fa-solid fa-ban"></i>{" "}
          <span className="pl-3">End Queue</span>
        </button>
      )}
      {createCustomerModal && (
        <CreateCustomer
          setModal={setCreateCustomerModal}
          setNotice={setNotice}
          setNotification={setNotification}
        />
      )}

      {!createCustomerModal && (
        <div className="">
          {queueItems.length === 0 && (
            <div className="mt-3 font-semibold italic text-primary-dark-green">
              There are no customers in queue yet...
            </div>
          )}
          <button
            className={
              buttonClass +
              "  bg-primary-green hover:bg-primary-dark-green mr-3 border-1 border-primary-light-green px-15"
            }
            onClick={(e) => {
              handleAddCustomer(e);
            }}
          >
            Add Customer
          </button>
          {/* PORTRAIT */}
          {!landscape && queueItems.length > 0 && (
            <div>
              <div className="">
                {queueItems.map((item) => {
                  if (item.active === true) {
                    return (
                      <div className="" key={item.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-primary-cream md:hidden">
                          <div className="grid grid-cols-2 border-b-1">
                            <div className="flex items-center p-1 border-r-1">
                              <div className={activeTableHeader + " mr-5"}>
                                Customer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                {item.customer.name}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 border-b-1">
                            <div className="col-span-1 flex items-center p-1 border-r-1">
                              <div className={activeTableHeader}>PAX</div>
                              <div className={activeTableAnswer}>
                                {item.pax}
                              </div>
                            </div>
                            <div className="col-span-2 flex items-center p-1 ">
                              <div className={activeTableHeader}>
                                <i className="fa-solid fa-clock"></i> Waited
                              </div>
                              <div className={activeTableAnswer + " text-xs"}>
                                {convertedTime(item.createdAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center p-1 border-b-1">
                            <div className={activeTableHeader}>
                              <i className="fa-solid fa-phone"></i> Customer
                            </div>
                            <div className={activeTableAnswer}>
                              {item.customer.number}
                            </div>
                          </div>
                          <form className="flex items-center mt-1">
                            <div className={activeTableHeader}>Status</div>
                            <div className="flex">
                              <div
                                className={
                                  activeTableAnswer + " flex items-center ml-5"
                                }
                              >
                                <input
                                  type="checkbox"
                                  id="called"
                                  className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                                  onChange={(e) => handleCalled(e, item.id)}
                                  checked={item.called}
                                />
                                <label
                                  htmlFor="called"
                                  className={activeTableAnswer + " ml-2 mr-5"}
                                >
                                  Called
                                </label>
                              </div>
                              <div
                                className={
                                  activeTableAnswer + "flex items-center"
                                }
                              >
                                <input
                                  type="checkbox"
                                  id="seated"
                                  className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                                  onChange={(e) => handleSeated(e, item.id)}
                                  checked={item.seated}
                                />
                                <label
                                  htmlFor="seated"
                                  className={activeTableAnswer + " ml-2"}
                                >
                                  Seated
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="">
                {queueItems.map((item) => {
                  if (item.active === false) {
                    return (
                      <div className="" key={item.id}>
                        <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-stone-300 md:hidden">
                          <div className="grid grid-cols-2">
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader + ""}>
                                Customer Number
                              </div>
                              <div className={activeTableAnswer + ""}>
                                {item.position}
                              </div>
                            </div>
                            <div className="flex items-center p-1 ">
                              <div className={activeTableHeader}>Name</div>
                              <div className={activeTableAnswer}>
                                {item.customer.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
          {/* HEADER FOR LANDSCAPE*/}
          {landscape && queueItems.length > 0 && (
            <div className="">
              <div className="grid grid-cols-13 mt-3 rounded-md p-2 shadow-2xl bg-primary-cream text-center">
                <div
                  className={
                    landscapeHeaderClass +
                    " col-span-2 border-l-10 rounded-l-xl"
                  }
                >
                  Customer Queue Number
                </div>
                <div className={landscapeHeaderClass + " col-span-2"}>
                  Time Waited
                </div>
                <div className={landscapeHeaderClass + " col-span-1"}>PAX</div>
                <div className={landscapeHeaderClass + " col-span-2"}>
                  Customer Name
                </div>
                <div className={landscapeHeaderClass + " col-span-3"}>
                  Customer Contact Number
                </div>
                <div
                  className={landscapeHeaderClass + " col-span-3 rounded-r-xl"}
                >
                  Status
                </div>
              </div>
              {queueItems.map((item) => {
                if (item.active === true) {
                  return (
                    <div className="grid grid-cols-13 px-2 pb-1 shadow-2xl bg-primary-cream text-center">
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 border-l-10 rounded-l-xl p-1"
                        }
                      >
                        {item.position}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-2"}>
                        {convertedTime(item.createdAt)}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-1"}>
                        {item.pax}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-2"}>
                        {item.customer.name}
                      </div>
                      <div className={landscapeHeaderClass + " col-span-3"}>
                        {item.customer.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-3 rounded-r-xl"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 ">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id="called"
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleCalled(e, item.id)}
                              checked={item.called}
                            />
                            <label
                              htmlFor="called"
                              className={" ml-2 mr-2 text-xs "}
                            >
                              Called
                            </label>
                          </div>
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id="seated"
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleSeated(e, item.id)}
                              checked={item.seated}
                            />
                            <label htmlFor="seated" className={"text-xs ml-2"}>
                              Seated
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                }
              })}
              {queueItems.map((item) => {
                if (item.active === false) {
                  return (
                    <div className="grid grid-cols-13 px-2 pb-1 shadow-2xl bg-primary-cream text-center">
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-2 border-l-10 rounded-l-xl p-1 bg-stone-300"
                        }
                      >
                        {item.position}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-2 bg-stone-300"
                        }
                      >
                        {convertedTime(item.createdAt)}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-1 bg-stone-300"
                        }
                      >
                        {item.pax}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-2 bg-stone-300"
                        }
                      >
                        {item.customer.name}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass + " col-span-3 bg-stone-300"
                        }
                      >
                        {item.customer.number}
                      </div>
                      <div
                        className={
                          landscapeHeaderClass +
                          " col-span-3 rounded-r-xl bg-stone-300"
                        }
                      >
                        <form className=" flex justify-center items-center mt-1 gap-1 bg-stone-300">
                          <div className={"flex items-center "}>
                            <input
                              type="checkbox"
                              id="called"
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleCalled(e, item.id)}
                              checked={item.called}
                            />
                            <label
                              htmlFor="called"
                              className={" ml-2 mr-2 text-xs "}
                            >
                              Called
                            </label>
                          </div>
                          <div className={"flex items-center"}>
                            <input
                              type="checkbox"
                              id="seated"
                              className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                              onChange={(e) => handleSeated(e, item.id)}
                              checked={item.seated}
                            />
                            <label htmlFor="seated" className={"text-xs ml-2"}>
                              Seated
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveOutlet;
