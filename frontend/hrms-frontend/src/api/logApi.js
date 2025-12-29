import axios from "./axios";

// Admin logs
export const fetchAdminLogs = () => axios.get("/admin/logs");

// Employee logs
export const fetchEmployeeLogs = () => axios.get("/employee/logs");