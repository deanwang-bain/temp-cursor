"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export function AiBadge({
  rationale,
  rationaleZh,
  confidence,
}: {
  rationale?: string;
  rationaleZh?: string;
  confidence?: number;
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const text = locale === "zh" ? rationaleZh : rationale;

  if (!text) return null;

  return (
    <span className="ai-badge-wrap">
      <button
        type="button"
        className="ai-badge"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={text}
      >
        {t.common.aiSet}
        {confidence != null ? ` · ${Math.round(confidence * 100)}%` : ""}
      </button>
      {open && (
        <span className="ai-rationale-popover" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
