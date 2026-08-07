"use client";

import { useMemo } from "react";
import { Badge, Card, MetricCard } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { EVModel, Holiday, ProductionSlot } from "@/lib/types";

export function PlanningClient({
  plan,
  holidays,
  models,
}: {
  plan: ProductionSlot[];
  holidays: Holiday[];
  models: EVModel[];
}) {
  const { t, locale } = useI18n();

  const totalUnits = useMemo(() => plan.reduce((s, p) => s + p.units, 0), [plan]);
  const changeoverMin = useMemo(() => plan.reduce((s, p) => s + p.changeoverBeforeMin, 0), [plan]);
  const util = Math.min(96, Math.round((totalUnits / (plan.length * 120)) * 100));

  const modelName = (id: string) => {
    const m = models.find((x) => x.id === id);
    return m ? (locale === "zh" ? m.nameZh : m.name) : id;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.planning.title}</h2>
        <p className="text-sm text-amber-700">{t.planning.triggered}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={t.planning.units} value={totalUnits} sub="W33 partial schedule" />
        <MetricCard label={t.planning.changeover} value={`${changeoverMin} min`} sub="Single line mix" />
        <MetricCard label={t.planning.util} value={`${util}%`} sub={t.planning.capacity} />
      </div>

      <Card title={t.planning.schedule}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-zinc-500">
                <th className="py-2">Date</th>
                <th>Shift</th>
                <th>Model</th>
                <th>{t.planning.units}</th>
                <th>{t.planning.changeover}</th>
                <th>{t.planning.staff}</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((p) => (
                <tr key={p.id} className="border-b border-zinc-50">
                  <td className="py-2">{p.date}</td>
                  <td><Badge>{p.shift}</Badge></td>
                  <td className="font-medium">{modelName(p.modelId)}</td>
                  <td>{p.units}</td>
                  <td>{p.changeoverBeforeMin ? `${p.changeoverBeforeMin} min` : "—"}</td>
                  <td>{p.staffRequired}</td>
                  <td className="max-w-xs text-zinc-600">{p.note ? (locale === "zh" ? p.noteZh : p.note) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t.planning.holidays}>
        <ul className="space-y-2 text-sm">
          {holidays.map((h) => (
            <li key={h.date} className="flex flex-wrap items-center gap-2 rounded border border-zinc-100 p-2">
              <span className="font-mono text-xs">{h.date}</span>
              <span>{locale === "zh" ? h.nameZh : h.name}</span>
              <Badge tone={h.impact === "closed" ? "danger" : "warn"}>{h.impact}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Changeover matrix (min)">
        <div className="overflow-x-auto text-xs">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1" />
                {models.map((m) => (
                  <th key={m.id} className="p-1 font-normal">{locale === "zh" ? m.nameZh.split(" ")[0] : m.name.split(" ")[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((from) => (
                <tr key={from.id}>
                  <td className="p-1 font-medium">{locale === "zh" ? from.nameZh.split(" ")[0] : from.name.split(" ")[0]}</td>
                  {models.map((to) => (
                    <td key={to.id} className="p-1 text-center tabular-nums text-zinc-600">
                      {from.id === to.id ? "—" : Math.round((from.changeoverMin + to.changeoverMin) / 2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
