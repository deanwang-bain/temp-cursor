"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { PipelineEvent } from "@/lib/types";

const modules = [
  { href: "/market", navKey: "market" as const, descKey: "descMarket" as const, icon: "M" },
  { href: "/planning", navKey: "planning" as const, descKey: "descPlanning" as const, icon: "P" },
  { href: "/suppliers", navKey: "suppliers" as const, descKey: "descSuppliers" as const, icon: "S" },
  { href: "/mes", navKey: "mes" as const, descKey: "descMes" as const, icon: "E" },
  { href: "/quality", navKey: "quality" as const, descKey: "descQuality" as const, icon: "Q" },
  { href: "/knowledge", navKey: "knowledge" as const, descKey: "descKnowledge" as const, icon: "K" },
];

export function HomeClient({ events }: { events: PipelineEvent[] }) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.home.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t.appSubtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.href} href={m.href} className="group rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-red-300">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100 text-sm font-bold text-red-700">{m.icon}</span>
              <div>
                <div className="font-medium group-hover:text-red-700">{t.nav[m.navKey]}</div>
                <div className="text-xs text-zinc-500">{t.home[m.descKey]}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Card title={t.home.pipeline}>
        <ul className="space-y-2 text-sm">
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-2 border-b border-zinc-100 pb-2 last:border-0">
              <span className="font-mono text-xs text-zinc-400">{new Date(e.at).toLocaleTimeString()}</span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs uppercase">{e.module}</span>
              <span>{locale === "zh" ? e.messageZh : e.message}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
