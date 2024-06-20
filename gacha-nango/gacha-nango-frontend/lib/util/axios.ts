import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://api.jpn-toreka.com',
  responseType: 'json',
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

///'https://konome-388409.an.r.appspot.com',