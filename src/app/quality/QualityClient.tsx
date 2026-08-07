"use client";

import { Card, Badge } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { QualityIssue, Supplier } from "@/lib/types";

export function QualityClient({ issues, suppliers }: { issues: QualityIssue[]; suppliers: Supplier[] }) {
  const { t, locale } = useI18n();

  const supplierName = (id?: string) => {
    if (!id) return "—";
    const s = suppliers.find((x) => x.id === id);
    return s ? (locale === "zh" ? s.nameZh : s.name) : id;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.quality.title}</h2>
        <p className="text-sm text-zinc-500">{t.quality.subtitle}</p>
      </div>

      <div className="space-y-4">
        {issues.map((q) => (
          <Card key={q.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-zinc-400">{q.id}</span>
              <Badge tone={q.severity === "critical" ? "danger" : q.severity === "major" ? "warn" : "default"}>{q.severity}</Badge>
              <Badge>{q.status}</Badge>
              <span className="text-xs text-zinc-400">{new Date(q.openedAt).toLocaleString()}</span>
            </div>
            <h3 className="mt-2 font-semibold">{locale === "zh" ? q.defectDescZh : q.defectDesc}</h3>
            <p className="text-xs text-zinc-500">{q.defectCode} · {q.stationId} · {q.modelId}</p>
            {q.rootCause && (
              <div className="mt-3 rounded bg-zinc-50 p-2 text-sm">
                <span className="font-medium">{t.quality.rootCause}: </span>
                {locale === "zh" ? q.rootCauseZh : q.rootCause}
              </div>
            )}
            {q.supplierId && (
              <div className="mt-2 text-sm">
                <span className="font-medium">{t.quality.supplier}: </span>
                {supplierName(q.supplierId)}
              </div>
            )}
            {q.correctiveAction && (
              <div className="mt-2 text-sm text-emerald-800">
                <span className="font-medium">{t.quality.corrective}: </span>
                {locale === "zh" ? q.correctiveActionZh : q.correctiveAction}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
