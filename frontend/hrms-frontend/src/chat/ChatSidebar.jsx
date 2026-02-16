// src/components/ChatSidebar.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import { useUnread } from "../context/UnreadContext";

export default function ChatSidebar({ setSelectedUser }) {
  const socket = useSocket();
  const { unreadCounts, resetUnread } = useUnread();

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUserId =
    localStorage.getItem("userId") || localStorage.getItem("employeeId");

  // Fetch users
  useEffect(() => {
    if (!currentUserId) return;
   api
  .get(`/chat/employees/${currentUserId}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUserId]);

  // Online status
  useEffect(() => {
    if (!socket) return;
    socket.on("online_users", setOnlineUsers);
    return () => socket.off("online_users");
  }, [socket]);

  const handleSelectUser = (user) => {
    resetUnread(user._id);
    setSelectedUser(user);
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-5 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>

      {/* User List */}
      <ul className="divide-y divide-gray-100">
        {users.length === 0 ? (
          <li className="px-5 py-8 text-center text-gray-500">
            No users available
          </li>
        ) : (
          users.map((user) => {
            const hasUnread = unreadCounts[user._id] > 0;
            const preview = user.lastMessagePreview;

            return (
              <li
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`px-5 py-4 cursor-pointer transition-colors
                  ${
                    hasUnread
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {isOnline(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className={`font-medium truncate ${
                          hasUnread ? "text-gray-900" : "text-gray-800"
                        }`}
                      >
                        {user.name}
                      </h3>

                      {/* Unread Badge */}
                      {hasUnread && (
                        <span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full px-2.5 py-0.5 min-w-[20px] text-center">
                          {unreadCounts[user._id] > 99
                            ? "99+"
                            : unreadCounts[user._id]}
                        </span>
                      )}
                    </div>

                    {/* Role & Online Status */}
                    <p className="text-xs text-gray-500 mt-0.5">
                      {user.role} •{" "}
                      <span
                        className={
                          isOnline(user._id) ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {isOnline(user._id) ? "Online" : "Offline"}
                      </span>
                    </p>

                    {/* Last Message Preview */}
                    {preview && (
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-1">
                        {preview.isFromMe && (
                          <span className="font-medium text-gray-800">You: </span>
                        )}
                        {preview.content}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}