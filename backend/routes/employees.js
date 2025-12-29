import express from "express";
import Employee from "../models/Employee.js";
import multer from "multer";
import bcrypt from "bcryptjs";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import authorize from "../middleware/authorize.js";

// DELETE OTP CONTROLLERS
import {
  sendEmployeeDeleteOTP,
  verifyOTPAndDeleteEmployee,
} from "../controllers/employeeDeleteController.js";

dotenv.config();

const router = express.Router();

/* ================= MULTER STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= HELPERS ================= */
const generatePassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  let pass = "";
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const generateEmployeeId = (email) => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `${email.split("@")[0]}-${date}-${Date.now()}`;
};

/* ================= FILE URL ================= */
const fileUrl = (file) => {
  if (!file) return null;
  return `/uploads/${file.filename.replace(/\\/g, "/")}`;
};

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= GET ALL EMPLOYEES ================= */
router.get("/", authorize("admin","hr"), async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

/* ================= ADD EMPLOYEE ================= */
router.post(
  "/",
  authorize("admin","hr"),
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "cancelledCheque", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "voterId", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "graduationCert", maxCount: 1 },
    { name: "technicalCert", maxCount: 1 },
    { name: "offerLetter", maxCount: 1 },
    { name: "experienceLetter", maxCount: 1 },
    { name: "salarySlips", maxCount: 1 },
    { name: "relievingLetter", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const files = req.files;

      const exists = await Employee.findOne({ email: body.email });
      if (exists) {
        return res.status(400).json({
          message: "Employee with this email already exists",
        });
      }

      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
      const employeeId = generateEmployeeId(body.email);

      const newEmployee = new Employee({
        ...body,
        profilePic: fileUrl(files.profilePic?.[0]),
        cancelledCheque: fileUrl(files.cancelledCheque?.[0]),
        aadhaar: fileUrl(files.aadhaar?.[0]),
        pan: fileUrl(files.pan?.[0]),
        voterId: fileUrl(files.voterId?.[0]),
        drivingLicense: fileUrl(files.drivingLicense?.[0]),
        marksheet10: fileUrl(files.marksheet10?.[0]),
        marksheet12: fileUrl(files.marksheet12?.[0]),
        graduationCert: fileUrl(files.graduationCert?.[0]),
        technicalCert: fileUrl(files.technicalCert?.[0]),
        offerLetter: fileUrl(files.offerLetter?.[0]),
        experienceLetter: fileUrl(files.experienceLetter?.[0]),
        salarySlips: fileUrl(files.salarySlips?.[0]),
        relievingLetter: fileUrl(files.relievingLetter?.[0]),
        password: hashedPassword,
        employeeId,
      });

      await newEmployee.save();

      await transporter.sendMail({
        from: `"HRMS Team" <${process.env.EMAIL_USER}>`,
        to: body.email,
        subject: "Your HRMS Employee Login Credentials",
        html: `
          <h2>Hello ${body.name},</h2>
          <p><b>Employee ID:</b> ${employeeId}</p>
          <p><b>Password:</b> ${password}</p>
        `,
      });

      res.json({
        message: "Employee created successfully",
        employeeId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create employee" });
    }
  }
);

/* ================= DELETE EMPLOYEE (OTP FLOW) ================= */

router.post(
  "/send-delete-otp/:id",
  authorize("admin","hr"),
  sendEmployeeDeleteOTP
);

router.post(
  "/verify-delete/:id",
  authorize("admin","hr"),
  verifyOTPAndDeleteEmployee
);

router.put("/:id", authorize("admin","hr"), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const employee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

export default router;
