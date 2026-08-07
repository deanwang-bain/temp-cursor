import { getKnowledge } from "@/lib/data";
import type { ChatBackend, ChatRequest, ChatResponse } from "./types";

function buildSystemPrompt(locale: "en" | "zh"): string {
  const articles = getKnowledge();
  const corpus = articles
    .map((a) => (locale === "zh" ? `# ${a.titleZh}\n${a.contentZh}` : `# ${a.title}\n${a.content}`))
    .join("\n\n");

  return locale === "zh"
    ? `你是纯电汽车混线工厂的培训助手。仅使用中文并根据以下知识库回答，简洁专业。若知识库无答案，说明不确定并建议联系班组长。\n\n${corpus}`
    : `You are a training assistant for an EV mixed-model car plant. Answer only from the knowledge base below. Be concise and professional. If unsure, say so and suggest contacting the line supervisor.\n\n${corpus}`;
}

export const openaiChatBackend: ChatBackend = {
  id: "openai",
  async respond(req: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        provider: "openai",
        answer:
          req.locale === "zh"
            ? "OpenAI 模式已选择，但未配置 OPENAI_API_KEY。请在环境变量中设置后重试，或切换回演示模式。"
            : "OpenAI mode selected but OPENAI_API_KEY is not configured. Set the env var or switch to demo mode.",
      };
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: "system", content: buildSystemPrompt(req.locale) },
          { role: "user", content: req.query },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return {
        provider: "openai",
        answer:
          req.locale === "zh"
            ? `OpenAI 请求失败 (${res.status})。请检查 API Key 或切换演示模式。\n${err.slice(0, 120)}`
            : `OpenAI request failed (${res.status}). Check API key or switch to demo mode.\n${err.slice(0, 120)}`,
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const answer = data.choices?.[0]?.message?.content?.trim() || (req.locale === "zh" ? "无回复" : "No response");

    return { answer, provider: "openai", source: "openai" };
  },
};
