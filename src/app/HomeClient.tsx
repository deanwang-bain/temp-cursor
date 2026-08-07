"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { PlatformRevealPanel } from "@/components/PlatformRevealPanel";
import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import { usePlatformLayer } from "@/lib/platform-layer-context";
import type { PlatformStats } from "@/lib/platform-stats";
import type { PipelineEvent } from "@/lib/types";

const STEPS = [
  { href: "/market", icon: "📈", navKey: "market" as const, descKey: "descMarket" as const, step: 1 },
  { href: "/planning", icon: "📅", navKey: "planning" as const, descKey: "descPlanning" as const, step: 2, parallel: true },
  { href: "/suppliers", icon: "🏭", navKey: "suppliers" as const, descKey: "descSuppliers" as const, step: 3, parallel: true },
  { href: "/mes", icon: "⚙️", navKey: "mes" as const, descKey: "descMes" as const, step: 4 },
  { href: "/quality", icon: "✅", navKey: "quality" as const, descKey: "descQuality" as const, step: 5 },
  { href: "/knowledge", icon: "💬", navKey: "knowledge" as const, descKey: "descKnowledge" as const, step: 6 },
];

const ADVANTAGES = [
  { key: "advantage1" as const, icon: "✨", platformHref: null },
  { key: "advantage2" as const, icon: "◈", platformHref: "/ontology" as const },
  { key: "advantage3" as const, icon: "◫", platformHref: "/agents" as const },
  { key: "advantage4" as const, icon: "▤", platformHref: "/ops" as const },
];

export function HomeClient({ events, stats }: { events: PipelineEvent[]; stats: PlatformStats }) {
  const { t, locale } = useI18n();
  const { revealed, reveal } = usePlatformLayer();

  const market = STEPS[0];
  const parallel = STEPS.filter((s) => s.parallel);
  const downstream = STEPS.filter((s) => !s.parallel && s.step > 1);

  const handleHeroReveal = () => reveal();

  return (
    <div className="cover-page">
      <section className="cover-hero">
        <div
          className="cover-hero-inner"
          onDoubleClick={handleHeroReveal}
          role="presentation"
        >
          <BrandLogo />
          <h1 className="cover-title">{t.home.coverTitle}</h1>
          <p className="cover-subtitle">{t.home.coverSubtitle}</p>
          <div className="cover-badges">
            <span className="badge badge-blue">
              {STEPS.length} {t.home.modules}
            </span>
            <span className="badge badge-green">E2E</span>
            <span className="badge badge-amber">{t.home.triggerNote}</span>
          </div>
          <button type="button" className="cover-platform-toggle" onClick={handleHeroReveal}>
            ⧉ {t.home.viewPlatform}
          </button>
          <p className="cover-double-click-hint">{t.home.doubleClickHint}</p>
        </div>
      </section>

      {revealed && <PlatformRevealPanel stats={stats} />}

      <Card title={t.home.advantagesTitle}>
        <div className="advantages-grid">
          {ADVANTAGES.map((a) => {
            const title = t.home[`${a.key}Title`];
            const desc = t.home[`${a.key}Desc`];
            const inner = (
              <>
                <span className="advantage-icon" aria-hidden>
                  {a.icon}
                </span>
                <span className="advantage-title">{title}</span>
                <span className="advantage-desc">{desc}</span>
                {a.platformHref && (
                  <span className="advantage-cta">
                    {t.home.enterApp} →
                  </span>
                )}
              </>
            );
            return a.platformHref ? (
              <Link key={a.key} href={a.platformHref} className="advantage-card advantage-card-link">
                {inner}
              </Link>
            ) : (
              <div key={a.key} className="advantage-card">
                {inner}
              </div>
            );
          })}
        </div>
      </Card>

      <Card title={t.home.coverCta} className="cover-flow-card">
        <p className="cover-flow-hint">{t.home.triggerNote}</p>

        <div className="cover-flow">
          <div className="cover-flow-row">
            <Link href={market.href} className="cover-step cover-step-primary">
              <span className="cover-step-num">
                {t.home.stepLabel} {market.step}
              </span>
              <span className="cover-step-icon" aria-hidden>
                {market.icon}
              </span>
              <span className="cover-step-title">{t.nav[market.navKey]}</span>
              <span className="cover-step-desc">{t.home[market.descKey]}</span>
              <span className="cover-step-action">{t.home.enterApp} →</span>
            </Link>
          </div>

          <div className="cover-flow-connector" aria-hidden />

          <div className="cover-flow-row cover-flow-parallel">
            {parallel.map((step) => (
              <Link key={step.href} href={step.href} className="cover-step">
                <span className="cover-step-num">
                  {t.home.stepLabel} {step.step}
                </span>
                <span className="cover-step-icon" aria-hidden>
                  {step.icon}
                </span>
                <span className="cover-step-title">{t.nav[step.navKey]}</span>
                <span className="cover-step-desc">{t.home[step.descKey]}</span>
                <span className="cover-step-action">{t.home.enterApp} →</span>
              </Link>
            ))}
          </div>

          <div className="cover-flow-connector" aria-hidden />

          <div className="cover-flow-row cover-flow-downstream">
            {downstream.map((step, i) => (
              <div key={step.href} className="cover-downstream-item">
                {i > 0 && <span className="cover-flow-connector-h" aria-hidden />}
                <Link href={step.href} className="cover-step cover-step-compact">
                  <span className="cover-step-num">
                    {t.home.stepLabel} {step.step}
                  </span>
                  <span className="cover-step-icon" aria-hidden>
                    {step.icon}
                  </span>
                  <span className="cover-step-title">{t.nav[step.navKey]}</span>
                  <span className="cover-step-desc">{t.home[step.descKey]}</span>
                  <span className="cover-step-action">{t.home.enterApp} →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title={t.home.modules}>
        <div className="module-grid">
          {STEPS.map((step) => (
            <Link key={step.href} href={step.href} className="module-card">
              <span className="module-icon" aria-hidden>
                {step.icon}
              </span>
              <span className="module-title">
                {t.home.stepLabel} {step.step}: {t.nav[step.navKey]}
              </span>
              <span className="module-desc">{t.home[step.descKey]}</span>
            </Link>
          ))}
        </div>
      </Card>

      <Card title={t.home.pipeline}>
        <ul className="pipeline-list">
          {events.map((e) => (
            <li key={e.id}>
              <span className="pipeline-time">{new Date(e.at).toLocaleTimeString()}</span>
              <span className="badge badge-blue">{e.module}</span>
              {e.agentId && <span className="badge badge-green">{e.agentId}</span>}
              <span className="pipeline-detail">{locale === "zh" ? e.messageZh : e.message}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
