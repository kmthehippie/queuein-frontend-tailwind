import React, { createContext, useCallback, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);

  const login = useCallback((newAccessToken, accountId) => {
    setAccessToken(newAccessToken);
    setAccount({ id: accountId });
    setIsAuthenticated(true);
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setAccount(null);
  };

  const contextValue = useMemo(
    () => ({
      accessToken,
      login,
      logout,
      isAuthenticated,
      account,
      updateAccessToken: setAccessToken,
      updateIsAuthenticated: setIsAuthenticated,
    }),
    [accessToken, isAuthenticated, account, login]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
