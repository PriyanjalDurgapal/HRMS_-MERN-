// socket/socket.js

import { Server } from "socket.io";
import Chat from "../models/Chat.js";

let io;
export const onlineUsers = {}; // { userId: socketId }

export default function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        process.env.FRONTEND_URL, //  production frontend
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("register", (userId) => {
      if (!userId) return;

      //  Prevent duplicate mapping
      onlineUsers[userId] = socket.id;

      console.log(`User ${userId} registered with socket ${socket.id}`);

      io.emit("online_users", Object.keys(onlineUsers));
    });

    socket.on("send_message", async (data) => {
      const { sender, receiver, content } = data;

      if (!sender || !receiver || !content?.trim()) {
        return socket.emit("error", { message: "Invalid message data" });
      }

      try {
        const chat = await Chat.create({
          sender,
          receiver,
          content: content.trim(),
          seen: false,
        });

        const senderSocketId = onlineUsers[sender];
        const receiverSocketId = onlineUsers[receiver];

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", chat);
          io.to(receiverSocketId).emit("new_message_notification", {
            from: sender,
          });
        }

        if (senderSocketId) {
          io.to(senderSocketId).emit("receive_message", chat);
        } else {
          socket.emit("receive_message", chat);
        }
      } catch (err) {
        console.error("Error saving message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing", ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { sender });
      }
    });

    socket.on("stop_typing", ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop_typing", { sender });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id} (${reason})`);

      let disconnectedUserId = null;

      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          disconnectedUserId = userId;
          delete onlineUsers[userId];
          break;
        }
      }

      if (disconnectedUserId) {
        console.log(`User ${disconnectedUserId} is now offline`);
        io.emit("online_users", Object.keys(onlineUsers));
      }
    });
  });

  return io;
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};