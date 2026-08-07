"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import type { PlatformStats } from "@/lib/platform-stats";

export function PlatformRevealPanel({ stats }: { stats: PlatformStats }) {
  const { t, locale } = useI18n();

  const cards = [
    {
      href: "/ontology",
      title: t.nav.ontology,
      desc: t.platform.ontologyBlurb,
      stat: `${stats.ontologyEntities} ${t.ontology.entities} · ${stats.ontologyLayers} ${t.ontology.layers}`,
    },
    {
      href: "/agents",
      title: t.nav.agents,
      desc: t.platform.agentsBlurb,
      stat: `${stats.activeAgents} ${t.agents.active} · ${stats.shadowAgents} ${t.agents.shadow}`,
    },
    {
      href: "/ops",
      title: t.nav.ops,
      desc: t.platform.opsBlurb,
      stat: `${locale === "zh" ? `${stats.todayCostUsd.toFixed(2)}美元` : `$${stats.todayCostUsd.toFixed(2)}`} ${t.ops.today} · ${stats.openAlarms} ${t.ops.openAlarms}`,
    },
  ];

  return (
    <section className="platform-reveal" aria-label={t.platform.underneath}>
      <h2 className="platform-reveal-title">{t.platform.underneath}</h2>
      <p className="platform-reveal-sub">{t.platform.underneathSub}</p>
      <div className="platform-reveal-grid">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="platform-reveal-card">
            <span className="platform-reveal-card-title">{c.title}</span>
            <span className="platform-reveal-card-stat">{c.stat}</span>
            <span className="platform-reveal-card-desc">{c.desc}</span>
            <span className="platform-reveal-card-cta">{t.home.enterApp} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
