// models/Payroll.js
import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: { type: String, required: true },
    year: { type: Number, required: true },

    basicSalary: { type: Number, default: 0 },

    unpaidLeaveUsed: { type: Number, default: 0 },
    unpaidLeaveAllowed: { type: Number, default: 0 },

    sandwichLeaveUsed: { type: Number, default: 0 },
    sandwichLeaveAllowed: { type: Number, default: 0 },

    autoDeductionEnabled: {
      type: Boolean,
      default: true,
    },

    leaveDeduction: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Payroll", payrollSchema);
