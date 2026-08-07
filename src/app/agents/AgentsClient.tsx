"use client";

import Link from "next/link";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, MetricCard } from "@/components/ui";
import { DonutChart, HorizontalBarChart } from "@/components/charts";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { useI18n } from "@/lib/i18n/context";
import type { AgentRecord } from "@/lib/types";

const statusTone = (s: AgentRecord["status"]) => {
  if (s === "active" || s === "promoted") return "success" as const;
  if (s === "shadow" || s === "candidate") return "warn" as const;
  return "default" as const;
};

export function AgentsClient({ agents }: { agents: AgentRecord[] }) {
  const { t, locale } = useI18n();
  const teams = [...new Set(agents.map((a) => a.teamId))];
  const teamLabel = (teamId: string) => locale === "zh" ? ({ "team-market-intel": "市场情报团队", "team-supply-chain": "供应链团队", "team-quality": "质量团队", "team-knowledge": "知识团队" }[teamId] || teamId) : ({ "team-market-intel": "Market intelligence", "team-supply-chain": "Supply chain", "team-quality": "Quality", "team-knowledge": "Knowledge" }[teamId] || teamId);
  const statusLabel = (status: AgentRecord["status"]) => locale === "zh" ? ({ candidate: "候选", shadow: "影子", active: "运行中", promoted: "已晋升", retired: "已退役", retired_pending_review: "退役待复核" }[status]) : status.replaceAll("_", " ");
  const lifecycleLabel = (type: AgentRecord["lifecycle"][number]["type"]) => locale === "zh" ? ({ invented: "创建", promoted: "晋升", demoted: "降级", retrained: "重训", retired: "退役", incident: "事件" }[type]) : type;

  return (
    <div className="space-y-5">
      <PageHeader title={t.agents.title} subtitle={t.agents.subtitle} prefix={t.platform.layerLabel} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.agents.active} value={agents.filter((a) => a.status === "active").length} />
        <MetricCard label={t.agents.shadow} value={agents.filter((a) => a.status === "shadow").length} />
        <MetricCard label={t.agents.retired} value={agents.filter((a) => a.status === "retired").length} />
        <MetricCard label={t.agents.teams} value={teams.length} />
      </div>

      <Card title={locale === "zh" ? "智能体多维分析" : "Agent dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={agents.map((agent) => ({ team: agent.teamId, type: agent.modelType, agent: agent.id, decisions: agent.performance.decisionsLast30d }))}
          dimensions={[
            { key: "team", label: locale === "zh" ? "团队" : "Team", valueLabel: teamLabel },
            { key: "type", label: locale === "zh" ? "模型类型" : "Model type", valueLabel: (value) => t.agents[value as AgentRecord["modelType"]] },
            { key: "agent", label: locale === "zh" ? "智能体" : "Agent", valueLabel: (value) => { const agent = agents.find((item) => item.id === value); return agent ? (locale === "zh" ? agent.nameZh : agent.name) : value; } },
          ]}
          measureKey="decisions"
          measureLabel={locale === "zh" ? "近30天决策数" : "Decisions in 30 days"}
        />
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={locale === "zh" ? "智能体组合" : "Agent portfolio"}>
          <DonutChart
            centerLabel={locale === "zh" ? "智能体" : "Agents"}
            centerValue={agents.length}
            segments={[
              { label: t.agents.active, value: agents.filter((agent) => agent.status === "active" || agent.status === "promoted").length, color: "#14b8a6" },
              { label: t.agents.shadow, value: agents.filter((agent) => agent.status === "shadow" || agent.status === "candidate").length, color: "#f59e0b" },
              { label: t.agents.retired, value: agents.filter((agent) => agent.status.startsWith("retired")).length, color: "#94a3b8" },
            ]}
          />
        </Card>
        <Card title={locale === "zh" ? "采纳率与人工干预" : "Acceptance and human intervention"}>
          <HorizontalBarChart
            target={90}
            valueSuffix="%"
            rows={agents.filter((agent) => agent.status !== "retired").map((agent) => ({
              label: locale === "zh" ? agent.nameZh : agent.name,
              value: Math.round(agent.performance.acceptRate * 100),
              color: agent.performance.acceptRate >= 0.9 ? "#14b8a6" : agent.performance.acceptRate >= 0.75 ? "#f59e0b" : "#ef4444",
            }))}
          />
          <p className="mt-3 text-xs text-[var(--text-muted)]">{locale === "zh" ? "标记线为 90% 采纳率目标；明细表显示人工覆盖次数。" : "Marker is the 90% acceptance target; the table below shows human overrides."}</p>
        </Card>
      </div>

      {teams.map((teamId) => (
        <Card key={teamId} title={teamLabel(teamId)}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm agent-table">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-[var(--text-muted)]">
                  <th className="py-2 pr-3">{t.common.status}</th>
                  <th className="py-2 pr-3">{locale === "zh" ? "智能体" : "Agent"}</th>
                  <th className="py-2 pr-3">{t.agents.modelType}</th>
                  <th className="py-2 pr-3">{t.agents.autonomy}</th>
                  <th className="py-2 pr-3">{t.agents.acceptRate}</th>
                  <th className="py-2 pr-3">{t.agents.overrides}</th>
                  <th className="py-2 pr-3">{t.agents.cost}</th>
                  <th className="py-2">{t.agents.produced}</th>
                </tr>
              </thead>
              <tbody>
                {agents
                  .filter((a) => a.teamId === teamId)
                  .map((a) => (
                    <tr key={a.id} className="border-b border-[var(--border-light)]">
                      <td className="py-2 pr-3">
                        <Badge tone={statusTone(a.status)}>{statusLabel(a.status)}</Badge>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="font-medium">{locale === "zh" ? a.nameZh : a.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{locale === "zh" ? "技术配置已登记" : a.modelBacking}</div>
                        <Link href={`/${a.module === "mes" ? "mes" : a.module}`} className="text-xs text-accent">
                          {t.nav[a.module]} →
                        </Link>
                      </td>
                      <td className="py-2 pr-3">
                        <Badge tone="primary">{t.agents[a.modelType]}</Badge>
                      </td>
                      <td className="py-2 pr-3">{locale === "zh" ? `等级${a.autonomyLevel}` : `L${a.autonomyLevel}`}</td>
                      <td className="py-2 pr-3">{Math.round(a.performance.acceptRate * 100)}%</td>
                      <td className="py-2 pr-3">{a.performance.humanOverrides30d}</td>
                      <td className="py-2 pr-3">${a.performance.costUsd30d.toFixed(2)}</td>
                      <td className="py-2 text-xs">
                        {locale === "zh" ? `${a.producedRefs?.length || 0}项` : a.producedRefs?.map((r) => (
                          <span key={r.id} className="mr-2">
                            {r.type}:{r.id}
                          </span>
                        )) ?? "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Card title={t.agents.lifecycle}>
        <ul className="agent-lifecycle-list">
          {agents.flatMap((a) =>
            a.lifecycle.slice(-2).map((ev, i) => (
              <li key={`${a.id}-${i}`} className="agent-lifecycle-item">
                <Badge>{a.id}</Badge>
                <span className="agent-lifecycle-type">{lifecycleLabel(ev.type)}</span>
                <span className="agent-lifecycle-note">{locale === "zh" ? ev.noteZh : ev.note}</span>
                <span className="agent-lifecycle-at">{new Date(ev.at).toLocaleDateString()}</span>
              </li>
            )),
          )}
        </ul>
      </Card>
    </div>
  );
}
