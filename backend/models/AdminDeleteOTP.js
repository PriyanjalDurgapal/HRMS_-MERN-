import mongoose from "mongoose";

const adminDeleteOTPSchema = new mongoose.Schema(
  {
    adminEmail: { type: String, required: true },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AdminDeleteOTP", adminDeleteOTPSchema);
