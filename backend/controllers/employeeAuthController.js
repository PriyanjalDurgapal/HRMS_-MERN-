import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import logActivity from "../utils/logActivity.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//  SAME MAIL SETUP AS ADD EMPLOYEE (IMPORTANT)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const LOCK_5_MIN = 5 * 60 * 1000;

export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // OTP REQUIRED
    if (employee.otpRequired) {
      return res.status(403).json({
        message: "Account locked. Verify OTP sent to your email.",
      });
    }

    //  TEMP LOCK
    if (employee.lockUntil && employee.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Try again later.",
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    //  FAILED LOGIN
    if (!isMatch) {
      employee.loginAttempts += 1;

      //  3rd attempt → WARNING EMAIL
      if (employee.loginAttempts === 3) {
        await transporter.sendMail({
          from: `"HRMS Security" <${process.env.EMAIL_USER}>`,
          to: employee.email,
          subject: "Security Alert: Login Attempts",
          html: `
            <p>Hello ${employee.name},</p>
            <p>Someone tried to login to your HRMS account multiple times.</p>
            <p>If this wasn't you, please contact HR.</p>
          `,
        });
      }

      //  5th attempt → LOCK 5 MIN
      if (employee.loginAttempts === 5) {
        employee.lockUntil = new Date(Date.now() + LOCK_5_MIN);

        await transporter.sendMail({
          from: `"HRMS Security" <${process.env.EMAIL_USER}>`,
          to: employee.email,
          subject: "Account Temporarily Locked",
          html: `
            <p>Your HRMS account has been locked for <b>5 minutes</b>.</p>
            <p>Reason: Multiple failed login attempts.</p>
          `,
        });
      }

      //  8th attempt → OTP LOCK
      if (employee.loginAttempts >= 8) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        employee.otp = otp;
        employee.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        employee.otpRequired = true;

        await transporter.sendMail({
          from: `"HRMS Security" <${process.env.EMAIL_USER}>`,
          to: employee.email,
          subject: "OTP Required to Unlock Account",
          html: `
            <p>Your HRMS account has been locked.</p>
            <p><b>OTP:</b> ${otp}</p>
            <p>This OTP is valid for 10 minutes.</p>
          `,
        });
      }

      await employee.save();

      await logActivity({
        userId: employee._id,
        name: employee.name,
        userType: "employee",
        action: "FAILED_LOGIN",
        description: "Invalid password",
        req,
      });

      return res.status(401).json({
        message: "Invalid credentials",
        attempts: employee.loginAttempts,
      });
    }

    //  SUCCESS LOGIN → RESET EVERYTHING
    employee.loginAttempts = 0;
    employee.lockUntil = null;
    employee.otp = null;
    employee.otpExpiry = null;
    employee.otpRequired = false;
    await employee.save();

    await logActivity({
      userId: employee._id,
      name: employee.name,
      userType: "employee",
      action: "LOGIN_SUCCESS",
      description: "Employee logged in",
      req,
    });

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      id:employee._id,
      name: employee.name,
      role: employee.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};