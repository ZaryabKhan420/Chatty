import React, { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore.js";
import {
  ChatHeader,
  MessageInput,
  MessageSkeleton,
} from "../components/index.js";
import useAuthStrore from "../store/useAuthStore.js";
import { formatTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    isMessagesLoading,
    getMessages,
    subscribeToMessages,
    unSubscribeFromMessages,
  } = useChatStore();
  const { user } = useAuthStrore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unSubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unSubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />

        <MessageSkeleton />

        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === selectedUser._id
                  ? "chat-start"
                  : "chat-end"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === user._id
                        ? user.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
