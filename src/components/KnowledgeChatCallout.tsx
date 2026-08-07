"use client";

import { useMemo, useState } from "react";
import knowledgeData from "@/data/knowledge.json";
import { Badge, SegmentedControl } from "@/components/ui";
import { useChatProvider } from "@/lib/chat-context";
import { useI18n } from "@/lib/i18n/context";
import type { ChatProviderId } from "@/lib/chat/types";
import type { KnowledgeArticle } from "@/lib/types";

type ChatMessage = { role: "user" | "assistant"; text: string; provider?: ChatProviderId };
const articles = knowledgeData as KnowledgeArticle[];

export function KnowledgeChatCallout() {
  const { t, locale } = useI18n();
  const { provider, setProvider } = useChatProvider();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "knowledge">("chat");
  const [query, setQuery] = useState("");
  const [articleQuery, setArticleQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredArticles = useMemo(() => {
    const term = articleQuery.trim().toLowerCase();
    if (!term) return articles;
    return articles.filter((article) => [article.title, article.titleZh, article.category, ...article.tags].some((value) => value.toLowerCase().includes(term)));
  }, [articleQuery]);

  const send = async () => {
    const userText = query.trim();
    if (!userText || loading) return;
    setQuery("");
    setMessages((current) => [...current, { role: "user", text: userText }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, locale, provider }),
      });
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", text: data.answer, provider: data.provider }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: locale === "zh" ? "请求失败，请重试。" : "Request failed. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && <button type="button" className="knowledge-callout-backdrop" aria-label={locale === "zh" ? "关闭助手" : "Close assistant"} onClick={() => setOpen(false)} />}
      <aside className={`knowledge-callout-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="knowledge-callout-head">
          <div><h2>{t.knowledge.title}</h2><p>{locale === "zh" ? "随时获取车间知识与决策支持" : "Shop-floor knowledge and decision support, in context"}</p></div>
          <button type="button" onClick={() => setOpen(false)} aria-label={locale === "zh" ? "关闭" : "Close"}>×</button>
        </div>
        <div className="knowledge-callout-tabs">
          <button type="button" className={tab === "chat" ? "active" : ""} onClick={() => setTab("chat")}>✦ {t.knowledge.chat}</button>
          <button type="button" className={tab === "knowledge" ? "active" : ""} onClick={() => setTab("knowledge")}>▤ {t.knowledge.articles}</button>
        </div>
        {tab === "chat" ? (
          <div className="knowledge-callout-body">
            <div className="mb-2 flex justify-end">
              <SegmentedControl value={provider} options={[{ id: "fake", label: t.knowledge.providerFake }, { id: "openai", label: t.knowledge.providerOpenai }]} onChange={setProvider} />
            </div>
            <p className="mb-3 text-xs text-[var(--text-muted)]">{t.knowledge.providerHint}</p>
            <div className="callout-messages">
              {messages.length === 0 && (
                <div className="callout-empty">
                  <span>✦</span><p>{t.knowledge.chatEmpty}</p>
                  <button type="button" onClick={() => setQuery(locale === "zh" ? "综合设备效率怎么计算？" : "How is OEE calculated?")}>{locale === "zh" ? "综合设备效率怎么计算？" : "How is OEE calculated?"}</button>
                  <button type="button" onClick={() => setQuery(locale === "zh" ? "质量问题何时需要升级？" : "When should a quality issue be escalated?")}>{locale === "zh" ? "质量升级规则" : "Quality escalation rules"}</button>
                </div>
              )}
              {messages.map((message, index) => <div key={index} className={`callout-message ${message.role}`}>{message.text}{message.provider && <small>{locale === "zh" ? (message.provider === "openai" ? "智能模型" : "演示知识库") : (message.provider === "openai" ? "ChatGPT" : "Demo knowledge")}</small>}</div>)}
              {loading && <div className="callout-message assistant">{t.common.loading}</div>}
            </div>
            <div className="callout-compose">
              <textarea value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder={t.knowledge.chatPlaceholder} />
              <button type="button" onClick={send} disabled={loading || !query.trim()}>{t.knowledge.send} ↑</button>
            </div>
          </div>
        ) : (
          <div className="knowledge-callout-body">
            <input className="input-field mb-3" value={articleQuery} onChange={(event) => setArticleQuery(event.target.value)} placeholder={`${t.common.search}…`} />
            <div className="callout-articles">
              {filteredArticles.map((article) => (
                <details key={article.id}>
                  <summary><span>{locale === "zh" ? article.titleZh : article.title}</span><Badge tone="primary">{locale === "zh" ? article.categoryZh : article.category}</Badge></summary>
                  <p>{locale === "zh" ? article.contentZh : article.content}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </aside>
      <button type="button" className={`knowledge-callout-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>✦</span><span>{t.nav.knowledge}</span><i>{open ? "×" : "↑"}</i>
      </button>
    </>
  );
}
