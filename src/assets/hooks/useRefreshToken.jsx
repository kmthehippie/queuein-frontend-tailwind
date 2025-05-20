import { apiPrivate } from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const { updateAccessToken, logout, accessToken, updateIsAuthenticated } =
    useAuth();
  const navigate = useNavigate();

  const refresh = async () => {
    try {
      const response = await apiPrivate.post("/refresh");
      if (response?.data?.accessToken) {
        updateAccessToken(response.data.accessToken);
        updateIsAuthenticated(true);
        console.log(
          "Refresh token successfully updated access token: ",
          response.data.accessToken
        );
        return response.data.accessToken;
      } else {
        logout();
        navigate("/db/login", { replace: true });
        return null;
      }
    } catch (error) {
      console.error("Error during refresh token request:", error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        logout();
        navigate("/db/login", { replace: true });
      } else {
        console.error("An error occurred during token refresh:", error);
        throw error;
      }
      return null; // Indicate refresh failed
    }
  };

  return refresh;
};

export default useRefreshToken;
