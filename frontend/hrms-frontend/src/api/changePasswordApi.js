import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/change-password",
});

export const sendChangePasswordOTP = (email) =>
  API.post("/send-otp", { email });

export const verifyOTPAndChangePassword = (data) =>
  API.post("/verify-otp", data);
