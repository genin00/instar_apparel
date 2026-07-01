import { createContext, useContext } from "react";
import { useChat } from "../hooks/useChat.js";

const ChatContext = createContext({ unreadChat: 0 });

export function ChatProvider({ akun, children }) {
  const chat = useChat(akun);
  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
