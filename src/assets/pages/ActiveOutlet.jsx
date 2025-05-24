import React, { useEffect, useState } from "react";
import { apiPrivate } from "../api/axios";
import { useParams } from "react-router-dom";
import CreateCustomer from "../components/CreateCustomer";

const ActiveOutlet = () => {
  const params = useParams();
  const [queueItems, setQueueItems] = useState([]);
  const [queueData, setQueueData] = useState({});
  const [horizontalView, setHorizontalView] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);

  //TAILWIND CLASSES:
  const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  const activeTableHeader = ``;
  const activeTableAnswer = ``;

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
          if (res.data.queueItems.length > 0) {
            setQueueItems(res.data.queueItems);
          }
        }
      } catch (error) {
        console.error(error);
        console.log("Error in trying to fetch active queue data");
      }
    };
    activeQueueItems();
  }, []);

  //HANDLES
  const handleAddCustomer = (e) => {
    console.log("Add customer");
    e.preventDefault();
    setCreateCustomerModal(true);
  };

  const handleSeated = () => {
    console.log("Seated");
  };
  const handleEndQueue = () => {
    console.log("End Queue");
  };
  return (
    <div className="">
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
        <CreateCustomer setModal={setCreateCustomerModal} />
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
          {!horizontalView &&
            queueItems.map((item) => {
              {
                JSON.stringify(item);
              }
              <div className="flex-row w-full  my-3 rounded-2xl p-2 shadow-2xl bg-primary-cream md:hidden">
                <div className="grid grid-cols-2  p-1">
                  <div className={activeTableHeader}>Customer #</div>
                  <div className={activeTableAnswer}>5</div>
                </div>
                <div className="grid grid-cols-2 p-1 ">
                  <div className={activeTableHeader}>
                    <i className="fa-solid fa-clock"></i> Waited
                  </div>
                  <div className={activeTableAnswer}>5 minutes</div>
                </div>
                <div className="grid grid-cols-2  p-1">
                  <div className={activeTableHeader}>PAX</div>{" "}
                  <div className={activeTableAnswer}>4</div>
                </div>
                <div className="grid grid-cols-2  p-1">
                  <div className={activeTableHeader}>Customer Name</div>
                  <div className={activeTableAnswer}>John</div>
                </div>
                <div className="grid grid-cols-2  p-1">
                  <div className={activeTableHeader}>
                    <i className="fa-solid fa-phone"></i> Customer
                  </div>
                  <div className={activeTableAnswer}>012 345 6789</div>
                </div>
                <form className="grid grid-cols-4">
                  <div className={activeTableHeader + " col-span-2"}>
                    Status
                  </div>
                  <div className={"flex "}>
                    <input
                      type="checkbox"
                      id="seated"
                      className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                      onChange={handleSeated(item.id)}
                    />
                    <label for="seated" className="ml-2 ">
                      Seated
                    </label>
                  </div>
                  <div className={activeTableAnswer + "  flex justify-center"}>
                    <input
                      type="checkbox"
                      id="called"
                      className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
                    />
                    <label for="called" className="ml-2">
                      Called
                    </label>
                  </div>
                </form>
              </div>;
            })}
          {/* HEADER FOR MD*/}
          {horizontalView && (
            <div className="grid grid-cols-13  my-3 rounded-md p-2 shadow-2xl bg-primary-cream  text-center">
              <div className="col-span-2 border-l-10 border-t-1 border-b-1 border-r-1 pt-5 rounded-l-xl pb-5 border-primary-green">
                Customer Queue Number
              </div>
              <div className="col-span-2 border-l-1 border-t-1 border-b-1 border-r-1 p-5 border-primary-green">
                Time Waited
              </div>
              <div className="col-span-1 border-l-1 border-t-1 border-b-1 border-r-1 pt-5 border-primary-green">
                PAX
              </div>
              <div className="col-span-2 border-l-1 border-t-1 border-b-1 border-r-1 p-5 border-primary-green">
                Customer Name
              </div>
              <div className="col-span-3 border-l-1 border-t-1 border-b-1 border-r-1 p-5 border-primary-green">
                Customer Contact Number
              </div>
              <div className=" col-span-3 border-l-1 border-t-1 border-b-1 border-r-1 p-5 rounded-r-xl border-primary-green">
                Status
              </div>
              {/* RENDER TABLE */}
            </div>
          )}
        </div>
      )}
      {JSON.stringify(queueItems)}
    </div>
  );
};

export default ActiveOutlet;
