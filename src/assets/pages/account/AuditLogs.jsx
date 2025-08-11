import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { interceptedApiPrivate } from "../../api/axios";

const AuditLogs = ({ selectedId, outletName }) => {
  const { accountId } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const navigate = useNavigate();

  const fetchAuditLogs = async () => {
    console.log("Sending outletId through component: ", selectedId);
    try {
      const res = await interceptedApiPrivate(
        `/settings/auditLogs/${accountId}/${selectedId}`
      );
      if (res.status === 200) {
        console.log("Response from audit logs", res.data);
        setAuditLogs(res.data);
      }
    } catch (error) {
      console.error("There was an error fetching audit logs ", error);
    }
  };

  const readableTime = (timestamp) => {
    const dateObject = new Date(timestamp);
    const normalDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", // DD
      month: "short", // MMM (e.g., Aug)
      year: "numeric", // YYYY
    }).format(dateObject);
    const normalTime = dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    });

    const stringToReturn = `${normalDate} at ${normalTime}`;
    return stringToReturn;
  };

  const handleNavigateSettingsOutlet = (e) => {
    e.preventDefault();
    console.log("Trying to navigate to settings outlet ", selectedId);
    navigate(`/db/${accountId}/settings/outlet`);
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [selectedId]);

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center py-3">
        <h1 className="text-3xl font-extralight text-center ">Audit Logs</h1>
        <small className="text-center text-sm">{outletName}</small>
        <div className="py-2.5 px-3 rounded-full lg:rounded-sm lg:p-2 text-sm font-light text-gray-500 border-1 border-primary-cream hover:border-primary-green hover:text-primary-dark-green transition ease-in w-max cursor-pointer bg-primary-cream mt-2 ">
          <button
            onClick={handleNavigateSettingsOutlet}
            className="hover:text-primary-green transition ease-in cursor-pointer flex justify-center items-center"
          >
            <i className="fa-solid fa-clipboard lg:pr-2"></i>
            <span className={`hidden lg:block `}> Back To Settings </span>
          </button>
        </div>
      </div>
      {auditLogs.length > 0 && (
        <div className="p-3 ">
          {/* Table Headers for large screens */}

          <div className="hidden lg:grid lg:grid-cols-3 font-bold text-gray-600 mb-2 text-center">
            <div>Action Type</div>
            <div>Created On</div>
            <div>Done By</div>
          </div>

          {/* Audit Log entries */}
          {auditLogs.map((auditLog) => (
            <div
              className="p-3 mb-3 lg:p-0 lg:m-0 lg:grid lg:grid-cols-3 border-1 lg:border-0"
              key={auditLog.id}
            >
              <div className="mb-1 lg:mb-1">
                <p className="text-sm italic lg:hidden">Created On: </p>
                <p className=" font-light text-gray-600 lg:text-center">
                  {readableTime(auditLog.timestamp)}
                </p>
              </div>
              <div className="mb-1 lg:mb-1 ">
                <p className="text-sm italic lg:hidden">Action Type: </p>
                <p className=" font-light text-gray-600 lg:text-center">
                  {auditLog.actionType}
                </p>
              </div>

              <div className="mb-1 lg:mb-1">
                <p className="text-sm italic lg:hidden">Done By: </p>
                <p className=" font-light text-gray-600 lg:text-center">
                  {auditLog.staff.name}{" "}
                  <small className="text-xs text-primary-green">
                    {auditLog.staff.role.toLowerCase()}
                  </small>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {auditLogs.length === 0 && (
        <div className="flex flex-col items-center text-3xl italic font-bold p-10">
          <h1>There are no audit logs for this outlet</h1>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
