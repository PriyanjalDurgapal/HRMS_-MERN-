import mongoose from "mongoose";

const identity = {
  id: mongoose.Schema.Types.ObjectId,
  model: String,
  role: String,
};

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  sender: identity,
  content: String,
  fileUrl: String,
  fileType: String,
  readBy: [identity],
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
