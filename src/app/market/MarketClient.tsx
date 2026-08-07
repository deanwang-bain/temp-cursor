"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/BrandLogo";
import { AiBadge } from "@/components/AiBadge";
import { Badge, Card } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
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
  const [selectedModel, setSelectedModel] = useState("nova-suv");

  const w33 = useMemo(() => demand.filter((d) => d.week === "2026-W33"), [demand]);
  const weeks = useMemo(() => [...new Set(demand.map((d) => d.week))], [demand]);
  const modelTrend = useMemo(() => weeks.map((week) => demand.find((d) => d.week === week && d.modelId === selectedModel)), [demand, selectedModel, weeks]);
  const forecastStart = Math.max(0, weeks.findIndex((week) => demand.some((row) => row.week === week && row.isForecast)) - 1);
  const regionByModel: Record<string, string> = { "nova-suv": "china", "pulse-sedan": "china", "spark-hatch": "urban", "ridge-cross": "export", "apex-coupe": "premium" };
  const regionLabels: Record<string, string> = locale === "zh"
    ? { china: "国内市场", urban: "城市市场", export: "出口市场", premium: "高端市场" }
    : { china: "Domestic", urban: "Urban", export: "Export", premium: "Premium" };
  const sentimentLabel = (sentiment: NewsArticle["sentiment"]) => locale === "zh" ? ({ positive: "正面", neutral: "中性", negative: "负面" }[sentiment]) : sentiment;
  const sourceLabel = (source: string) => locale === "zh" ? ({ Reuters: "路透社", Bloomberg: "彭博社", Caixin: "财新", "Industry Week": "工业周刊", "Local media": "本地媒体" }[source] || source) : source;
  const messageStatus = (status: MarketingMessage["status"]) => locale === "zh" ? ({ draft: "草稿", approved: "已批准", live: "已发布" }[status]) : status;

  const processNews = () => {
    setNews((prev) => prev.map((n) => ({ ...n, processed: true })));
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t.market.title} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.market.newsFeed}>
          <button type="button" onClick={processNews} className="btn-primary mb-3">
            {t.market.process}
          </button>
          <ul className="space-y-3">
            {news.map((n) => (
              <li key={n.id} className="rounded-md border border-zinc-100 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={n.sentiment === "positive" ? "success" : n.sentiment === "negative" ? "danger" : "default"}>{sentimentLabel(n.sentiment)}</Badge>
                  <span className="text-xs text-zinc-400">{sourceLabel(n.source)}</span>
                  {!n.processed && <Badge tone="warn">{locale === "zh" ? "新建" : "New"}</Badge>}
                  {n.processed && <Badge tone="success">{locale === "zh" ? "本体" : "Ontology"}</Badge>}
                </div>
                <p className="mt-1 font-medium">{locale === "zh" ? n.titleZh : n.title}</p>
                <p className="text-zinc-600">{locale === "zh" ? n.summaryZh : n.summary}</p>
                <p className="mt-1 text-xs text-zinc-400">{n.entities.length} {t.market.entities}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t.market.ontology}>
          <p className="mb-2 text-xs text-[var(--text-muted)]">
            <a href="/ontology" className="text-accent">
              {t.ontology.title} →
            </a>
          </p>
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
        <div className="mb-5 grid gap-4 xl:grid-cols-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {locale === "zh" ? "需求历史与预测" : "Demand history and forecast"}
              </h3>
              <select className="input-field !min-h-9 !w-auto" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                {w33.map((d) => <option key={d.modelId} value={d.modelId}>{getModelName(d.modelId, locale)}</option>)}
              </select>
            </div>
            <LineChart
              labels={weeks.map((week) => locale === "zh" ? `第${week.split("W")[1]}周` : week.replace("2026-", ""))}
              series={[
                { label: t.market.baseline, values: modelTrend.map((d) => d?.baseline || 0), color: "#94a3b8", forecastFromIndex: forecastStart },
                { label: t.market.adjusted, values: modelTrend.map((d) => d?.adjusted || 0), color: "#3370ff", forecastFromIndex: forecastStart },
              ]}
              forecastLabel={locale === "zh" ? "预测" : "Forecast"}
            />
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {locale === "zh" ? "第33周车型组合" : "W33 model mix"}
            </h3>
            <BarChart
              labels={w33.map((d) => getModelName(d.modelId, locale).split(" ")[0])}
              series={[
                { label: t.market.baseline, values: w33.map((d) => d.baseline), color: "#94a3b8" },
                { label: t.market.adjusted, values: w33.map((d) => d.adjusted), color: "#3370ff" },
              ]}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-zinc-500">
                <th className="py-2">{locale === "zh" ? "车型" : "Model"}</th>
                <th>{t.market.baseline}</th>
                <th>{t.market.adjusted}</th>
                <th>Δ</th>
                <th>{locale === "zh" ? "信号" : "Signal"}</th>
              </tr>
            </thead>
            <tbody>
              {w33.map((d) => {
                const delta = d.adjusted - d.baseline;
                return (
                  <tr key={d.modelId} className="border-b border-zinc-50">
                    <td className="py-2 font-medium">{getModelName(d.modelId, locale)}</td>
                    <td>{d.baseline}</td>
                    <td className="font-semibold text-[var(--primary)]">
                      {d.adjusted}{" "}
                      <AiBadge rationale={d.aiRationale} rationaleZh={d.aiRationaleZh} confidence={d.confidence} />
                    </td>
                    <td className={delta >= 0 ? "text-emerald-600" : "text-red-600"}>{delta >= 0 ? "+" : ""}{delta}</td>
                    <td className="text-zinc-600">{locale === "zh" ? d.signalZh : d.signal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={locale === "zh" ? "需求多维分析" : "Demand dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={demand.filter((row) => !row.isForecast).map((row) => ({ region: regionByModel[row.modelId], model: row.modelId, week: row.week.replace("2026-", ""), demand: row.adjusted }))}
          dimensions={[
            { key: "region", label: locale === "zh" ? "市场区域" : "Market region", valueLabel: (value) => regionLabels[value] || value },
            { key: "model", label: locale === "zh" ? "车型" : "Model", valueLabel: (value) => getModelName(value, locale) },
            { key: "week", label: locale === "zh" ? "周" : "Week", valueLabel: (value) => locale === "zh" ? `第${value.slice(1)}周` : value },
          ]}
          measureKey="demand"
          measureLabel={locale === "zh" ? "调整后需求" : "Adjusted demand"}
        />
      </Card>

      <Card title={t.market.marketing}>
        <ul className="space-y-2 text-sm">
          {marketing.map((m) => (
            <li key={m.id} className="rounded border border-zinc-100 p-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{locale === "zh" ? m.channelZh || m.channel : m.channel}</Badge>
                <Badge tone={m.status === "live" ? "success" : m.status === "approved" ? "warn" : "default"}>{messageStatus(m.status)}</Badge>
                <AiBadge rationale={m.aiRationale} rationaleZh={m.aiRationaleZh} confidence={m.confidence} />
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
