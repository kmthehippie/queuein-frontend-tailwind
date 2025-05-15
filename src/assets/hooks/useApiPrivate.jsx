import { interceptedApiPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";

const useApiPrivate = () => {
  const { accessToken, logout } = useAuth();
  const refresh = useRefreshToken();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = interceptedApiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = interceptedApiPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const previousRequest = error?.config;

        if (
          (error?.response?.status === 401 ||
            error?.response?.status === 403) &&
          previousRequest._sent === undefined
        ) {
          previousRequest._sent = true;
          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              previousRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;

              return interceptedApiPrivate(previousRequest);
            }
          } catch (err) {
            // Empty out everything
            logout();
            navigate("/db/login", { replace: true });
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      interceptedApiPrivate.interceptors.request.eject(requestInterceptor);
      interceptedApiPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refresh, logout, navigate]);

  return interceptedApiPrivate;
};

export default useApiPrivate;
