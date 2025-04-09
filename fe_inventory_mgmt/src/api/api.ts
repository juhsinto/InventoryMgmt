import axios from "axios";
import { ACCESS_TOKEN } from "../utils/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ENDPOINT_URL,
});

// Request interceptor to add the token to the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
