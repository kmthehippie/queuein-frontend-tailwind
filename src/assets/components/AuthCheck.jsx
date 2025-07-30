import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AuthCheck = ({ children, redirectTo = "/db" }) => {
  const { isAuthenticated, account, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (account) {
        navigate(`/db/${account}/outlets/all`, { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [isAuthenticated, account, navigate, authLoading, redirectTo]);

  return children;
};

export default AuthCheck;
