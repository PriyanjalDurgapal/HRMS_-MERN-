import api from "./axios";

export const fetchAdminLogs = () => api.get("/admin/logs");
export const fetchEmployeeLogs = () => api.get("/employee/logs");