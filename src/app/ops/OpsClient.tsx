"use client";

import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, MetricCard } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { getAgentById } from "@/lib/data";
import { useI18n } from "@/lib/i18n/context";
import type { OpsHistoryPoint, OpsMetrics } from "@/lib/types";

const alarmTone = (s: string) => {
  if (s === "critical") return "danger" as const;
  if (s === "warn") return "warn" as const;
  return "default" as const;
};

export function OpsClient({ ops, history }: { ops: OpsMetrics; history: OpsHistoryPoint[] }) {
  const { t, locale } = useI18n();
  const forecastStart = Math.max(0, history.findIndex((point) => point.isForecast) - 1);
  const severityLabel = (severity: string) => locale === "zh" ? ({ info: "信息", warn: "警告", critical: "严重" }[severity] || severity) : severity;
  const moduleLabel = (module: string) => {
    const nav = t.nav as Record<string, string>;
    return nav[module] || module;
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t.ops.title} subtitle={t.ops.subtitle} prefix={t.platform.layerLabel} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.ops.gpuUtil} value={`${ops.compute.gpuUtilPercent}%`} sub={locale === "zh" ? `${ops.compute.gpuCount}个图形处理器` : `${ops.compute.gpuCount} GPU`} />
        <MetricCard
          label={t.ops.today}
          value={locale === "zh" ? `${ops.tokenUsage.todayCostUsd.toFixed(2)}美元` : `$${ops.tokenUsage.todayCostUsd.toFixed(2)}`}
          sub={locale === "zh" ? `${((ops.tokenUsage.todayPromptTokens + ops.tokenUsage.todayCompletionTokens) / 1000).toFixed(0)}千词元` : `${((ops.tokenUsage.todayPromptTokens + ops.tokenUsage.todayCompletionTokens) / 1000).toFixed(0)}k tokens`}
        />
        <MetricCard label={t.ops.pendingReviews} value={ops.humanInTheLoop.pendingReviews} alert={ops.humanInTheLoop.pendingReviews > 0} />
        <MetricCard
          label={t.ops.openAlarms}
          value={ops.alarms.filter((a) => !a.resolvedAt).length}
          alert={ops.alarms.some((a) => !a.resolvedAt && a.severity === "critical")}
        />
      </div>

      <Card title={locale === "zh" ? "成本多维分析" : "Cost dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={ops.tokenUsage.byAgent.map((row) => { const agent = getAgentById(row.agentId); return { module: agent?.module || "unknown", type: agent?.modelType || "unknown", agent: row.agentId, cost: row.costUsd }; })}
          dimensions={[
            { key: "module", label: locale === "zh" ? "业务模块" : "Business module", valueLabel: moduleLabel },
            { key: "type", label: locale === "zh" ? "模型类型" : "Model type", valueLabel: (value) => value === "unknown" ? (locale === "zh" ? "未知" : "Unknown") : t.agents[value as "traditional_ml" | "llm" | "hybrid" | "rules"] },
            { key: "agent", label: locale === "zh" ? "智能体" : "Agent", valueLabel: (value) => { const agent = getAgentById(value); return agent ? (locale === "zh" ? agent.nameZh : agent.name) : value; } },
          ]}
          measureKey="cost"
          measureLabel={locale === "zh" ? "成本" : "Cost"}
          valueSuffix={locale === "zh" ? " 美元" : " USD"}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.ops.compute}>
          <ul className="ops-kv-list">
            <li><span>{t.ops.gpuUtil}</span><strong>{ops.compute.gpuUtilPercent}%</strong></li>
            <li><span>{t.ops.cpuUtil}</span><strong>{ops.compute.cpuUtilPercent}%</strong></li>
            <li><span>{t.ops.queueDepth}</span><strong>{ops.compute.queueDepth}</strong></li>
            <li><span>{t.ops.p95Latency}</span><strong>{ops.compute.p95LatencyMs} {locale === "zh" ? "毫秒" : "ms"}</strong></li>
          </ul>
        </Card>

        <Card title={t.ops.tokens}>
          <BarChart
            labels={ops.tokenUsage.byAgent.map((row) => { const agent = getAgentById(row.agentId); return agent ? (locale === "zh" ? agent.nameZh : agent.name) : row.agentId; })}
            series={[{ label: locale === "zh" ? "成本（美元）" : "Cost (USD)", values: ops.tokenUsage.byAgent.map((row) => row.costUsd), color: "#8b5cf6" }]}
            height={220}
          />
          <ul className="ops-kv-list">
            <li><span>{t.ops.mtdCost}</span><strong>{locale === "zh" ? `${ops.tokenUsage.mtdCostUsd.toFixed(2)}美元` : `$${ops.tokenUsage.mtdCostUsd.toFixed(2)}`}</strong></li>
            {ops.tokenUsage.byAgent.map((row) => {
              const agent = getAgentById(row.agentId);
              return (
                <li key={row.agentId}>
                  <span>{agent ? (locale === "zh" ? agent.nameZh : agent.name) : row.agentId}</span>
                  <strong>{locale === "zh" ? `${row.costUsd.toFixed(2)}美元 · ${(row.tokens / 1000).toFixed(0)}千词元` : `$${row.costUsd.toFixed(2)} · ${(row.tokens / 1000).toFixed(0)}k tokens`}</strong>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card title={t.ops.humanLoop}>
        <ul className="ops-kv-list">
          <li><span>{t.ops.approvedToday}</span><strong>{ops.humanInTheLoop.approvedToday}</strong></li>
          <li><span>{t.ops.rejectedToday}</span><strong>{ops.humanInTheLoop.rejectedToday}</strong></li>
          <li><span>{t.ops.avgReview}</span><strong>{ops.humanInTheLoop.avgReviewSeconds}{locale === "zh" ? "秒" : "s"}</strong></li>
        </ul>
      </Card>

      <Card title={t.ops.alarms}>
        <ul className="ops-alarm-list">
          {ops.alarms.map((a) => (
            <li key={a.id} className={`ops-alarm-item ${a.resolvedAt ? "ops-alarm-resolved" : ""}`}>
              <Badge tone={alarmTone(a.severity)}>{severityLabel(a.severity)}</Badge>
              <span className="ops-alarm-title">{locale === "zh" ? a.titleZh : a.title}</span>
              <span className="ops-alarm-detail">{locale === "zh" ? a.detailZh : a.detail}</span>
              {a.agentId && <Badge tone="primary">{a.agentId}</Badge>}
              {a.resolvedAt && (
                <span className="ops-alarm-resolved-tag">
                  {t.ops.resolved} ({locale === "zh" ? (a.resolvedBy === "human" ? "人工" : "自动") : a.resolvedBy})
                </span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t.ops.trend}>
        <div className="grid gap-5 xl:grid-cols-2">
          <LineChart labels={history.map((point) => point.date.slice(5))} series={[
            { label: t.ops.gpuUtil, values: history.map((point) => point.gpuUtilPercent), color: "#3370ff", forecastFromIndex: forecastStart },
          ]} valueSuffix="%" forecastLabel={locale === "zh" ? "预测" : "Forecast"} />
          <LineChart labels={history.map((point) => point.date.slice(5))} series={[
            { label: locale === "zh" ? "词元成本" : "Token cost", values: history.map((point) => point.tokenCostUsd), color: "#8b5cf6", forecastFromIndex: forecastStart },
            { label: t.agents.overrides, values: history.map((point) => point.humanOverrides), color: "#f59e0b", forecastFromIndex: forecastStart },
          ]} forecastLabel={locale === "zh" ? "预测" : "Forecast"} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-[var(--text-muted)]">
                <th className="py-2">{locale === "zh" ? "日期" : "Date"}</th>
                <th className="py-2">{t.ops.gpuUtil}</th>
                <th className="py-2">{t.ops.tokens}</th>
                <th className="py-2">{t.agents.overrides}</th>
                <th className="py-2">{t.ops.alarms}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.date} className="border-b border-[var(--border-light)]">
                  <td className="py-2">{h.date}</td>
                  <td className="py-2">{h.gpuUtilPercent}%</td>
                  <td className="py-2">{locale === "zh" ? `${h.tokenCostUsd.toFixed(2)}美元` : `$${h.tokenCostUsd.toFixed(2)}`}</td>
                  <td className="py-2">{h.humanOverrides}</td>
                  <td className="py-2">{h.alarmCount} {h.isForecast && <Badge tone="primary">{locale === "zh" ? "预测" : "Forecast"}</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
