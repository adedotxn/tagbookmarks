import axios from "axios";
import { getSession } from "next-auth/react";
import { refreshAccessToken } from "./refreshToken";
export const axiosApiInstance = axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    config.headers = {
      Authorization: `Bearer ${session?.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      // "Access-Control-Allow-Origin": "*",
    };

    // console.log("interceptor works?", session?.accessToken);
    // console.log("yup", config);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log("\nerror", error);
    const session = await getSession();
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessToken();
      // console.log("\naccess_token fn ran", { access_token });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${session?.accessToken}`;

      // console.log("\naccess_token fn ran", { access_token });
      // console.log("original request", originalRequest);
      return axiosApiInstance(originalRequest);
    }
    console.log("\nstill error");
    return Promise.reject(error);
  }
);
