import React from "react";
import { MessageCircle } from 'lucide-react'
const ChatSidebarEmptyState = () => {
    const  title = "Ready to chat?"
  const description = "Your conversations will appear here once you start chatting with others."
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
      <div className="mb-1 text-gray-300">
           <MessageCircle size={60}/>
      </div>
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {/* Description */}
      <p className="text-sm max-w-xs">{description}</p>
    </div>
  );
};

export default ChatSidebarEmptyState;
