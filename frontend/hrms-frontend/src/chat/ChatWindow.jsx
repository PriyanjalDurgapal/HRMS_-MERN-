// src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useUnread } from "../context/UnreadContext";
import axios from "axios";
import { BsCheck2, BsCheck2All } from "react-icons/bs";

export default function ChatWindow({ selectedUser }) {
  const socket = useSocket();
  const { setCurrentChatUser } = useUnread();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("employeeId") ||
    localStorage.getItem("id");

  const messagesEndRef = useRef(null);

  // Register user
  useEffect(() => {
    if (socket && userId) socket.emit("register", userId);
  }, [socket, userId]);

  // Track current chat for unread logic
  useEffect(() => {
    if (selectedUser) setCurrentChatUser(selectedUser._id);
    return () => setCurrentChatUser(null);
  }, [selectedUser, setCurrentChatUser]);

  // Load chat history
  useEffect(() => {
    if (!selectedUser || !userId) {
      setMessages([]);
      return;
    }
    axios
      .get(`http://localhost:5000/api/chat/history/${userId}/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Load history error:", err));
  }, [selectedUser, userId]);

  // Mark messages as seen when chat opens
  useEffect(() => {
    if (!selectedUser || !userId) return;
    axios.post("http://localhost:5000/api/chat/seen", {
      sender: selectedUser._id,
      receiver: userId,
    });
  }, [selectedUser, userId]);

  // Real-time socket events
  useEffect(() => {
    if (!socket || !selectedUser || !userId) return;

    const handleReceiveMessage = (msg) => {
      if (
        (msg.sender === userId && msg.receiver === selectedUser._id) ||
        (msg.sender === selectedUser._id && msg.receiver === userId)
      ) {
        setMessages((prev) => [...prev, msg]);

        // Auto-mark incoming messages as seen
        if (msg.sender === selectedUser._id) {
          axios.post("http://localhost:5000/api/chat/seen", {
            sender: selectedUser._id,
            receiver: userId,
          });
        }
      }
    };

    const handleTyping = ({ sender }) => {
      if (sender === selectedUser._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1500);
      }
    };

    const handleMessagesSeen = ({ receiver }) => {
      if (receiver === selectedUser._id) {
        setMessages((prev) =>
          prev.map((m) => (m.sender === userId ? { ...m, seen: true } : m))
        );
      }
    };

    const handleMessageEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    const handleMessageDeleted = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("message_edited", handleMessageEdited);
    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("messages_seen");
      socket.off("message_edited");
      socket.off("message_deleted");
    };
  }, [socket, selectedUser, userId]);

  // Edit & Delete
  const handleEdit = (message) => {
    const newContent = prompt("Edit your message:", message.content);
    if (!newContent || newContent.trim() === message.content) return;
    axios.put("http://localhost:5000/api/chat/message/edit", {
      messageId: message._id,
      content: newContent.trim(),
    });
  };

  const handleDelete = (messageId) => {
    if (!confirm("Delete this message?")) return;
    axios.put("http://localhost:5000/api/chat/message/delete", { messageId });
  };

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !selectedUser || !socket || !userId) return;

    const msgData = {
      sender: userId,
      receiver: selectedUser._id,
      content: input.trim(),
    };

    socket.emit("send_message", msgData);

    // Optimistic UI: show 1 gray tick immediately
    const optimisticMsg = {
      ...msgData,
      _id: Date.now().toString(),
      seen: false,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim() && selectedUser) {
      socket.emit("typing", { sender: userId, receiver: selectedUser._id });
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
        <p className="text-sm text-gray-600 capitalize">{selectedUser.role}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === userId;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg._id || index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} group relative`}
            >
              <div
                className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm
                  ${isOwn ? "bg-green-900 text-white" : "bg-white text-gray-800 border border-gray-200"}
                `}
              >
                {msg.isDeleted ? (
                  <p className="italic opacity-70">This message was deleted</p>
                ) : (
                  <>
                    <p className="break-words">{msg.content}</p>
                    {msg.isEdited && (
                      <span className="text-xs opacity-70 block mt-1">edited</span>
                    )}
                  </>
                )}

                {/* Timestamp + Ticks */}
                <div className="flex items-center justify-end gap-2 mt-1 text-xs opacity-70">
                  <span>{time}</span>
                  {isOwn && !msg.isDeleted && (
                    <>
                      {msg.seen ? (
                        <BsCheck2All size={17} className="text-sky-300" /> // Blue double tick
                      ) : (
                        <BsCheck2 size={17} className="text-gray-300" /> // Single gray tick
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Edit/Delete Menu */}
              {isOwn && !msg.isDeleted && (
                <div className="absolute top-0 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => handleEdit(msg)}
                    className="block w-full text-left px-6 py-2 text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="block w-full text-left px-6 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 italic">Typing...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}