// socket/socket.js

import { Server } from "socket.io";
import Chat from "../models/Chat.js";

let io;
export const onlineUsers = {}; // { userId: socketId }

export default function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("register", (userId) => {
      if (userId) {
        onlineUsers[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);

        
        io.emit("online_users", Object.keys(onlineUsers));
      }
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

        // To receiver (if online)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", chat);

          // Notify receiver for unread badge in sidebar
          io.to(receiverSocketId).emit("new_message_notification", {
            from: sender,
          });
        }

        // To sender (always, for instant UI update)
        if (senderSocketId) {
          io.to(senderSocketId).emit("receive_message", chat);
        } else {
          // Fallback: send to current socket if sender somehow not in map
          socket.emit("receive_message", chat);
        }
      } catch (err) {
        console.error("Error saving message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { sender });
      }
    });

    // Optional: stop typing (good practice)
    socket.on("stop_typing", ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop_typing", { sender });
      }
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id} (${reason})`);

      // Remove user from onlineUsers
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