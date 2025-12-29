import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:5000/api/employee-auth",
});

// Employee login
export const employeeLogin = (data) => authAPI.post("/login", data);

// Send OTP for forgot password
export const sendOtp = (data) => authAPI.post("/forgot-password", data);

// Verify OTP
export const verifyOtp = (data) => authAPI.post("/verify-otp", data);
