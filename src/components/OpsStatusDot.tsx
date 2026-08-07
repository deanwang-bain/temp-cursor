"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { getOpsMetrics } from "@/lib/data";

export function OpsStatusDot() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ops = getOpsMetrics();
  const openAlarms = ops.alarms.filter((a) => !a.resolvedAt);
  const critical = openAlarms.some((a) => a.severity === "critical");
  const warn = openAlarms.some((a) => a.severity === "warn");

  const tone = critical ? "critical" : warn ? "warn" : "ok";

  return (
    <div className="ops-dot-wrap">
      <button
        type="button"
        className={`ops-dot ops-dot-${tone}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t.ops.statusSummary}
        title={t.ops.statusSummary}
      />
      {open && (
        <div className="ops-dot-popover">
          <p className="ops-dot-popover-title">{t.ops.statusSummary}</p>
          <ul className="ops-dot-popover-list">
            <li>
              {ops.humanInTheLoop.pendingReviews} {t.ops.pendingReviews}
            </li>
            <li>
              ${ops.tokenUsage.todayCostUsd.toFixed(2)} {t.ops.tokensToday}
            </li>
            <li>
              {openAlarms.length} {t.ops.openAlarms}
            </li>
          </ul>
          <Link href="/ops" className="ops-dot-popover-link">
            {t.ops.seeDetails} →
          </Link>
        </div>
      )}
    </div>
  );
}
