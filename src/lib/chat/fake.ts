import { getKnowledge } from "@/lib/data";
import type { ChatBackend, ChatRequest, ChatResponse } from "./types";

function findAnswer(query: string, locale: "en" | "zh"): { answer: string; source?: string } {
  const q = query.toLowerCase();
  const articles = getKnowledge();

  const match = articles.find((a) => {
    const hay = `${a.title} ${a.content} ${a.titleZh} ${a.contentZh} ${a.tags.join(" ")}`.toLowerCase();
    return a.tags.some((tag) => q.includes(tag)) || hay.split(" ").some((w) => w.length > 3 && q.includes(w));
  });

  if (match) {
    return { answer: locale === "zh" ? match.contentZh : match.content, source: match.id };
  }

  const rules: [RegExp, string][] = [
    [/oee|可用率/, "kb-002"],
    [/changeover|换型|混线/, "kb-001"],
    [/supplier|供应商|otif/, "kb-004"],
    [/quality|hv|绝缘|质量/, "kb-003"],
    [/demand|需求|计划|aps/, "kb-005"],
  ];

  for (const [re, id] of rules) {
    if (re.test(q)) {
      const a = articles.find((x) => x.id === id);
      if (a) return { answer: locale === "zh" ? a.contentZh : a.content, source: a.id };
    }
  }

  return {
    answer:
      locale === "zh"
        ? "我是培训助手（演示模式）。请询问换型、OEE、供应商、质量或需求计划相关问题。"
        : "I am the training assistant (demo mode). Ask about changeover, OEE, suppliers, quality, or demand planning.",
  };
}

export const fakeChatBackend: ChatBackend = {
  id: "fake",
  async respond(req: ChatRequest): Promise<ChatResponse> {
    const { answer, source } = findAnswer(req.query, req.locale);
    return { answer, source, provider: "fake" };
  },
};
