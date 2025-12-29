import axios from "axios";
import { getToken } from "../util/auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auto-attach token to every request
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin APIs
export const getAvailableEmployees = () => API.get("/tasks/available-employees");
export const getEmployeeAttendanceStatus = () => API.get("/tasks/employee-attendance-status");
export const assignTask = (data) => API.post("/tasks/assign", data);
export const getAllAssignedTasks = () => API.get("/tasks/all"); // ← Admin sees all tasks

// Task actions (Admin)
export const terminateTask = (id) => API.patch(`/tasks/${id}/terminate`);
export const updateTaskDescription = (id, description) =>
  API.patch(`/tasks/${id}`, { description });
export const extendTask = (id, additionalHours) =>
  API.patch(`/tasks/${id}/extend`, { additionalHours });
export const togglePauseTask = (id) => API.patch(`/tasks/${id}/pause`);

// Employee APIs (if needed elsewhere)
export const getMyTasks = () => API.get("/tasks/my");
export const uploadTaskReport = (taskId, file) => {
  const formData = new FormData();
  formData.append("report", file);
  return API.post(`/tasks/${taskId}/report`, formData);
};
export const requestStopTask = (id) => API.patch(`/tasks/${id}/request-stop`);