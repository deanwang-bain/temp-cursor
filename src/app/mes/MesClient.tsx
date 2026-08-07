"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Card, MetricCard } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { EVModel, MesMetrics, MesStation } from "@/lib/types";

type HistoryRow = { date: string; oee: number; ftt: number; vph: number; units: number };

export function MesClient({
  initialMetrics,
  stations: initialStations,
  history,
  models,
}: {
  initialMetrics: MesMetrics;
  stations: MesStation[];
  history: HistoryRow[];
  models: EVModel[];
}) {
  const { t, locale } = useI18n();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [stations] = useState(initialStations);
  const [saved, setSaved] = useState(false);
  const [reportMsg, setReportMsg] = useState("");

  const modelName = models.find((m) => m.id === metrics.currentModelId);
  const displayModel = modelName ? (locale === "zh" ? modelName.nameZh : modelName.name) : metrics.currentModelId;

  const tick = useCallback(() => {
    setMetrics((m) => {
      const jitter = () => (Math.random() - 0.5) * 0.8;
      const vph = Math.max(24, Math.min(31, m.vph + jitter()));
      const ftt = Math.max(92, Math.min(97, m.ftt + jitter() * 0.3));
      const oee = Math.max(72, Math.min(82, m.oee + jitter() * 0.4));
      return {
        ...m,
        vph: Math.round(vph * 10) / 10,
        ftt: Math.round(ftt * 10) / 10,
        oee: Math.round(oee * 10) / 10,
        unitsToday: m.unitsToday + (Math.random() > 0.7 ? 1 : 0),
        timestamp: new Date().toISOString(),
      };
    });
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [tick]);

  const saveOverrides = () => {
    localStorage.setItem("ev-demo-mes", JSON.stringify(metrics));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportReport = () => {
    setReportMsg(locale === "zh" ? "报表已生成（演示）：mes-report-7d.pdf" : "Report generated (demo): mes-report-7d.pdf");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.mes.title}</h2>
        <p className="text-sm text-zinc-500">{t.mes.subtitle}</p>
        <p className="mt-1 text-xs text-zinc-400">{t.common.live}: {new Date(metrics.timestamp).toLocaleString()} · {displayModel} · {t.mes.target} VPH {metrics.targetVph}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.mes.oee} value={`${metrics.oee}%`} sub={`A ${metrics.availability}% · P ${metrics.performance}% · Q ${metrics.quality}%`} alert={metrics.oee < 78} />
        <MetricCard label={t.mes.ftt} value={`${metrics.ftt}%`} />
        <MetricCard label={t.mes.vph} value={metrics.vph} sub={`${t.mes.target}: ${metrics.targetVph}`} alert={metrics.vph < metrics.targetVph} />
        <MetricCard label={t.mes.unitsToday} value={metrics.unitsToday} />
      </div>

      <Card title={t.mes.editMetrics}>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["oee", "ftt", "vph"] as const).map((key) => (
            <label key={key} className="text-sm">
              <span className="mb-1 block text-zinc-500">{t.mes[key]}</span>
              <input
                type="number"
                step="0.1"
                value={metrics[key]}
                onChange={(e) => setMetrics({ ...metrics, [key]: parseFloat(e.target.value) || 0 })}
                className="min-h-11 w-full rounded border border-zinc-300 px-3"
              />
            </label>
          ))}
        </div>
        <button type="button" onClick={saveOverrides} className="mt-3 min-h-11 rounded-md bg-red-600 px-4 text-sm text-white hover:bg-red-700">
          {saved ? "✓" : t.common.save}
        </button>
      </Card>

      <Card title={t.mes.stations}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((s) => (
            <div key={s.id} className={`rounded border p-3 text-sm ${s.status === "alarm" ? "border-amber-400 bg-amber-50" : "border-zinc-200"}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{locale === "zh" ? s.nameZh : s.name}</span>
                <Badge tone={s.status === "alarm" ? "warn" : s.status === "running" ? "success" : "default"}>{s.status}</Badge>
              </div>
              <div className="mt-1 text-xs text-zinc-500">Cycle {s.cycleSec}s · Defects {s.defects}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={t.mes.history}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-zinc-500">
                <th className="py-2">Date</th>
                <th>OEE</th>
                <th>FTT</th>
                <th>VPH</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.date} className="border-b border-zinc-50">
                  <td className="py-1">{h.date}</td>
                  <td>{h.oee}%</td>
                  <td>{h.ftt}%</td>
                  <td>{h.vph}</td>
                  <td>{h.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t.mes.report}>
        <p className="mb-3 text-sm text-zinc-500">{t.mes.reportHint}</p>
        <button type="button" onClick={exportReport} className="min-h-11 rounded-md border border-zinc-300 px-4 text-sm hover:bg-zinc-50">{t.common.export}</button>
        {reportMsg && <p className="mt-2 text-sm text-emerald-700">{reportMsg}</p>}
      </Card>
    </div>
  );
}
