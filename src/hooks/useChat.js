import { useState, useEffect } from "react";
import { getTotalUnread, subscribeToConversations } from "../lib/chatService.js";

export function useChat(akun) {
  const [unreadChat, setUnreadChat] = useState(0);

  useEffect(() => {
    if (!akun) { setUnreadChat(0); return; }

    getTotalUnread(akun.id).then(setUnreadChat);

    const channel = subscribeToConversations(akun.id, async () => {
      const total = await getTotalUnread(akun.id);
      setUnreadChat(total);
    });

    return () => channel.unsubscribe();
  }, [akun]);

  return { unreadChat };
}
