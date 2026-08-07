"use client";

import { Card, Badge } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { Supplier } from "@/lib/types";

export function SuppliersClient({ suppliers }: { suppliers: Supplier[] }) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.suppliers.title}</h2>
        <p className="text-sm text-zinc-500">{t.suppliers.subtitle}</p>
      </div>

      <div className="grid gap-4">
        {suppliers.map((s) => (
          <Card key={s.id} className={s.flagged ? "border-red-300" : ""}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{locale === "zh" ? s.nameZh : s.name}</h3>
                <p className="text-sm text-zinc-500">{locale === "zh" ? s.categoryZh : s.category}</p>
              </div>
              {s.flagged && <Badge tone="danger">{t.common.flagged}</Badge>}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
              <div><span className="text-zinc-500">{t.suppliers.otif}</span><div className="font-semibold tabular-nums">{s.otifPercent}%</div></div>
              <div><span className="text-zinc-500">{t.suppliers.issues}</span><div className="font-semibold tabular-nums">{s.quantityIssueCount}</div></div>
              <div><span className="text-zinc-500">{t.suppliers.lastIssue}</span><div className="font-semibold">{s.lastIssueDate || "—"}</div></div>
            </div>
            {s.flagged && (
              <p className="mt-2 rounded bg-red-50 p-2 text-sm text-red-800">{locale === "zh" ? s.flagReasonZh : s.flagReason}</p>
            )}
            <p className="mt-2 text-xs text-zinc-500">{t.suppliers.parts}: {s.parts.join(", ")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
