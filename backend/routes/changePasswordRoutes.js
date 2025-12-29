// routes/changePasswordRoutes.js
import express from "express";
import {
  sendChangePasswordOTP,
  verifyOTPAndChangePassword,
} from "../controllers/changePasswordController.js";

const router = express.Router();

router.post("/send-otp", sendChangePasswordOTP);
router.post("/verify-otp", verifyOTPAndChangePassword);

export default router;