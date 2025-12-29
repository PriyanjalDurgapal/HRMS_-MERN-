import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/hr",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchDashboardStats = () =>
  API.get("/dashboard-stats");
