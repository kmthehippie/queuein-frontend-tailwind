import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useApiPrivate from "../../hooks/useApiPrivate";
import UpdateOutletModal from "../../components/UpdateOutletModal";
import AuditLogs from "./AuditLogs";
import { useLocation } from "react-router-dom";

//TODO: SELF NOTES: HOW ABOUT CREATING A COMPONENT THAT TAKES IN NAME OF FIELD, DATA TO DISPLAY, AND ETC. THAT WAY WE CAN JUST CREATE COMPONENT FOR EVERY DIV INSTEAD OF SO MUCH REPEATED CODE.

const SettingsOutlet = () => {
  const { accountId } = useAuth();
  const apiPrivate = useApiPrivate();

  const [allOutlets, setAllOutlets] = useState([]);
  const [selectedOutletId, setSelectedOutletId] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState({});
  const [modalView, setModalView] = useState(false);
  // In SettingsOutlet
  const handleOutletChange = (id) => {
    const selected = allOutlets.find((outlet) => outlet.id === id);
    if (selected) {
      setSelectedOutletId(selected.id);
      setSelectedOutlet(selected);
    }
    const remainingOutlets = allOutlets.filter(
      (outlet) => outlet.id !== selected.id
    );
    const sortedOutlets = [selected, ...remainingOutlets];
    setAllOutlets(sortedOutlets);
    setModalView(!modalView);
  };

  useEffect(() => {
    console.log(window.location.pathname);
    const fetchAllOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/alloutlets/${accountId}`);
        if (res.data.length > 0) {
          setAllOutlets(res.data);
          if (res.data.length > 3) {
            setModalView(true);
          }
          const initialOutlet = res.data[0];

          // Perform all initial state updates in one logical block
          setSelectedOutletId(initialOutlet.id);
          setSelectedOutlet(initialOutlet);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllOutlets();
  }, []);

  const handleCancel = () => {
    console.log("Handling cancel");
    console.log("selected outlet:", selectedOutlet);
  };

  const handleUpdateSuccess = (updatedOutlet) => {
    console.log("Updated Outlet", updatedOutlet);
    console.log("All outlets: ", allOutlets);
    const outletIndex = allOutlets.findIndex(
      (outlet) => outlet.id === updatedOutlet.id
    );
    console.log("outlet index: ", outletIndex);
    if (outletIndex !== -1) {
      const newAllOutlets = [...allOutlets];
      newAllOutlets[outletIndex] = updatedOutlet;
      setAllOutlets(newAllOutlets);
    }
    setSelectedOutlet(updatedOutlet);
  };
  const handleToggleView = () => {
    setModalView(!modalView);
  };
  const pathnameEndsWithAuditLogs = location.pathname.endsWith("auditlogs");

  return (
    <div className="">
      <div className="lg:grid lg:grid-cols-5 lg:gap-2 overflow-y-auto max-h-[63vh] h-full">
        <div className="lg:col-span-1 border-primary-light-green p-2 bg-primary-cream z-1 sticky top-0 border-b-1 lg:border-b-0">
          {allOutlets && (
            <div className="flex flex-wrap w-full lg:flex-col">
              <div className="lg:block hidden">
                {allOutlets.map((outlet) => (
                  <div
                    className={`lg:mb-5 cursor-pointer m-0.5 text-sm border-1 border-primary-light-green font-light hover:text-primary-green transition delay-100 duration-150 p-2 ${
                      selectedOutletId === outlet.id
                        ? "border-4 border-primary-light-green"
                        : ""
                    }`}
                    key={outlet.id}
                  >
                    <button
                      className=" cursor-pointer"
                      onClick={() => handleOutletChange(outlet.id)}
                    >
                      {outlet.name}
                    </button>
                  </div>
                ))}
              </div>
              <div className="lg:hidden ">
                {(modalView ? allOutlets.slice(0, 3) : allOutlets).map(
                  (outlet) => (
                    <div
                      className={`lg:mb-5 cursor-pointer m-0.5 text-sm border-1 border-primary-light-green font-light hover:text-primary-green transition delay-100 duration-150 p-2 ${
                        selectedOutletId === outlet.id
                          ? "border-4 border-primary-light-green"
                          : ""
                      }`}
                      key={outlet.id}
                    >
                      <button
                        className=" cursor-pointer"
                        onClick={() => handleOutletChange(outlet.id)}
                      >
                        {outlet.name}
                      </button>
                    </div>
                  )
                )}
                {modalView && (
                  <div className="absolute right-0 bottom-1">
                    <button
                      onClick={handleToggleView}
                      className="px-3 py-1.5 text-sm text-primary-green border-1 border-white rounded-full  hover:border-primary-green  cursor-pointer  transition-colors duration-200"
                    >
                      <i className="fa-solid fa-caret-down text-primary-green"></i>
                    </button>
                  </div>
                )}
                {!modalView && (
                  <div className="absolute right-0 bottom-1">
                    <button
                      onClick={handleToggleView}
                      className="px-3 py-1.5 text-sm text-primary-green border-1 border-white rounded-full  hover:border-primary-green cursor-pointer hover:text-white transition-colors duration-200"
                    >
                      <i className="fa-solid fa-caret-up text-primary-green"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {!pathnameEndsWithAuditLogs && (
          <div className="lg:col-span-4 p-3">
            <UpdateOutletModal
              show={true}
              onClose={handleCancel} // Pass toggleEdit as the close handler
              outletData={selectedOutlet} // Pass the full outlet object
              accountId={accountId}
              onUpdateSuccess={handleUpdateSuccess}
              view={"full"}
            />
          </div>
        )}
        {pathnameEndsWithAuditLogs && <AuditLogs />}
      </div>
    </div>
  );
};

export default SettingsOutlet;
