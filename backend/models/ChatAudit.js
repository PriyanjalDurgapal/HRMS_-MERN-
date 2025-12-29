import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  action: String,
  performedBy: Object,
  chatId: mongoose.Schema.Types.ObjectId,
  messageId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

export default mongoose.model("ChatAudit", auditSchema);
