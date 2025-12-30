import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const sendResetOtp = (data) =>
  axios.post(`${API}/send-change-password-otp`, data);

export const resetPassword = (data) =>
  axios.post(`${API}/verify-otp-change-password`, data);
