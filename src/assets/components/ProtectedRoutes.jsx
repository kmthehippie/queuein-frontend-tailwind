import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const refresh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      if (!isAuthenticated) {
        try {
          await refresh();
        } catch (err) {
          console.error(
            "Error refreshing or verifying token in ProtectedRoutes: ",
            err
          );
          logout();
        }
      }
      setIsLoading(false);
    };
    verifyAuth();
  }, [isAuthenticated, refresh, logout]);

  if (isLoading) {
    return <div className="">Loading ... </div>;
  }
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/db/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
