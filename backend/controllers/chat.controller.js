import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

const identity = (req) => ({
  id: req.user.id,
  model: req.user.isEmployee ? "Employee" : "User",
  role: req.user.role
});

export const sendMessage = async (req, res) => {
  const msg = await Message.create({
    chatId: req.body.chatId,
    sender: identity(req),
    content: req.body.content,
    fileUrl: req.file ? "/" + req.file.path : null,
    fileType: req.file?.mimetype
  });

  await Chat.findByIdAndUpdate(req.body.chatId, {
    lastMessage: msg._id
  });

  res.json(msg);
};

export const editMessage = async (req, res) => {
  const msg = await Message.findById(req.body.messageId);
  msg.content = req.body.content;
  msg.isEdited = true;
  await msg.save();
  res.json(msg);
};

export const deleteMessage = async (req, res) => {
  const msg = await Message.findById(req.body.messageId);
  msg.isDeleted = true;
  msg.content = "Message deleted";
  await msg.save();
  res.json({ success: true });
};

export const markRead = async (req, res) => {
  await Message.updateMany(
    { chatId: req.body.chatId, "readBy.id": { $ne: req.user.id } },
    { $push: { readBy: identity(req) } }
  );
  res.json({ success: true });
};
