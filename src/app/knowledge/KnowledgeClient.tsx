"use client";

import { useState } from "react";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, SegmentedControl } from "@/components/ui";
import { useChatProvider } from "@/lib/chat-context";
import { useI18n } from "@/lib/i18n/context";
import type { KnowledgeArticle } from "@/lib/types";
import type { ChatProviderId } from "@/lib/chat/types";

type ChatMsg = { role: "user" | "assistant"; text: string; provider?: ChatProviderId };

export function KnowledgeClient({ articles }: { articles: KnowledgeArticle[] }) {
  const { t, locale } = useI18n();
  const { provider, setProvider } = useChatProvider();
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
        body: JSON.stringify({ query: userText, locale, provider }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer, provider: data.provider },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: locale === "zh" ? "请求失败，请重试。" : "Request failed. Please retry.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t.knowledge.title} />

      <div className="grid gap-4 xl:grid-cols-5">
        <Card title={t.knowledge.articles} className="xl:col-span-2">
          <ul className="max-h-[480px] space-y-2 overflow-y-auto text-sm">
            {articles.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-[var(--border-light)] p-3 hover:border-[var(--primary-light)] hover:bg-[var(--primary-muted)]/30"
              >
                <div className="font-medium text-[var(--text-primary)]">
                  {locale === "zh" ? a.titleZh : a.title}
                </div>
                <Badge tone="primary">{locale === "zh" ? a.categoryZh : a.category}</Badge>
                <p className="mt-2 text-[var(--text-secondary)] line-clamp-3">
                  {locale === "zh" ? a.contentZh : a.content}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={t.knowledge.chat}
          className="xl:col-span-3"
          action={
            <SegmentedControl
              value={provider}
              options={[
                { id: "fake", label: t.knowledge.providerFake },
                { id: "openai", label: t.knowledge.providerOpenai },
              ]}
              onChange={setProvider}
            />
          }
        >
          <p className="mb-3 text-xs text-[var(--text-muted)]">{t.knowledge.providerHint}</p>

          <div className="mb-3 flex h-[360px] flex-col gap-2 overflow-y-auto rounded-lg border border-[var(--border-light)] bg-[var(--bg-base)] p-3 text-sm">
            {messages.length === 0 && (
              <p className="text-[var(--text-muted)]">{t.knowledge.chatEmpty}</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--primary)] text-white"
                    : "mr-auto border border-[var(--border-light)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                }`}
              >
                {m.text}
                {m.role === "assistant" && m.provider && (
                  <div className="mt-1 text-[10px] opacity-60">
                    {m.provider === "openai" ? "ChatGPT" : "Demo"}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-[var(--text-muted)]">{t.common.loading}</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={t.knowledge.chatPlaceholder}
              className="input-field flex-1"
            />
            <button type="button" onClick={send} disabled={loading} className="btn-primary shrink-0">
              {t.knowledge.send}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
