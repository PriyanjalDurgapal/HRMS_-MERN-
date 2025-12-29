
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // ===== Basic Details =====
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    dateOfJoining: { type: String },
    department: { type: String },
    designation: { type: String },
    reportingManager: { type: String },
    role: { type: String, enum: ["employee", "admin" ,"hr","project_coordinator"], default: "employee" },
    employmentType: { type: String },
    experience: { type: String },
    salary: { type: Number, required: true }, 
    address: { type: String },

    // ===== Profile Pic =====
    profilePic: { type: String },

    // ===== Bank Details =====
    bankAccount: { type: String },
    ifscCode: { type: String },
    cancelledCheque: { type: String },

    // ===== Identity Documents =====
    aadhaar: { type: String },
    pan: { type: String },
    voterId: { type: String },
    drivingLicense: { type: String },

    // ===== Education Documents =====
    marksheet10: { type: String },
    marksheet12: { type: String },
    graduationCert: { type: String },
    technicalCert: { type: String },

    // ===== Previous Employment Documents =====
    offerLetter: { type: String },
    experienceLetter: { type: String },
    salarySlips: { type: String },
    relievingLetter: { type: String },

    // ===== Leave Management =====
    currentLeave: {
      type: Number,
      default: 24, 
    },
    leaveExhausted: {
      type: Number,
      default: 0,
    },
    leaveLeft: {
      type: Number,
      default: 24,
    },

    leaveBalance: {
      annual: { type: Number, default: 10 },
      medical: { type: Number, default: 5 },
      advance: { type: Number, default: 3 },     
      sandwich: { type: Number, default: 2 },    
    },
    usedLeave: {
      annual: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      advance: { type: Number, default: 0 },
      sandwich: { type: Number, default: 0 },    
    },

    // ===== Login & Auth =====
    password: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },

    // ===== Security =====
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },

    otp: { type: String },
    otpExpiry: { type: Date },
    otpRequired: { type: Boolean, default: false },


    // ===== Payroll Control =====
    autoDeductionStopped: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);