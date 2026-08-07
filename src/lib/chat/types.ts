export type ChatProviderId = "fake" | "openai";

export type ChatRequest = {
  query: string;
  locale: "en" | "zh";
};

export type ChatResponse = {
  answer: string;
  source?: string;
  provider: ChatProviderId;
};

export interface ChatBackend {
  id: ChatProviderId;
  respond(req: ChatRequest): Promise<ChatResponse>;
}
