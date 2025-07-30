import React from "react";
import useAuth from "../../hooks/useAuth";

const Logout = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    console.log("Logging out!");
    logout();
  };
  return (
    <div className="pt-15 md:pt-3">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
