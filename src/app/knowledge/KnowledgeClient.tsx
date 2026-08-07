"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { KnowledgeArticle } from "@/lib/types";

type ChatMsg = { role: "user" | "assistant"; text: string };

export function KnowledgeClient({ articles }: { articles: KnowledgeArticle[] }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!query.trim()) return;
    const userText = query.trim();
    setQuery("");
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, locale }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: locale === "zh" ? "请求失败，请重试。" : "Request failed. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.knowledge.title}</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.knowledge.articles}>
          <ul className="max-h-96 space-y-3 overflow-y-auto text-sm">
            {articles.map((a) => (
              <li key={a.id} className="rounded border border-zinc-100 p-3">
                <div className="font-medium">{locale === "zh" ? a.titleZh : a.title}</div>
                <div className="text-xs text-zinc-400">{locale === "zh" ? a.categoryZh : a.category}</div>
                <p className="mt-1 text-zinc-600">{locale === "zh" ? a.contentZh : a.content}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t.knowledge.chat}>
          <div className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded border border-zinc-100 bg-zinc-50 p-2 text-sm">
            {messages.length === 0 && (
              <p className="text-zinc-400">{locale === "zh" ? "试试：OEE 怎么算？换型需要多久？" : "Try: How is OEE calculated? How long is changeover?"}</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`rounded p-2 ${m.role === "user" ? "ml-8 bg-white" : "mr-8 bg-red-50"}`}>
                {m.text}
              </div>
            ))}
            {loading && <p className="text-zinc-400">{t.common.loading}</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.knowledge.chatPlaceholder}
              className="min-h-11 flex-1 rounded border border-zinc-300 px-3 text-sm"
            />
            <button type="button" onClick={send} disabled={loading} className="min-h-11 rounded-md bg-red-600 px-4 text-sm text-white hover:bg-red-700 disabled:opacity-50">
              {t.knowledge.send}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
