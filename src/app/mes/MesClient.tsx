"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, MetricCard } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { useI18n } from "@/lib/i18n/context";
import type { EVModel, MesMetrics, MesStation } from "@/lib/types";

type HistoryRow = { date: string; oee: number; ftt: number; vph: number; units: number; isForecast?: boolean };

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
  const forecastStart = Math.max(0, history.findIndex((point) => point.isForecast) - 1);
  const stationName = (id: string) => {
    const station = stations.find((item) => item.id === id);
    return station ? (locale === "zh" ? station.nameZh : station.name) : id;
  };
  const statusLabel = (status: MesStation["status"]) => locale === "zh" ? ({ running: "运行", idle: "空闲", alarm: "报警" }[status]) : status;

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
    setReportMsg(locale === "zh" ? "报表已生成（演示）：制造执行七日报表.pdf" : "Report generated (demo): mes-report-7d.pdf");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.mes.title}
        subtitle={`${t.mes.subtitle} · ${t.common.live}: ${new Date(metrics.timestamp).toLocaleString()} · ${displayModel}`}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={t.mes.oee} value={`${metrics.oee}%`} sub={locale === "zh" ? `可用率 ${metrics.availability}% · 性能率 ${metrics.performance}% · 质量率 ${metrics.quality}%` : `A ${metrics.availability}% · P ${metrics.performance}% · Q ${metrics.quality}%`} alert={metrics.oee < 78} />
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
        <button type="button" onClick={saveOverrides} className="btn-primary mt-3">
          {saved ? "✓" : t.common.save}
        </button>
      </Card>

      <Card title={t.mes.stations}>
        <div className="mb-5">
          <BarChart
            labels={stations.map((s) => s.id.replace("st-", "ST"))}
            series={[
              { label: locale === "zh" ? "节拍（秒）" : "Cycle time (sec)", values: stations.map((s) => s.cycleSec), color: "#3370ff" },
              { label: locale === "zh" ? "缺陷 × 20" : "Defects × 20", values: stations.map((s) => s.defects * 20), color: "#ef4444" },
            ]}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((s) => (
            <div key={s.id} className={`rounded border p-3 text-sm ${s.status === "alarm" ? "border-amber-400 bg-amber-50" : "border-zinc-200"}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{locale === "zh" ? s.nameZh : s.name}</span>
                <Badge tone={s.status === "alarm" ? "warn" : s.status === "running" ? "success" : "default"}>{statusLabel(s.status)}</Badge>
              </div>
              <div className="mt-1 text-xs text-zinc-500">{locale === "zh" ? "节拍" : "Cycle"} {s.cycleSec}{locale === "zh" ? "秒" : "s"} · {locale === "zh" ? "缺陷" : "Defects"} {s.defects}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={locale === "zh" ? "车间多维分析" : "Shop-floor dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={stations.map((station) => ({ status: station.status, station: station.id, defects: station.defects }))}
          dimensions={[
            { key: "status", label: locale === "zh" ? "运行状态" : "Operating status", valueLabel: (value) => statusLabel(value as MesStation["status"]) },
            { key: "station", label: locale === "zh" ? "工位" : "Station", valueLabel: stationName },
          ]}
          measureKey="defects"
          measureLabel={locale === "zh" ? "缺陷数" : "Defect count"}
        />
      </Card>

      <Card title={t.mes.history}>
        <LineChart
          labels={history.map((h) => h.date.slice(5))}
          series={[
            { label: t.mes.oee, values: history.map((h) => h.oee), color: "#3370ff", forecastFromIndex: forecastStart },
            { label: t.mes.ftt, values: history.map((h) => h.ftt), color: "#14b8a6", forecastFromIndex: forecastStart },
          ]}
          valueSuffix="%"
          forecastLabel={locale === "zh" ? "预测" : "Forecast"}
        />
        <div className="my-4 border-t border-[var(--border-light)]" />
        <LineChart
          labels={history.map((h) => h.date.slice(5))}
          series={[
            { label: t.mes.vph, values: history.map((h) => h.vph), color: "#8b5cf6", forecastFromIndex: forecastStart },
          ]}
          forecastLabel={locale === "zh" ? "预测" : "Forecast"}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-zinc-500">
                <th className="py-2">{locale === "zh" ? "日期" : "Date"}</th>
                <th>{t.mes.oee}</th>
                <th>{t.mes.ftt}</th>
                <th>{t.mes.vph}</th>
                <th>{locale === "zh" ? "产量" : "Units"}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.date} className="border-b border-zinc-50">
                  <td className="py-1">{h.date}</td>
                  <td>{h.oee}%</td>
                  <td>{h.ftt}%</td>
                  <td>{h.vph}</td>
                  <td>{h.units} {h.isForecast && <Badge tone="primary">{locale === "zh" ? "预测" : "Forecast"}</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t.mes.report}>
        <p className="mb-3 text-sm text-zinc-500">{t.mes.reportHint}</p>
        <button type="button" onClick={exportReport} className="btn-secondary">{t.common.export}</button>
        {reportMsg && <p className="mt-2 text-sm text-emerald-700">{reportMsg}</p>}
      </Card>
    </div>
  );
}
