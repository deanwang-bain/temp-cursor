import { fakeChatBackend } from "./fake";
import { openaiChatBackend } from "./openai";
import type { ChatBackend, ChatProviderId, ChatRequest, ChatResponse } from "./types";

const backends: Record<ChatProviderId, ChatBackend> = {
  fake: fakeChatBackend,
  openai: openaiChatBackend,
};

export function getChatBackend(provider: ChatProviderId): ChatBackend {
  return backends[provider] ?? fakeChatBackend;
}

export async function chatRespond(provider: ChatProviderId, req: ChatRequest): Promise<ChatResponse> {
  return getChatBackend(provider).respond(req);
}

export type { ChatProviderId, ChatRequest, ChatResponse };
