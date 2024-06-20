import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://api.toreca-japan.com/',
  //baseURL: 'http://localhost:8080/',
  responseType: 'json',
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});
