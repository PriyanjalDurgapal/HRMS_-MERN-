// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    secretCode: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Absent",
        "Present",
        "Present (Late)",
        "Half Day",
      ],
      default: "Absent",
    },

    markedAt: Date,

 
    halfDayRequested: {
      type: Boolean,
      default: false,
    },
    halfDayApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
