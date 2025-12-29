// models/LeaveRequest.js
import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Annual Leave", "Medical Leave", "Advance Leave"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    managerComment: String,
  },
  { timestamps: true }
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);