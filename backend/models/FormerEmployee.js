import mongoose from "mongoose";

const formerEmployeeSchema = new mongoose.Schema(
  {
    originalEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    deletedBy: {
      type: String, // admin email
      required: true,
    },

    deletedAt: {
      type: Date,
      default: Date.now,
    },

    employeeSnapshot: {
      type: Object, // full employee data
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FormerEmployee", formerEmployeeSchema);
