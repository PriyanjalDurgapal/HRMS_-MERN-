import express from "express";
import Employee from "../models/Employee.js";
import User from "../models/User.js"; 
import Chat from "../models/Chat.js";
import { getIO, onlineUsers } from "../socket/socket.js";

const router = express.Router();


router.get("/employees/:currentUserId", async (req, res) => {
  try {
    const { currentUserId } = req.params;

    // Check if user is Admin
    const admin = await User.findById(currentUserId);
    let users = [];

    if (admin) {
      // Admin sees everyone except himself
      const employees = await Employee.find(
        { _id: { $ne: currentUserId } },
        "name role profilePic"
      );
      users = employees;
    } else {
      // Employee / HR / Project Coordinator
      const currentEmployee = await Employee.findById(currentUserId);
      if (!currentEmployee) return res.json([]);

      if (["hr", "projectcoordinator"].includes(currentEmployee.role)) {
        // HR / PC see Admin + Employees
        const employees = await Employee.find(
          { _id: { $ne: currentUserId } },
          "name role profilePic"
        );
        const admins = await User.find({}, "name role");
        users = [...admins, ...employees];
      } else {
        // Normal Employee
        const employees = await Employee.find(
          { _id: { $ne: currentUserId } },
          "name role profilePic"
        );
        const admins = await User.find({}, "name role");
        users = [...admins, ...employees];
      }
    }

    // ────────────── NEW: Add last message preview for each user ──────────────
    const usersWithPreview = await Promise.all(
      users.map(async (user) => {
        const lastMsg = await Chat.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1);

        const preview = lastMsg
          ? {
              content:
                lastMsg.content.substring(0, 100) +
                (lastMsg.content.length > 100 ? "..." : ""),
              isFromMe: lastMsg.sender === currentUserId,
              isSeen: lastMsg.seen,
              timestamp: lastMsg.createdAt,
            }
          : null;

        return {
          ...user.toObject(),
          lastMessagePreview: preview,
        };
      })
    );

    res.json(usersWithPreview);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/history/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Chat history error:", err.message);
    res.status(500).json({ error: "Failed to load chat history" });
  }
});


router.post("/seen", async (req, res) => {
  const { sender, receiver } = req.body;

  try {
    const result = await Chat.updateMany(
      { sender, receiver, seen: false },
      { $set: { seen: true } }
    );

  
    const io = getIO();
    if (onlineUsers[sender]) {
      io.to(onlineUsers[sender]).emit("messages_seen", { receiver });
    }

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Seen update error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/message/edit", async (req, res) => {
  try {
    const { messageId, content } = req.body;

    const message = await Chat.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    message.content = content;
    message.isEdited = true;
    await message.save();

    const io = getIO();
    io.to(onlineUsers[message.sender]).emit("message_edited", message);
    io.to(onlineUsers[message.receiver]).emit("message_edited", message);

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/message/delete", async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Chat.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    message.isDeleted = true;
    message.content = "This message was deleted";
    await message.save();

    const io = getIO();
    io.to(onlineUsers[message.sender]).emit("message_deleted", message);
    io.to(onlineUsers[message.receiver]).emit("message_deleted", message);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/unread/:receiver", async (req, res) => {
  try {
    const counts = await Chat.aggregate([
      { $match: { receiver: req.params.receiver, seen: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);
    const unreadMap = {};
    counts.forEach((c) => {
      unreadMap[c._id] = c.count;
    });
    res.json(unreadMap);
  } catch (err) {
    console.error("Unread counts error:", err.message);
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
});

export default router;