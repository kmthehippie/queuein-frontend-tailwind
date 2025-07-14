import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { apiPrivate } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      const response = await apiPrivate.post("/refresh");
      console.log("This is the response for refresh: ", response);
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
        console.log(
          "Refresh token successfully updated access token: ",
          response.data.accessToken
        );
        return response.data.accessToken;
      } else {
        console.log("Positive response of data but no accesstoken, so logout ");
        logout();
        navigate("/db/login", { replace: true });
        return null;
      }
    } catch (error) {
      console.error("Error during refresh token request:", error);
      logout();
      navigate("/db/login", { replace: true });
      return null;
    }
  }, []);

  const login = useCallback((newAccessToken, accountId) => {
    console.log(
      "Logging in in auth context: setting accesstoken & acct id ",
      newAccessToken,
      accountId
    );
    setAccessToken(newAccessToken);
    setAccount({ id: accountId });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    console.log("Logging out!");
    setIsAuthenticated(false);
    setAccessToken(null);
    setAccount(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log("Init of auth check failed", error);
      } finally {
        setAuthLoading(false);
      }
    };
    if (authLoading) {
      checkAuth();
    }
  }, [authLoading, refresh]);
  const contextValue = useMemo(
    () => ({
      accessToken,
      login,
      logout,
      refresh,
      isAuthenticated,
      account,
      updateAccessToken: setAccessToken,
      updateIsAuthenticated: setIsAuthenticated,
      updateAccount: setAccount,
    }),
    [accessToken, isAuthenticated, account, login, logout]
  );
  if (authLoading) {
    return <div>Loading Application...</div>; // Or a more sophisticated spinner
  }
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
