"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/BrandLogo";
import { Card, Badge } from "@/components/ui";
import { HorizontalBarChart, LineChart } from "@/components/charts";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { useI18n } from "@/lib/i18n/context";
import type { Supplier, SupplierHistoryPoint } from "@/lib/types";

export function SuppliersClient({ suppliers, history }: { suppliers: Supplier[]; history: SupplierHistoryPoint[] }) {
  const { t, locale } = useI18n();
  const [selectedSupplier, setSelectedSupplier] = useState("sup-inverter");
  const [actions, setActions] = useState<Record<string, string>>({});
  const months = useMemo(() => [...new Set(history.map((h) => h.month))], [history]);
  const selectedHistory = history.filter((h) => h.supplierId === selectedSupplier);
  const selectedName = suppliers.find((s) => s.id === selectedSupplier);
  const forecastStart = Math.max(0, selectedHistory.findIndex((point) => point.isForecast) - 1);
  const supplierLabel = (id: string) => {
    const supplier = suppliers.find((item) => item.id === id);
    return supplier ? (locale === "zh" ? supplier.nameZh : supplier.name) : id;
  };
  const monthLabel = (month: string) => locale === "zh" ? ({ Mar: "三月", Apr: "四月", May: "五月", Jun: "六月", Jul: "七月", Aug: "八月", Sep: "九月", Oct: "十月" }[month] || month) : month;

  const requestReview = (supplierId: string) => {
    const message = locale === "zh" ? "已提交采购负责人复核" : "Review sent to procurement lead";
    setActions((current) => ({ ...current, [supplierId]: message }));
    localStorage.setItem(`supplier-action-${supplierId}`, message);
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t.suppliers.title} subtitle={t.suppliers.subtitle} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={locale === "zh" ? "供应商准时足量交付对标" : "Supplier OTIF benchmark"}>
          <HorizontalBarChart
            target={92}
            valueSuffix="%"
            rows={suppliers.map((s) => ({
              label: locale === "zh" ? s.nameZh : s.name,
              value: s.otifPercent,
              color: s.otifPercent < 92 ? "#ef4444" : s.otifPercent < 95 ? "#f59e0b" : "#14b8a6",
            }))}
          />
          <p className="mt-3 text-xs text-[var(--text-muted)]">{locale === "zh" ? "黑线为百分之九十二审查阈值" : "Marker indicates the 92% review threshold"}</p>
        </Card>
        <Card
          title={locale === "zh" ? "六个月准时足量交付率历史与预测" : "6-month OTIF history and forecast"}
          action={
            <select className="input-field !min-h-9 !w-auto" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{locale === "zh" ? s.nameZh : s.name}</option>)}
            </select>
          }
        >
          <LineChart labels={months.map(monthLabel)} series={[{ label: selectedName ? (locale === "zh" ? selectedName.nameZh : selectedName.name) : (locale === "zh" ? "准时足量交付率" : "OTIF"), values: selectedHistory.map((h) => h.otif), color: "#3370ff", forecastFromIndex: forecastStart }]} valueSuffix="%" forecastLabel={locale === "zh" ? "预测" : "Forecast"} />
        </Card>
      </div>

      <Card title={locale === "zh" ? "供应商多维分析" : "Supplier dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={history.filter((row) => !row.isForecast).map((row) => {
            const supplier = suppliers.find((item) => item.id === row.supplierId);
            return { category: supplier ? (locale === "zh" ? supplier.categoryZh : supplier.category) : "", supplier: row.supplierId, month: row.month, otif: row.otif };
          })}
          dimensions={[
            { key: "category", label: locale === "zh" ? "品类" : "Category" },
            { key: "supplier", label: locale === "zh" ? "供应商" : "Supplier", valueLabel: supplierLabel },
            { key: "month", label: locale === "zh" ? "月份" : "Month", valueLabel: monthLabel },
          ]}
          measureKey="otif"
          measureLabel={locale === "zh" ? "平均准时足量交付率" : "Average OTIF"}
          aggregation="average"
          valueSuffix="%"
        />
      </Card>

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
            <p className="mt-2 text-xs text-zinc-500">{t.suppliers.parts}: {(locale === "zh" && s.partsZh ? s.partsZh : s.parts).join(locale === "zh" ? "、" : ", ")}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" className="btn-secondary !min-h-9" onClick={() => setSelectedSupplier(s.id)}>
                {locale === "zh" ? "查看趋势" : "View trend"}
              </button>
              {s.flagged && <button type="button" className="btn-primary !min-h-9" onClick={() => requestReview(s.id)}>{locale === "zh" ? "请求采购复核" : "Request review"}</button>}
              {actions[s.id] && <span className="text-xs text-emerald-700">✓ {actions[s.id]}</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
