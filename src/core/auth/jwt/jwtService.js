import axiosInstance from '@/services/api'
import TokenService from "./tokenService";
import { AuthStore } from "@/stores/authStore";
import { globalStore } from "@/stores/globalStore";


const setup = () => {

  let subscribers = []
  let isAlreadyFetchingAccessToken = false;
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        // config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {

          originalConfig._retry = true;

          try {
              if (isAlreadyFetchingAccessToken == false) {
                isAlreadyFetchingAccessToken = true;
                const rs = await axiosInstance.post("api/v1/auth-usr/token/refresh/", {
                  refresh: TokenService.getLocalRefreshToken(),
                });
                isAlreadyFetchingAccessToken = false;

                const accessToken  = rs.data.access;

                TokenService.updateLocalAccessToken(accessToken);
                originalConfig.sent = true
                originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;

              }
              // refresh page
              return axiosInstance({
                ...originalConfig,
                ...{
                headers: originalConfig.headers.toJSON(),
              }
            });
            } catch (_error) {
              const store = AuthStore();
              const g_Store = globalStore();

              const formData = {
                company: g_Store.getUserData().company,
                user: g_Store.getUserData().user_id,
              };

              axiosInstance
                .post("api/v1/hrm/clockout", formData)
                .then((response) => {
                  console.log(response);
                  store.logout();
                  store.destroyClockInSession();
                })
                .catch((error) => {
                  store.logout();
                });
                return Promise.reject(_error);
              // logout the user.
            }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
