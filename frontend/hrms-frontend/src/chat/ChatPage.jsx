

import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar"; 
import ChatWindow from "./ChatWindow";  

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with user list */}
      <ChatSidebar 
        setSelectedUser={setSelectedUser} 
        
      />
      
      {/* Main chat window */}
      <ChatWindow 
        selectedUser={selectedUser}
       
      />
    </div>
  );
}