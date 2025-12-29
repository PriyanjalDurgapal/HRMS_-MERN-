// controllers/employeeDeleteController.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Employee from "../models/Employee.js";
import FormerEmployee from "../models/FormerEmployee.js";
import AdminDeleteOTP from "../models/AdminDeleteOTP.js";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // IMPORTANT: Use App Password if 2FA is enabled!
  },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


export const sendEmployeeDeleteOTP = async (req, res) => {
  try {
    const { id } = req.params;
    // const adminEmail = req.user.email; // Assuming auth middleware sets req.user
const adminEmail = "durgapalpriyanjal@gmail.com";
    // Find employee
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const otp = generateOTP();

    // Save/Update OTP (valid for 5 minutes)
    await AdminDeleteOTP.findOneAndUpdate(
      { adminEmail, employeeId: id },
      {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      },
      { upsert: true, new: true }
    );

    // Send email using the reliable transporter
    await transporter.sendMail({
      from: `"HRMS Team" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: "HRMS – Employee Deletion OTP Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f8f9fa; border-radius: 12px; text-align: center;">
          <h2 style="color: #343a40;">Employee Deletion Request</h2>
          <p style="font-size: 16px; color: #495057;">
            Hello Admin,
          </p>
          <p style="font-size: 16px; color: #495057;">
            You requested to delete the following employee:
          </p>
          <p style="font-size: 18px; font-weight: bold; color: #dc3545;">
            ${employee.name || "Employee"} (${employee.email})
          </p>
          <p style="font-size: 16px; color: #495057;">
            Your One-Time Password (OTP) is:
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
          <small style="color: #adb5bd;">HRMS Automated Security System</small>
        </div>
      `,
    });

    return res.status(200).json({ message: "OTP sent to admin email successfully" });
  } catch (error) {
    console.error("sendEmployeeDeleteOTP error:", error.message || error);
    return res.status(500).json({ message: "Failed to send OTP. Please try again later." });
  }
};

/**
 * STEP 2: Verify OTP and Delete Employee
 */
export const verifyOTPAndDeleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;
    // const adminEmail = req.user.email;
    const adminEmail = "durgapalpriyanjal@gmail.com";

    // Validate input
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find OTP record
    const otpRecord = await AdminDeleteOTP.findOne({
      adminEmail,
      employeeId: id,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await AdminDeleteOTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Find employee
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Archive employee to FormerEmployee collection
    await FormerEmployee.create({
      originalEmployeeId: employee._id,
      deletedBy: adminEmail,
      employeeSnapshot: employee.toObject(),
      deletedAt: new Date(),
    });

    // Delete from active employees
    await Employee.findByIdAndDelete(id);

    // Clean up OTP
    await AdminDeleteOTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: "Employee deleted and archived successfully",
    });
  } catch (error) {
    console.error("verifyOTPAndDeleteEmployee error:", error.message || error);
    return res.status(500).json({ message: "Failed to delete employee. Please try again later." });
  }
};