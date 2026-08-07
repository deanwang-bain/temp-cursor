"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ChatProviderId } from "@/lib/chat/types";

type ChatContextValue = {
  provider: ChatProviderId;
  setProvider: (p: ChatProviderId) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);
const STORAGE_KEY = "ev-demo-chat-provider";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [provider, setProviderState] = useState<ChatProviderId>("fake");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ChatProviderId | null;
    if (saved === "fake" || saved === "openai") setProviderState(saved);
  }, []);

  const setProvider = (p: ChatProviderId) => {
    setProviderState(p);
    localStorage.setItem(STORAGE_KEY, p);
  };

  return <ChatContext.Provider value={{ provider, setProvider }}>{children}</ChatContext.Provider>;
}

export function useChatProvider() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatProvider must be used within ChatProvider");
  return ctx;
}
