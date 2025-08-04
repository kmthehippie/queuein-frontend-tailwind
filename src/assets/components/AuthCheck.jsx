import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AuthCheck = ({ children, redirectTo = "/db/login" }) => {
  const { isAuthenticated, account, accountId, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (account || accountId) {
        navigate(`/db/${accountId}/outlets/all`, { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [isAuthenticated, account, navigate, authLoading, redirectTo]);

  return children;
};

export default AuthCheck;
