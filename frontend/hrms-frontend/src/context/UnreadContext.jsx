import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import axios from "axios";

const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const socket = useSocket();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const currentUserId = localStorage.getItem("userId") || localStorage.getItem("employeeId");

  
  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get(`http://localhost:5000/api/chat/unread/${currentUserId}`)
      .then((res) => {
        setUnreadCounts(res.data);
        setTotalUnread(Object.values(res.data).reduce((a, b) => a + b, 0));
      })
      .catch((err) => console.error("Error fetching initial unread:", err));
  }, [currentUserId]);

 
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
    setTotalUnread((prev) => prev - clearedCount);
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