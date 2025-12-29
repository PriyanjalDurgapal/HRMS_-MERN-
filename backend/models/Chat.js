// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  
  seen: { type: Boolean, default: false },
  
  isEdited: { type: Boolean, default: false },    
  isDeleted: { type: Boolean, default: false },   

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);