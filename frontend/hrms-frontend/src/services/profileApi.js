import axios from "axios";
import { getToken } from "../util/auth.js"; 

const API = axios.create({
  baseURL: "http://localhost:5000/api/profile",
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const fetchMyProfile = () => API.get("/me");
export const updateProfileField = (data) => API.put("/me", data);
