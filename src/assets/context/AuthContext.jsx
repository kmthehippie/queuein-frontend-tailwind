import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPrivate } from "../api/axios";
import Loading from "../components/Loading";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [businessType, setBusinessType] = useState("BASIC"); //Kinda useless but let's just keep it for now
  const [acctSlug, setAcctSlug] = useState("");
  const [outletText, setOutletText] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [reloadNav, setReloadNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleOutletText = (type) => {
    if (type === "RESTAURANT") {
      setOutletText("Outlet");
    } else if (type === "CLINIC") {
      setOutletText("Clinic");
    } else if (type === "BASIC") {
      setOutletText("Event Location");
    }
  };
  const refresh = useCallback(async () => {
    console.log("Trying to refresh within auth context: ", location.pathname);

    if (location.pathname.includes("/register")) {
      return null;
    }

    try {
      const response = await apiPrivate.post("/refresh");
      setAuthLoading(true);
      console.log("Response in refresh: ", response);
      if (response.data.accessToken) {
        setBusinessType(response.data.businessType);
        setAccessToken(response.data.accessToken);
        setAcctSlug(response.data.acctSlug);
        setIsAuthenticated(true);
        setAccountId(response.data.accountId);
        handleOutletText(response.data.businessType);
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
      console.log("No access token");
      console.error("Error during refresh token request:", error);
      logout();
      navigate("/db/login", { replace: true });
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = useCallback((data) => {
    setAccessToken(data.accessToken);
    setBusinessType(data.businessType);
    handleOutletText(data.businessType);
    setAccountId(data.accountId);
    setAcctSlug(data.acctSlug);
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
      setBusinessType("");
      setOutletText("");
      setAccountId(null);
    }
   
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
      outletText,
      acctSlug,
      businessType,
      login,
      logout,
      refresh,
      isAuthenticated,
      accountId,
      updateAccessToken: setAccessToken,
      updateIsAuthenticated: setIsAuthenticated,
      updateAccount: setAccountId,
      reloadNav,
      setReloadNav: () => setReloadNav((prev) => !prev),
    }),
    [
      accessToken,
      isAuthenticated,
      login,
      logout,
      accountId,
      reloadNav,
      acctSlug,
    ]
  );
  if (authLoading) {
    return (
      <Loading
        title={"Loading your previous login... "}
        paragraph={"Please wait for the loading to end."}
      />
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
