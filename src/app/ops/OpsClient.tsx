"use client";

import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, MetricCard } from "@/components/ui";
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

  return (
    <div className="space-y-5">
      <PageHeader title={t.ops.title} subtitle={t.ops.subtitle} prefix={t.platform.layerLabel} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.ops.gpuUtil} value={`${ops.compute.gpuUtilPercent}%`} sub={`${ops.compute.gpuCount} GPU`} />
        <MetricCard
          label={t.ops.today}
          value={`$${ops.tokenUsage.todayCostUsd.toFixed(2)}`}
          sub={`${((ops.tokenUsage.todayPromptTokens + ops.tokenUsage.todayCompletionTokens) / 1000).toFixed(0)}k tokens`}
        />
        <MetricCard label={t.ops.pendingReviews} value={ops.humanInTheLoop.pendingReviews} alert={ops.humanInTheLoop.pendingReviews > 0} />
        <MetricCard
          label={t.ops.openAlarms}
          value={ops.alarms.filter((a) => !a.resolvedAt).length}
          alert={ops.alarms.some((a) => !a.resolvedAt && a.severity === "critical")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.ops.compute}>
          <ul className="ops-kv-list">
            <li><span>{t.ops.gpuUtil}</span><strong>{ops.compute.gpuUtilPercent}%</strong></li>
            <li><span>{t.ops.cpuUtil}</span><strong>{ops.compute.cpuUtilPercent}%</strong></li>
            <li><span>{t.ops.queueDepth}</span><strong>{ops.compute.queueDepth}</strong></li>
            <li><span>{t.ops.p95Latency}</span><strong>{ops.compute.p95LatencyMs} ms</strong></li>
          </ul>
        </Card>

        <Card title={t.ops.tokens}>
          <ul className="ops-kv-list">
            <li><span>{t.ops.mtdCost}</span><strong>${ops.tokenUsage.mtdCostUsd.toFixed(2)}</strong></li>
            {ops.tokenUsage.byAgent.map((row) => {
              const agent = getAgentById(row.agentId);
              return (
                <li key={row.agentId}>
                  <span>{agent ? (locale === "zh" ? agent.nameZh : agent.name) : row.agentId}</span>
                  <strong>${row.costUsd.toFixed(2)} · {(row.tokens / 1000).toFixed(0)}k</strong>
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
          <li><span>{t.ops.avgReview}</span><strong>{ops.humanInTheLoop.avgReviewSeconds}s</strong></li>
        </ul>
      </Card>

      <Card title={t.ops.alarms}>
        <ul className="ops-alarm-list">
          {ops.alarms.map((a) => (
            <li key={a.id} className={`ops-alarm-item ${a.resolvedAt ? "ops-alarm-resolved" : ""}`}>
              <Badge tone={alarmTone(a.severity)}>{a.severity}</Badge>
              <span className="ops-alarm-title">{locale === "zh" ? a.titleZh : a.title}</span>
              <span className="ops-alarm-detail">{locale === "zh" ? a.detailZh : a.detail}</span>
              {a.agentId && <Badge tone="primary">{a.agentId}</Badge>}
              {a.resolvedAt && (
                <span className="ops-alarm-resolved-tag">
                  {t.ops.resolved} ({a.resolvedBy})
                </span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t.ops.trend}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-[var(--text-muted)]">
                <th className="py-2">Date</th>
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
                  <td className="py-2">${h.tokenCostUsd.toFixed(2)}</td>
                  <td className="py-2">{h.humanOverrides}</td>
                  <td className="py-2">{h.alarmCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
