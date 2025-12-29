
import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =============== ATTACH JWT TOKEN ================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= EMPLOYEE / HR ================= */

export const applyLeave = (data) => API.post("/leaves/apply", data);
export const myLeaves = () => API.get("/leaves/my");

// HR (employee auth)
export const hrAllLeaves = () => API.get("/leaves/all");
export const hrUpdateLeave = (id, data) =>
  API.patch(`/leaves/${id}`, data);

/* ================= ADMIN ================= */

export const adminAllLeaves = () => API.get("/leaves/admin/all");
export const adminUpdateLeave = (id, data) =>
  API.patch(`/leaves/admin/${id}`, data);

export default API;

