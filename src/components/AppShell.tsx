"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/market", key: "market" as const },
  { href: "/planning", key: "planning" as const },
  { href: "/suppliers", key: "suppliers" as const },
  { href: "/mes", key: "mes" as const },
  { href: "/quality", key: "quality" as const },
  { href: "/knowledge", key: "knowledge" as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, locale, toggleLocale } = useI18n();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{t.appName}</h1>
            <p className="text-xs text-zinc-500">{t.appSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={toggleLocale}
            className="min-h-11 min-w-11 rounded-md border border-zinc-300 px-3 text-sm font-medium hover:bg-zinc-100"
            aria-label="Toggle language"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 pb-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium min-h-11 flex items-center ${
                  active ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
