import React, { useEffect,useRef } from 'react';
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages = [], getMessages, isMessageLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  const messagesEndRef = useRef(null);

useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);


  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 text-lg">
        Select a user to start chatting
      </div>
    );
  }

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

 // console.log(messages)

  const capitalizeName = (name) => {
    return typeof name === 'string'
      ? name.replace(/\b\w/g, (char) => char.toUpperCase())
      : '';
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => {
            if (!message || !message.senderId) return null;
            
            console.log(message.text);
            

            const isSender = message.senderId === authUser?._id;

            return (
              <div
                key={message._id}
                className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                
              >
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border-2 border-emerald-400 shadow-md">
                    <img
                      src={
                        isSender
                          ? authUser?.profilePic || "/avatar.png"
                          : selectedUser?.profilePic || "/avatar.png"
                      }
                      alt="profile"
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Header */}
                <div className="chat-header mb-1 flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-600">
                    {isSender ? "You" : capitalizeName(selectedUser?.fullname)}
                  </span>
                  <time className="text-xs text-gray-400">
                    {message.createdAt ? formatMessageTime(message.createdAt) : ""}
                  </time>
                </div>

                {/* Bubble */}
                <div
                  className={`chat-bubble flex flex-col p-3 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md shadow-md ${
                    isSender
                      ? "bg-gradient-to-br from-emerald-900 to-green-950 text-white"
                      : "bg-gradient-to-br from-teal-700 to-teal-900 text-white"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-lg mb-2 max-h-60 object-cover border-none border-white shadow-sm"
                    />
                  )}
                  {message.text && (
                    <p className="whitespace-pre-wrap break-words leading-relaxed tracking-wide">
                      {message.text}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-zinc-400 mt-4">No messages yet.</div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
