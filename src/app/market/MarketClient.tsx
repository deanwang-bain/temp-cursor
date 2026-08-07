"use client";

import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/ui";
import { getModelName } from "@/lib/data";
import { useI18n } from "@/lib/i18n/context";
import type { DemandForecast, MarketingMessage, NewsArticle, OntologyEntity } from "@/lib/types";

export function MarketClient({
  news: initialNews,
  ontology,
  demand,
  marketing,
}: {
  news: NewsArticle[];
  ontology: OntologyEntity[];
  demand: DemandForecast[];
  marketing: MarketingMessage[];
}) {
  const { t, locale } = useI18n();
  const [news, setNews] = useState(initialNews);

  const w33 = useMemo(() => demand.filter((d) => d.week === "2026-W33"), [demand]);

  const processNews = () => {
    setNews((prev) => prev.map((n) => ({ ...n, processed: true })));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.market.title}</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.market.newsFeed}>
          <button type="button" onClick={processNews} className="mb-3 min-h-11 rounded-md bg-red-600 px-4 text-sm text-white hover:bg-red-700">
            {t.market.process}
          </button>
          <ul className="space-y-3">
            {news.map((n) => (
              <li key={n.id} className="rounded-md border border-zinc-100 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={n.sentiment === "positive" ? "success" : n.sentiment === "negative" ? "danger" : "default"}>{n.sentiment}</Badge>
                  <span className="text-xs text-zinc-400">{n.source}</span>
                  {!n.processed && <Badge tone="warn">new</Badge>}
                  {n.processed && <Badge tone="success">ontology</Badge>}
                </div>
                <p className="mt-1 font-medium">{locale === "zh" ? n.titleZh : n.title}</p>
                <p className="text-zinc-600">{locale === "zh" ? n.summaryZh : n.summary}</p>
                <p className="mt-1 text-xs text-zinc-400">{n.entities.length} {t.market.entities}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t.market.ontology}>
          <ul className="space-y-2 text-sm">
            {ontology.map((o) => (
              <li key={o.id} className="rounded border border-zinc-100 p-2">
                <div className="font-medium">{locale === "zh" ? o.labelZh : o.label}</div>
                <div className="text-xs uppercase text-zinc-400">{o.type}</div>
                {o.relations.map((r, i) => (
                  <div key={i} className="mt-1 text-xs text-zinc-500">
                    {locale === "zh" ? r.relationZh : r.relation} → {r.targetId}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title={t.market.demand}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-zinc-500">
                <th className="py-2">Model</th>
                <th>{t.market.baseline}</th>
                <th>{t.market.adjusted}</th>
                <th>Δ</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              {w33.map((d) => {
                const delta = d.adjusted - d.baseline;
                return (
                  <tr key={d.modelId} className="border-b border-zinc-50">
                    <td className="py-2 font-medium">{getModelName(d.modelId, locale)}</td>
                    <td>{d.baseline}</td>
                    <td className="font-semibold text-red-700">{d.adjusted}</td>
                    <td className={delta >= 0 ? "text-emerald-600" : "text-red-600"}>{delta >= 0 ? "+" : ""}{delta}</td>
                    <td className="text-zinc-600">{locale === "zh" ? d.signalZh : d.signal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t.market.marketing}>
        <ul className="space-y-2 text-sm">
          {marketing.map((m) => (
            <li key={m.id} className="rounded border border-zinc-100 p-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{m.channel}</Badge>
                <Badge tone={m.status === "live" ? "success" : m.status === "approved" ? "warn" : "default"}>{m.status}</Badge>
                <span className="text-xs text-zinc-400">{getModelName(m.modelId, locale)}</span>
              </div>
              <p className="mt-1">{locale === "zh" ? m.messageZh : m.message}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
