"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { KnowledgeChatCallout } from "@/components/KnowledgeChatCallout";
import { OpsStatusDot } from "@/components/OpsStatusDot";
import { useI18n } from "@/lib/i18n/context";
import { usePlatformLayer } from "@/lib/platform-layer-context";

const navItems = [
  { href: "/", key: "home" as const, icon: "⌂" },
  { href: "/market", key: "market" as const, icon: "◉" },
  { href: "/planning", key: "planning" as const, icon: "▦" },
  { href: "/suppliers", key: "suppliers" as const, icon: "◎" },
  { href: "/mes", key: "mes" as const, icon: "▣" },
  { href: "/quality", key: "quality" as const, icon: "◈" },
];

const platformNavItems = [
  { href: "/ontology", key: "ontology" as const, icon: "◈" },
  { href: "/agents", key: "agents" as const, icon: "◫" },
  { href: "/ops", key: "ops" as const, icon: "▤" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, locale, toggleLocale } = useI18n();
  const { revealed, toggle: togglePlatform } = usePlatformLayer();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPlatformRoute = platformNavItems.some((p) => pathname === p.href);

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-width)] flex-col border-r border-[var(--border)] bg-[var(--bg-sidebar)] transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-[var(--shadow-md)]" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[var(--header-height)] items-center border-b border-[var(--border-light)] px-4">
          <BrandLogo />
        </div>
        <nav className="flex-1 overflow-y-auto p-2" aria-label="Main">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`mb-0.5 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary-light)] text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-base)] text-xs font-semibold">
                  {item.icon}
                </span>
                <span className="truncate">{t.nav[item.key]}</span>
              </Link>
            );
          })}

          {(revealed || isPlatformRoute) && (
            <div className="platform-nav-group">
              <div className="platform-nav-label">{t.platform.layerLabel}</div>
              {platformNavItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`mb-0.5 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-slate-100 text-slate-800"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-base)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                      {item.icon}
                    </span>
                    <span className="truncate">{t.nav[item.key]}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
        <div className="border-t border-[var(--border-light)] p-3 text-xs text-[var(--text-muted)]">
          {t.appSubtitle}
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[var(--header-height)] items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="btn-secondary min-h-9 px-3 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ≡
            </button>
            <div className="hidden lg:block">
              <BrandLogo collapsed />
            </div>
          </div>

          <div className="hidden flex-1 max-w-md md:block">
            <input
              type="search"
              placeholder={t.common.search + "…"}
              className="input-field h-9 text-sm"
              aria-label={t.common.search}
            />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={togglePlatform} className="btn-secondary min-h-9 px-3 text-xs">
              ⧉ {t.home.viewPlatform}
            </button>
            <OpsStatusDot />
            <button type="button" onClick={toggleLocale} className="btn-secondary min-h-9 px-3 text-sm">
              {locale === "en" ? "中文" : "EN"}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <KnowledgeChatCallout key={locale} />
    </div>
  );
}
