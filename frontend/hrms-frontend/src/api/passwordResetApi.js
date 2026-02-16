import api from "./axios";

export const sendResetOtp = (data) =>
  api.post("/auth/send-change-password-otp", data);

export const resetPassword = (data) =>
  api.post("/auth/verify-otp-change-password", data);