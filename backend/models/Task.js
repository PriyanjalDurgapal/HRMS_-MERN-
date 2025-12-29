import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    assignedByRole: String,

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Paused",
        "Stop Requested",
        "Completed",
        "Terminated",
      ],
      default: "Pending",
    },

    estimatedHours: {
      type: Number,
      required: true,
    },

    importance: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    reportFile: String,

    // Added for time tracking
    startTime: { type: Date },
    dueDate: { type: Date },
    timeSpent: { type: Number, default: 0 }, // hours
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);