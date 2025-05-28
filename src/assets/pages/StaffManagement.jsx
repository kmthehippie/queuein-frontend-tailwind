import React, { useState, useEffect } from "react";
import { apiPrivate } from "../api/axios";
import { useParams } from "react-router-dom";
import AuthorizedUser from "./AuthorizedUser";

const StaffManagement = () => {
  const [viewModal, setViewModal] = useState(false);
  const [staffList, setStaffList] = useState([]);

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [refreshPg, setRefreshPg] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [staffToDeleteId, setStaffDeleteId] = useState(null);
  const [staffToUpdateId, setStaffUpdateId] = useState(null);
  const [updateViewModal, setUpdateViewModal] = useState(false);
  const [staffInfoForUpdate, setStaffInfoForUpdate] = useState({});

  const params = useParams();
  const labelClass = ` text-gray-500 text-sm transition-all duration-300 cursor-text color-gray-800 `;
  const inputClass = (hasError) =>
    `border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black
  ${hasError ? "border-red-500" : ""}`;
  const errorClass = `text-red-600 text-center`;
  const buttonClass = ` mt-3 hover:bg-primary-dark-green hover:text-primary-cream transition ease-in font-light py-2 px-8 rounded-xl focus:outline-none focus:shadow-outline hover:border-transparent border-primary-dark-green border-1`;
  const tableClass = `border-l-1 border-t-1 border-b-1 border-r-1 border-primary-green text-sm`;

  const toggleModal = (toggle) => {
    if (toggle === true) {
      setViewModal(true);
    } else if (toggle === false) {
      setErrors({});
      setEmail("");
      setPassword("");
      setCfmPassword("");
      setName("");
      setViewModal(false);
      setRefreshPg(false);
    }
  };
  const handleOpenModal = () => {
    toggleModal(true);
  };
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  useEffect(() => {
    //Get all existing staff
    const fetchStaff = async () => {
      try {
        const res = await apiPrivate.get(`/staffList/${params.accountId}`);
        if (res.status === 200) {
          console.log("response from staff", res.data);
          setStaffList(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStaff();
  }, [refreshPg]);

  const handleCreateNewStaff = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordErr(true);
      setErrors({ general: "Password must be at least 6 characters long." });
      return;
    }
    if (password !== cfmPassword) {
      setPasswordErr(true);
      setErrors({ general: "Confirm password does not match password" });
      return;
    }
    if (name.length === 0) {
      setNameErr(true);
      setErrors({
        general:
          "Name cannot be empty. Staff name will be used to login and verify.",
      });
      return;
    }

    setPasswordErr(false);
    setNameErr(false);
    setErrors({});

    setPendingAction("create");
    setShowAuthModal(true);
  };

  const handleDeleteStaff = (staffId) => {
    setErrors({});
    setStaffDeleteId(staffId);
    setPendingAction("delete");
    setShowAuthModal(true);
  };
  const handleUpdateStaff = (staffId) => {
    setErrors({});
    setStaffUpdateId(staffId);
    setPendingAction("update");
    console.log("Handling staff update: ", staffId);
    setShowAuthModal(true);
  };

  const handleDataForUpdatingStaff = (staffId) => {
    const getData = async () => {
      try {
        const res = await apiPrivate.get(
          `/updateStaff/${params.accountId}/${staffToUpdateId}`
        );
        if (res.status === 200) {
          setStaffInfoForUpdate(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setUpdateViewModal(true);
  };
  const createStaff = async () => {
    try {
      const data = {
        email: email,
        name: name,
        password: password,
        role: selectedRole,
      };
      console.log("Trying to create a staff: ", data);
      const res = await apiPrivate.post(`/newStaff/${params.accountId}`, data);
      if (res.status === 200) {
        setRefreshPg(true);
        setTimeout(() => {
          toggleModal(false);
        }, 1000);
        console.log("response from create staff", res.data);
      }
    } catch (error) {
      console.error(error);
      setErrors({
        general: error.response?.data?.message || "Failed to create a staff",
      });
    } finally {
      setShowAuthModal(false);
      setPendingAction(null);
    }
  };

  const deleteStaff = async () => {
    if (!staffToDeleteId) {
      console.error("No staff ID to delete");
      setShowAuthModal(false);
      setPendingAction(null);
      return;
    }
    try {
      console.log(
        "Attempting to delete a staff with staffID: ",
        staffToDeleteId
      );
      const res = await apiPrivate.delete(
        `staff/${params.accountId}/${staffToDeleteId}`
      );
      if (res.status === 200) {
        console.log(`Staff ${staffToDeleteId} deleted successfully.`);
        setRefreshPg(true);
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to delete staff.",
      });
    } finally {
      setShowAuthModal(false);
      setPendingAction(null);
      setStaffDeleteId(null);
    }
  };

  const updateStaff = async () => {
    if (!staffToUpdateId) {
      console.error("No staff ID to update");
      setShowAuthModal(false);
      setPendingAction("null");
      return;
    }

    //! NEED TO GRAB DATA ABOUT THIS STAFF TO UPDATE IT. EGS PW ETC. set the data into updateviewmodal

    // try {
    //   console.log(
    //     "Attempting to delete a staff with staffID: ",
    //     staffToUpdateId
    //   );
    //   const res = await apiPrivate.update(
    //     `staff/${params.accountId}/${staffToUpdateId}`
    //   );
    //   if (res.status === 200) {
    //     console.log(`Staff ${staffToUpdateId} updated successfully.`);
    //     setRefreshPg(true);
    //   }
    // } catch (error) {
    //   console.error("Error updating staff:", error);
    //   setErrors({
    //     general: error.response?.data?.message || "Failed to delete staff.",
    //   });
    // } finally {
    //   setShowAuthModal(false);
    //   setPendingAction(null);
    //   setStaffUpdateId(null);
    // }
    //TODO: OPEN A MODAL FOR USER TO FILL OUT DATA FOR UPDATING STAFF INFORMATION
    console.log("Update the staff information!");
  };
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setPendingAction(null);
    setStaffDeleteId(null);
    setStaffUpdateId(null);
    setErrors({ general: "Action cancelled or verification failed." });
  };

  const handleAuthSuccess = () => {
    console.log("What is the pending action:", pendingAction);
    if (pendingAction === "create") {
      createStaff();
    } else if (pendingAction === "delete") {
      console.log("Delete staff");
      deleteStaff();
    } else if (pendingAction === "update") {
      console.log("Update staff");
      updateStaff();
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center md:mt-2 md:p-5">
      <div className="">
        <h1 className="text-2xl font-semibold">Staff Onboard</h1>
      </div>
      {updateViewModal && (
        <div className="bg-primary-cream p-5 rounded-2xl m-2 w-md relative">
          <h3 className="text-xl pb-2 text-center">Update staff</h3>

          <p
            className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
            onClick={() => toggleModal(false)}
          >
            X
          </p>
          <form>
            {JSON.stringify(staffInfoForUpdate)}
            <div className="flex-row p-1 ">
              <div>
                <label htmlFor="staff-name" className={labelClass}>
                  Staff Name
                </label>
                <input
                  id="staff-name"
                  type="text"
                  placeholder="Enter your staff name"
                  className={inputClass(nameErr)}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  autoComplete="name"
                  required
                />
              </div>
              <small className="text-xs italic text-stone-600">
                Your staff will be using this to login
              </small>
              <div className={``}>
                <label htmlFor="email" className={labelClass}>
                  Staff Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass(emailErr)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="">
                <label htmlFor="role" className={labelClass}>
                  Staff Role
                </label>
                <br />
                <select
                  id="role"
                  name="role"
                  className="border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="" disabled defaultValue>
                    Select a Role
                  </option>
                  <optgroup label="Allowed to perform sensitive functions">
                    <option value="OWNER">Owner</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ASSISTANT_MANAGER">Assistant Manager</option>
                    <option value="HOST">Host</option>
                  </optgroup>
                  <optgroup label="Allowed to perform basic functions">
                    <option value="Server">Server</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="BARISTA">Barista</option>
                  </optgroup>
                </select>
                <small className="text-xs italic text-stone-500">
                  If you do not choose a role, it will default to Host.
                </small>
              </div>
              <div className={``}>
                <label htmlFor="password" className={labelClass}>
                  Staff Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your staff password"
                  className={inputClass(passwordErr)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="password"
                  required
                />
              </div>
              <small className="text-xs italic text-stone-500">
                Remember this password. You will use it for verification.
              </small>
              <div>
                <label htmlFor="cfm-staff-password" className={labelClass}>
                  Confirm Staff Password
                </label>
                <input
                  id="cfm-staff-password"
                  type="password"
                  placeholder="Confirm Staff password"
                  className={inputClass()}
                  onChange={(e) => {
                    setCfmPassword(e.target.value);
                  }}
                  autoComplete="password"
                  required
                />
              </div>
              <button
                className={buttonClass + " bg-primary-green text-white"}
                onClick={handleCreateNewStaff}
              >
                Submit Update Staff
              </button>
            </div>
            {errors && <p className={errorClass}>{errors.general}</p>}{" "}
          </form>
        </div>
      )}
      {viewModal && (
        <div className="bg-primary-cream p-5 rounded-2xl m-2 w-md relative">
          <h3 className="text-xl pb-2 text-center">Create a new staff</h3>

          <p
            className="absolute top-0 right-0 text-red-700 pr-5 pt-2 hover:text-red-950 transition ease-in active:text-red-950 font-bold cursor-pointer"
            onClick={() => toggleModal(false)}
          >
            X
          </p>
          <form>
            <div className="flex-row p-1 ">
              <div>
                <label htmlFor="staff-name" className={labelClass}>
                  Staff Name
                </label>
                <input
                  id="staff-name"
                  type="text"
                  placeholder="Enter your staff name"
                  className={inputClass(nameErr)}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  autoComplete="name"
                  required
                />
              </div>
              <small className="text-xs italic text-stone-600">
                Your staff will be using this to login
              </small>
              <div className={``}>
                <label htmlFor="email" className={labelClass}>
                  Staff Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass(emailErr)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="">
                <label htmlFor="role" className={labelClass}>
                  Staff Role
                </label>
                <br />
                <select
                  id="role"
                  name="role"
                  className="border-1 border-gray-400 rounded-lg bg-transparent appearance-none block w-full py-3 px-4 text-gray-700 text-xs leading-tight focus:outline-none focus:border-black peer active:border-black"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="" disabled defaultValue>
                    Select a Role
                  </option>
                  <optgroup label="Allowed to perform sensitive functions">
                    <option value="MANAGER">Manager</option>
                    <option value="ASSISTANT_MANAGER">Assistant Manager</option>
                    <option value="HOST">Host</option>
                  </optgroup>
                  <optgroup label="Allowed to perform basic functions">
                    <option value="Server">Server</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="BARISTA">Barista</option>
                  </optgroup>
                </select>
                <small className="text-xs italic text-stone-500">
                  If you do not choose a role, it will default to Host.
                </small>
              </div>
              <div className={``}>
                <label htmlFor="password" className={labelClass}>
                  Staff Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your staff password"
                  className={inputClass(passwordErr)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="password"
                  required
                />
              </div>
              <small className="text-xs italic text-stone-500">
                Remember this password
              </small>
              <div>
                <label htmlFor="cfm-staff-password" className={labelClass}>
                  Confirm Staff Password
                </label>
                <input
                  id="cfm-staff-password"
                  type="password"
                  placeholder="Confirm Staff password"
                  className={inputClass()}
                  onChange={(e) => {
                    setCfmPassword(e.target.value);
                  }}
                  autoComplete="password"
                  required
                />
              </div>
              <button
                className={buttonClass + " bg-primary-green text-white"}
                onClick={handleCreateNewStaff}
              >
                Submit New Staff
              </button>
            </div>
            {errors && <p className={errorClass}>{errors.general}</p>}{" "}
          </form>
        </div>
      )}
      {!viewModal && (
        <div className="p-5 bg-primary-cream w-full rounded-2xl max-w-xl">
          <div className="my-3 ">
            <button
              className={
                buttonClass +
                " bg-primary-cream  text-primary-green cursor-pointer mb-3"
              }
              onClick={handleOpenModal}
            >
              Create New Staff +
            </button>
          </div>
          {staffList.length > 0 && (
            <div className="grid grid-cols-8 w-full text-primary-dark-green font-semibold">
              <div className={tableClass + " col-span-2 rounded-l-lg p-5 "}>
                Name
              </div>
              <div className={tableClass + " col-span-2 p-5 "}>Role</div>
              <div className={tableClass + " col-span-3 p-5"}>Email</div>
              <div
                className={
                  tableClass +
                  " col-span-1 rounded-r-lg flex items-center justify-center  "
                }
              >
                <i className="fa-solid fa-trash"></i>
              </div>
            </div>
          )}
          {staffList.length > 0 &&
            staffList.map((staff) => (
              <div
                className="grid grid-cols-8 w-full font-light"
                key={staff.id}
              >
                <div
                  className={
                    tableClass +
                    " col-span-2 rounded-l-lg p-2 cursor-pointer hover:text-primary-light-green transition ease-in-out"
                  }
                  onClick={() => handleUpdateStaff(staff.id)}
                >
                  <i className="fa-solid fa-pen pr-2"></i>
                  {staff.name}
                </div>
                <div className={tableClass + " col-span-2 p-2 "}>
                  {staff.role.replace(/_/g, " ")}
                </div>
                <div className={tableClass + " col-span-3 p-2"}>
                  {staff.email}
                </div>
                <div
                  className={
                    tableClass +
                    " col-span-1 rounded-r-lg p-2 flex items-center justify-center cursor-pointer"
                  }
                  onClick={() => handleDeleteStaff(staff.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </div>
              </div>
            ))}
        </div>
      )}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full">
            <button
              onClick={handleAuthModalClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            {pendingAction === "create" && (
              <AuthorizedUser
                onSuccess={handleAuthSuccess}
                onFailure={handleAuthModalClose}
                actionPurpose="Create New Staff"
                minimumRole="ASSISTANT_MANAGER"
              />
            )}
            {pendingAction === "delete" && (
              <AuthorizedUser
                onSuccess={handleAuthSuccess}
                onFailure={handleAuthModalClose}
                actionPurpose="Delete Staff"
                minimumRole="MANAGER"
              />
            )}
            {pendingAction === "update" && (
              <AuthorizedUser
                onSuccess={handleAuthSuccess}
                onFailure={handleAuthModalClose}
                actionPurpose="Update Staff"
                minimumRole="MANAGER"
              />
            )}

            {errors.general && <p className={errorClass}>{errors.general}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
