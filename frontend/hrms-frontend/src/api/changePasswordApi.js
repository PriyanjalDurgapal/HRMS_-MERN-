import api from "./axios";

export const sendChangePasswordOTP = (email) =>
  api.post("/change-password/send-otp", { email });

export const verifyOTPAndChangePassword = (data) =>
  api.post("/change-password/verify-otp", data);