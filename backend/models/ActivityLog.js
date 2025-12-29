import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name:{
        type:String,
        required:true,
    },
    userType: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
    },
    action: {
      type: String, // LOGIN_SUCCESS, FAILED_LOGIN, LOGOUT
      required: true,
    },
    description: String,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);