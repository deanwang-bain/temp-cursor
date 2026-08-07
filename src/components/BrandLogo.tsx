"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/context";

/**
 * Brand-agnostic logo slot. Replace inner content with <Image src="/brand/logo.svg" /> when ready.
 */
export function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  const { locale } = useI18n();
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="brand-logo-slot flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--primary-muted)] text-sm font-semibold text-[var(--primary)]"
        aria-hidden
      >
        {/* Slot: drop brand SVG/image here */}
        {locale === "zh" ? "制" : "M"}
      </div>
      {!collapsed && (
        <div className="min-w-0 truncate">
          <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{locale === "zh" ? "制造人工智能" : "Manufacturing AI"}</div>
          <div className="truncate text-xs text-[var(--text-muted)]">{locale === "zh" ? "纯电制造演示平台" : "EV Demo Platform"}</div>
        </div>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  prefix,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  prefix?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        {prefix ? <div className="page-prefix">{prefix}</div> : null}
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
