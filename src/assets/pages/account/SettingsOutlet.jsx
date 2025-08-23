import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useApiPrivate from "../../hooks/useApiPrivate";
import UpdateOutletModal from "../../components/UpdateOutletModal";
import AuditLogs from "./AuditLogs";
import { alphabeticalSort } from "../../utils/sortList";
import { useNavigate, useParams, Link } from "react-router-dom";

//TODO: SELF NOTES: HOW ABOUT CREATING A COMPONENT THAT TAKES IN NAME OF FIELD, DATA TO DISPLAY, AND ETC. THAT WAY WE CAN JUST CREATE COMPONENT FOR EVERY DIV INSTEAD OF SO MUCH REPEATED CODE.

const SettingsOutlet = () => {
  const { accountId, outletText } = useAuth();
  const apiPrivate = useApiPrivate();
  const { outletId } = useParams();

  const [allOutlets, setAllOutlets] = useState([]);
  const [selectedOutletId, setSelectedOutletId] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState({});
  const navigate = useNavigate();

  const pathnameEndsWithAuditLogs = location.pathname.endsWith("auditlogs");
  // In SettingsOutlet
  const handleOutletChange = (id) => {
    setSelectedOutletId(id);
    const outletIndex = allOutlets.findIndex((outlet) => outlet.id === id);
    setSelectedOutlet(allOutlets[outletIndex]);
    if (pathnameEndsWithAuditLogs) {
      navigate(`/db/${accountId}/settings/outlet/${id}/auditlogs`);
    }
  };

  useEffect(() => {
    const fetchAllOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/alloutlets/${accountId}`);
        const outlets = res.data.outlets;
        if (outlets.length > 0) {
          const sorted = alphabeticalSort(outlets);
          setAllOutlets(sorted);
          const initialOutlet =
            sorted.find((o) => o.id.toString() === outletId) || sorted[0];
          setSelectedOutletId(initialOutlet.id);
          setSelectedOutlet(initialOutlet);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllOutlets();
  }, []);

  useEffect(() => {
    if (allOutlets.length > 0 && outletId) {
      const selected = allOutlets.find((o) => o.id.toString() === outletId);
      if (selected) {
        setSelectedOutletId(selected.id);
        setSelectedOutlet(selected);
      }
    }
  }, [outletId, allOutlets]);

  const handleCancel = () => {
    console.log("Nothing happens ");
    console.log("selected outlet:", selectedOutlet);
  };

  const handleUpdateSuccess = (updatedOutlet) => {
    const outletIndex = allOutlets.findIndex(
      (outlet) => outlet.id === updatedOutlet.id
    );
    if (outletIndex !== -1) {
      const newAllOutlets = [...allOutlets];
      newAllOutlets[outletIndex] = updatedOutlet;
      setAllOutlets(newAllOutlets);
    }
    setSelectedOutlet(updatedOutlet);
  };

  //TODO: NEED TO EDIT THE DIV TO LOOK NICE
  if (allOutlets.length === 0) {
    return (
      <div className=" lg:max-h-[55vh] h-full gap-1 flex flex-col items-center justify-center p-10">
        <div className="">Nothing here</div>{" "}
        <Link to={`/db/${accountId}/outlets/new`}>
          <p className="text-xs text-primary-green hover:text-primary-light-green">
            Please create {outletText}.
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="overflow-y-auto max-h-[63vh]  lg:max-h-[55vh] h-full gap-1">
        <div className="border-b-primary-light-green p-2 bg-primary-cream z-1 sticky top-0 border-b-1 ">
          {allOutlets && (
            <div className="flex overflow-x-auto ">
              {allOutlets.map((outlet) => (
                <div
                  className={`text-nowrap cursor-pointer m-0.5 text-sm border-1 border-primary-light-green font-light hover:text-primary-green transition delay-100 duration-150 p-2 ${
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
          )}
          {!allOutlets && (
            <div className="flex overflow-x-auto ">
              No outlets available yet.
            </div>
          )}
        </div>
        {!pathnameEndsWithAuditLogs && (
          <div className="lg:col-span-4 p-3">
            <UpdateOutletModal
              show={true}
              onClose={handleCancel}
              outletData={selectedOutlet}
              accountId={accountId}
              onUpdateSuccess={handleUpdateSuccess}
              view={"full"}
            />
          </div>
        )}
        {pathnameEndsWithAuditLogs && (
          <AuditLogs
            selectedId={selectedOutletId}
            outletName={selectedOutlet.name}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsOutlet;
