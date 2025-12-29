import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const markAttendance = (data) =>
  API.post("/attendance/mark", data);

export const adminAttendance = () =>
  API.get("/attendance/admin");

export const hrAttendance = () =>
  API.get("/attendance/hr");
