"use client";

import Link from "next/link";
import { PageHeader } from "@/components/BrandLogo";
import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { PipelineEvent } from "@/lib/types";

const modules = [
  { href: "/market", navKey: "market" as const, descKey: "descMarket" as const, color: "bg-blue-50 text-blue-700" },
  { href: "/planning", navKey: "planning" as const, descKey: "descPlanning" as const, color: "bg-violet-50 text-violet-700" },
  { href: "/suppliers", navKey: "suppliers" as const, descKey: "descSuppliers" as const, color: "bg-orange-50 text-orange-700" },
  { href: "/mes", navKey: "mes" as const, descKey: "descMes" as const, color: "bg-cyan-50 text-cyan-700" },
  { href: "/quality", navKey: "quality" as const, descKey: "descQuality" as const, color: "bg-amber-50 text-amber-800" },
  { href: "/knowledge", navKey: "knowledge" as const, descKey: "descKnowledge" as const, color: "bg-emerald-50 text-emerald-700" },
];

export function HomeClient({ events }: { events: PipelineEvent[] }) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-5">
      <PageHeader title={t.home.title} subtitle={t.appSubtitle} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex items-start gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)]"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${m.color}`}>
              {t.nav[m.navKey].charAt(0)}
            </span>
            <div className="min-w-0">
              <div className="font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)]">
                {t.nav[m.navKey]}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">{t.home[m.descKey]}</div>
            </div>
          </Link>
        ))}
      </div>

      <Card title={t.home.pipeline}>
        <ul className="space-y-2 text-sm">
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-2 border-b border-[var(--border-light)] py-2 last:border-0">
              <span className="font-mono text-xs text-[var(--text-muted)]">{new Date(e.at).toLocaleTimeString()}</span>
              <span className="rounded bg-[var(--primary-light)] px-1.5 py-0.5 text-xs font-medium uppercase text-[var(--primary)]">
                {e.module}
              </span>
              <span className="text-[var(--text-secondary)]">{locale === "zh" ? e.messageZh : e.message}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
