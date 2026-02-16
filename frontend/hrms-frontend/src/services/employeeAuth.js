import api from "../api/axios";

// Employee login
export const employeeLogin = (data) =>
  api.post("/employee-auth/login", data);

// Send OTP for forgot password
export const sendOtp = (data) =>
  api.post("/employee-auth/forgot-password", data);

// Verify OTP
export const verifyOtp = (data) =>
  api.post("/employee-auth/verify-otp", data);