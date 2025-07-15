import axios from "axios";
import summaryApi, { baseURL } from "./summaryApi";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

//Sending accessToken in headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//regenrate accessToken from refreshToken

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      console.log("Attempting to refresh with token:", refreshToken);

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken)

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        }
      }
    }
    return Promise.reject(error)
  }

);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios({
      ...summaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    const accessToken = response.data.data.accessToken

    console.log("accessToken", accessToken);


    localStorage.setItem('accessToken', accessToken)
    return accessToken
  } catch (error) {
    if (error.response) {
    console.log("Refresh failed:", error.response.data.message);
  } else {
    console.log("Refresh failed: network or server error");
  }
    return null;
  }
};

export default axiosInstance;
