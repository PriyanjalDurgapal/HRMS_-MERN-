import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
