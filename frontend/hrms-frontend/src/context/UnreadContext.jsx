import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import api from "../api/axios";

const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const socket = useSocket();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const currentUserId =
    localStorage.getItem("userId") ||
    localStorage.getItem("employeeId");

  // Fetch initial unread counts
  useEffect(() => {
    if (!currentUserId) return;

    api
      .get(`/chat/unread/${currentUserId}`) 
      .then((res) => {
        const data = res.data || {};
        setUnreadCounts(data);
        setTotalUnread(
          Object.values(data).reduce((a, b) => a + Number(b || 0), 0)
        );
      })
      .catch((err) =>
        console.error("Error fetching initial unread:", err)
      );
  }, [currentUserId]);

  // Listen for new message notifications
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleNewNotification = ({ from }) => {
      if (currentChatUser === from) return;

      setUnreadCounts((prev) => ({
        ...prev,
        [from]: (prev[from] || 0) + 1,
      }));

      setTotalUnread((prev) => prev + 1);
    };

    socket.on("new_message_notification", handleNewNotification);

    return () => {
      socket.off("new_message_notification", handleNewNotification);
    };
  }, [socket, currentChatUser, currentUserId]);

  const resetUnread = (userId) => {
    const clearedCount = unreadCounts[userId] || 0;

    setUnreadCounts((prev) => {
      const newCounts = { ...prev };
      delete newCounts[userId];
      return newCounts;
    });

    setTotalUnread((prev) => Math.max(prev - clearedCount, 0)); 
  };

  return (
    <UnreadContext.Provider
      value={{ unreadCounts, totalUnread, resetUnread, setCurrentChatUser }}
    >
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnread = () => useContext(UnreadContext);