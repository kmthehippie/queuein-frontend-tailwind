import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPrivate } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [reloadNav, setReloadNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = useCallback(async () => {
    console.log("Trying to refresh within auth context: ", location.pathname);
    if (location.pathname.includes("/register")) {
      return null;
    }
    try {
      const response = await apiPrivate.post("/refresh");

      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setAccount(response.data.accountId);
        setIsAuthenticated(true);
        console.log(
          "Refresh token successfully updated access token: ",
          response.data.accessToken
        );
        console.log(
          "AuthContext -> refresh -> account id? ",
          response.data.accountId
        );
        setAccountId(response.data.accountId);
        return response.data.accessToken;
      } else {
        console.log(
          "Positive response of data but no access token, so logout "
        );
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
    setAccountId(accountId);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    console.log("Logging out!");
    try {
      const response = await apiPrivate.post(`/logout/${accountId}`);
      if (response.status === 200 || response.status === 204) {
        console.log("Logout successfully.");
      }
    } catch (error) {
      console.error("Error logging out: ", error);
    } finally {
      setIsAuthenticated(false);
      setAccessToken(null);
      setAccount(null);
      setAccountId(null);
      navigate("/db/login");
    }
    //empty out the accesstoken and refreshtoken in cookies (Done in backend)
  }, [navigate]);

  useEffect(() => {
    console.log("There are changes in the reload nav! ", reloadNav);
  }, [reloadNav]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log("Initial auth check failed", error);
        setIsAuthenticated(false);
        setAccessToken(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [refresh]);

  const contextValue = useMemo(
    () => ({
      accessToken,
      login,
      logout,
      refresh,
      isAuthenticated,
      account,
      accountId,
      updateAccessToken: setAccessToken,
      updateIsAuthenticated: setIsAuthenticated,
      updateAccount: setAccount,
      reloadNav,
      setReloadNav: () => setReloadNav((prev) => !prev),
    }),
    [accessToken, isAuthenticated, account, login, logout, accountId, reloadNav]
  );
  if (authLoading) {
    return <div>Loading Application...</div>; // Or a more sophisticated spinner
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
