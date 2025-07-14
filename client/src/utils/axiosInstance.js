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

axiosInstance.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken)

        if(newAccessToken){
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
    const response = await axiosInstance({
      ...summaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    const accessToken = response.data.data.accessToken
    localStorage.setItem('accessToken', accessToken)
    return accessToken
  } catch (error) {
    console.log(error);
  }
};

export default axiosInstance;
