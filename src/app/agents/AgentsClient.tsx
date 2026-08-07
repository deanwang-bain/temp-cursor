"use client";

import Link from "next/link";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, MetricCard } from "@/components/ui";
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

  return (
    <div className="space-y-5">
      <PageHeader title={t.agents.title} subtitle={t.agents.subtitle} prefix={t.platform.layerLabel} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.agents.active} value={agents.filter((a) => a.status === "active").length} />
        <MetricCard label={t.agents.shadow} value={agents.filter((a) => a.status === "shadow").length} />
        <MetricCard label={t.agents.retired} value={agents.filter((a) => a.status === "retired").length} />
        <MetricCard label={t.agents.teams} value={teams.length} />
      </div>

      {teams.map((teamId) => (
        <Card key={teamId} title={teamId}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm agent-table">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-[var(--text-muted)]">
                  <th className="py-2 pr-3">{t.common.status}</th>
                  <th className="py-2 pr-3">Agent</th>
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
                        <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="font-medium">{locale === "zh" ? a.nameZh : a.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{a.modelBacking}</div>
                        <Link href={`/${a.module === "mes" ? "mes" : a.module}`} className="text-xs text-accent">
                          {t.nav[a.module]} →
                        </Link>
                      </td>
                      <td className="py-2 pr-3">
                        <Badge tone="primary">{t.agents[a.modelType]}</Badge>
                      </td>
                      <td className="py-2 pr-3">L{a.autonomyLevel}</td>
                      <td className="py-2 pr-3">{Math.round(a.performance.acceptRate * 100)}%</td>
                      <td className="py-2 pr-3">{a.performance.humanOverrides30d}</td>
                      <td className="py-2 pr-3">${a.performance.costUsd30d.toFixed(2)}</td>
                      <td className="py-2 text-xs">
                        {a.producedRefs?.map((r) => (
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
                <span className="agent-lifecycle-type">{ev.type}</span>
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
