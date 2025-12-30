import express from "express";
import {
  sendChangePasswordOTP,
  verifyOTPAndChangePassword,
} from "../controllers/changePasswordController.js";

const router = express.Router();

router.post("/send-change-password-otp", sendChangePasswordOTP);
router.post("/verify-otp-change-password", verifyOTPAndChangePassword);

export default router;
