// controllers/changePasswordController.js
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import PasswordResetOTP from "../models/PasswordResetOTP.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const sendChangePasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const employee = await Employee.findOne({ email: normalizedEmail });

    if (!employee) {
      return res.status(404).json({
        message: "Email not registered with any employee",
      });
    }

    const otp = generateOTP();

    // Save or update OTP (valid for 5 minutes)
    await PasswordResetOTP.findOneAndUpdate(
      { email: normalizedEmail },
      {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      },
      { upsert: true, new: true }
    );

    //  Send email using the SAME working transporter
    await transporter.sendMail({
      from: `"HRMS Team" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "HRMS - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f8f9fa; border-radius: 12px; text-align: center;">
          <h2 style="color: #343a40;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #495057;">
            Hello <strong>${employee.name || "Employee"}</strong>,
          </p>
          <p style="font-size: 16px; color: #495057;">
            Your One-Time Password (OTP) to reset your HRMS password is:
          </p>
          <h1 style="font-size: 48px; letter-spacing: 12px; color: #007bff; background: white; padding: 20px; border-radius: 10px; display: inline-block; margin: 20px 0;">
            ${otp}
          </h1>
          <p style="font-size: 16px; color: #495057;">
            This OTP is valid for <strong>5 minutes only</strong>.
          </p>
          <p style="font-size: 14px; color: #868e96;">
            If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          <small style="color: #adb5bd;">This is an automated message. Do not reply.</small>
        </div>
      `,
    });

    // console.log(`OTP sent to ${normalizedEmail}: ${otp}`);
    console.log(`OTP sent to ${normalizedEmail} successfully`);

    return res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("sendChangePasswordOTP error:", error.message || error);
    return res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

/**
 * VERIFY OTP AND CHANGE PASSWORD
 */
export const verifyOTPAndChangePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await PasswordResetOTP.findOne({
      email: normalizedEmail,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await PasswordResetOTP.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updated = await Employee.findOneAndUpdate(
      { email: normalizedEmail },
      { password: hashedPassword },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Clean up OTP
    await PasswordResetOTP.deleteOne({ email: normalizedEmail });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("verifyOTPAndChangePassword error:", error.message || error);
    return res.status(500).json({
      message: "Failed to change password. Please try again later.",
    });
  }
};