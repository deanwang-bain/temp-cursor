"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card, MetricCard } from "@/components/ui";
import { BarChart, LineChart } from "@/components/charts";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { useI18n } from "@/lib/i18n/context";
import type { EVModel, Holiday, PersonnelRolePlan, ProductionHistoryPoint, ProductionSlot } from "@/lib/types";

export function PlanningClient({
  plan,
  holidays,
  models,
  history,
  personnel,
}: {
  plan: ProductionSlot[];
  holidays: Holiday[];
  models: EVModel[];
  history: ProductionHistoryPoint[];
  personnel: PersonnelRolePlan[];
}) {
  const { t, locale } = useI18n();
  const [personnelShift, setPersonnelShift] = useState<"all" | "A" | "B" | "C">("all");

  const totalUnits = useMemo(() => plan.reduce((s, p) => s + p.units, 0), [plan]);
  const changeoverMin = useMemo(() => plan.reduce((s, p) => s + p.changeoverBeforeMin, 0), [plan]);
  const util = Math.min(96, Math.round((totalUnits / (plan.length * 120)) * 100));
  const dailyDates = [...new Set(plan.map((p) => p.date))];
  const modelTotals = models.map((model) => plan.filter((p) => p.modelId === model.id).reduce((sum, p) => sum + p.units, 0));
  const forecastStart = Math.max(0, history.findIndex((point) => point.isForecast) - 1);
  const shiftLabel = (shift: string) => locale === "zh" ? `${({ A: "甲", B: "乙", C: "丙" }[shift] || shift)}班` : `Shift ${shift}`;
  const impactLabel = (impact: Holiday["impact"]) => locale === "zh" ? ({ closed: "停产", reduced: "减产" }[impact]) : impact;
  const visiblePersonnel = personnelShift === "all" ? personnel : personnel.filter((row) => row.shift === personnelShift);
  const requiredPersonnel = visiblePersonnel.reduce((sum, row) => sum + row.requiredHeadcount, 0);
  const assignedPersonnel = visiblePersonnel.reduce((sum, row) => sum + row.assignedHeadcount, 0);
  const personnelGap = Math.max(0, requiredPersonnel - assignedPersonnel);
  const coverage = requiredPersonnel ? Math.round((assignedPersonnel / requiredPersonnel) * 100) : 100;

  const modelName = (id: string) => {
    const m = models.find((x) => x.id === id);
    return m ? (locale === "zh" ? m.nameZh : m.name) : id;
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t.planning.title} subtitle={t.planning.triggered} />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={t.planning.units} value={totalUnits} sub={locale === "zh" ? "第33周部分排程" : "Week 33 partial schedule"} />
        <MetricCard label={t.planning.changeover} value={`${changeoverMin} ${locale === "zh" ? "分钟" : "min"}`} sub={locale === "zh" ? "单线混产" : "Single-line mix"} />
        <MetricCard label={t.planning.util} value={`${util}%`} sub={t.planning.capacity} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={locale === "zh" ? "七周计划达成历史与预测" : "7-week plan attainment and forecast"}>
          <LineChart
            labels={history.map((point) => locale === "zh" ? `第${point.week.slice(1)}周` : point.week)}
            series={[
              { label: locale === "zh" ? "计划" : "Planned", values: history.map((h) => h.plannedUnits), color: "#94a3b8", forecastFromIndex: forecastStart },
              { label: locale === "zh" ? "实际" : "Actual", values: history.map((h) => h.actualUnits), color: "#3370ff", forecastFromIndex: forecastStart },
            ]}
            forecastLabel={locale === "zh" ? "预测" : "Forecast"}
          />
        </Card>
        <Card title={locale === "zh" ? "本期混线车型组合" : "Current mixed-line model mix"}>
          <BarChart
            labels={models.map((m) => (locale === "zh" ? m.nameZh : m.name).split(" ")[0])}
            series={[{ label: t.planning.units, values: modelTotals, color: "#14b8a6" }]}
          />
        </Card>
      </div>

      <Card title={locale === "zh" ? "排程多维分析" : "Schedule dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={plan.map((row) => ({ date: row.date, shift: row.shift, model: row.modelId, units: row.units }))}
          dimensions={[
            { key: "date", label: locale === "zh" ? "日期" : "Date" },
            { key: "shift", label: locale === "zh" ? "班次" : "Shift", valueLabel: shiftLabel },
            { key: "model", label: locale === "zh" ? "车型" : "Model", valueLabel: modelName },
          ]}
          measureKey="units"
          measureLabel={t.planning.units}
        />
      </Card>

      <Card title={locale === "zh" ? "每日排程与班次产量" : "Daily schedule by shift"}>
        <BarChart
          labels={dailyDates.map((date) => date.slice(5))}
          stacked
          series={(["A", "B", "C"] as const).map((shift, i) => ({
            label: shiftLabel(shift),
            values: dailyDates.map((date) => plan.filter((p) => p.date === date && p.shift === shift).reduce((sum, p) => sum + p.units, 0)),
            color: ["#3370ff", "#14b8a6", "#f59e0b"][i],
          }))}
        />
      </Card>

      <Card
        title={locale === "zh" ? "人员计划：岗位、技能与资质" : "Personnel plan: roles, skills and qualifications"}
        action={
          <select className="input-field !min-h-9 !w-auto" value={personnelShift} onChange={(event) => setPersonnelShift(event.target.value as typeof personnelShift)}>
            <option value="all">{locale === "zh" ? "全部班次" : "All shifts"}</option>
            {(["A", "B", "C"] as const).map((shift) => <option key={shift} value={shift}>{shiftLabel(shift)}</option>)}
          </select>
        }
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={locale === "zh" ? "需求人数" : "Required people"} value={requiredPersonnel} />
          <MetricCard label={locale === "zh" ? "已排人数" : "Assigned people"} value={assignedPersonnel} />
          <MetricCard label={locale === "zh" ? "人员缺口" : "Staffing gap"} value={personnelGap} alert={personnelGap > 0} />
          <MetricCard label={locale === "zh" ? "覆盖率" : "Coverage"} value={`${coverage}%`} alert={coverage < 100} />
        </div>

        <BarChart
          labels={visiblePersonnel.map((row) => `${locale === "zh" ? row.roleZh : row.role.split(" ").slice(0, 2).join(" ")} · ${locale === "zh" ? shiftLabel(row.shift) : row.shift}`)}
          series={[
            { label: locale === "zh" ? "需求" : "Required", values: visiblePersonnel.map((row) => row.requiredHeadcount), color: "#94a3b8" },
            { label: locale === "zh" ? "已排" : "Assigned", values: visiblePersonnel.map((row) => row.assignedHeadcount), color: "#3370ff" },
          ]}
          height={300}
        />

        <div className="personnel-role-grid">
          {visiblePersonnel.map((row) => {
            const gap = Math.max(0, row.requiredHeadcount - row.assignedHeadcount);
            return (
              <article key={row.id} className={`personnel-role-card ${gap > 0 ? "personnel-role-gap" : ""}`}>
                <div className="personnel-role-head">
                  <div>
                    <h3>{locale === "zh" ? row.roleZh : row.role}</h3>
                    <p>{locale === "zh" ? row.areaZh : row.area} · {shiftLabel(row.shift)}</p>
                  </div>
                  <Badge tone={gap > 0 ? "danger" : "success"}>{gap > 0 ? (locale === "zh" ? `缺${gap}人` : `${gap} short`) : (locale === "zh" ? "人员齐备" : "Covered")}</Badge>
                </div>
                <div className="personnel-counts">
                  <span>{locale === "zh" ? "需求" : "Required"} <strong>{row.requiredHeadcount}</strong></span>
                  <span>{locale === "zh" ? "已排" : "Assigned"} <strong>{row.assignedHeadcount}</strong></span>
                </div>
                <div className="personnel-requirement">
                  <h4>{locale === "zh" ? "必备技能" : "Required skills"}</h4>
                  <div>{(locale === "zh" ? row.skillsZh : row.skills).map((skill) => <span key={skill}>{skill}</span>)}</div>
                </div>
                <div className="personnel-requirement">
                  <h4>{locale === "zh" ? "资格要求" : "Qualifications"}</h4>
                  <ul>{(locale === "zh" ? row.qualificationsZh : row.qualifications).map((qualification) => <li key={qualification}>✓ {qualification}</li>)}</ul>
                </div>
              </article>
            );
          })}
        </div>
      </Card>

      <Card title={t.planning.schedule}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-zinc-500">
                <th className="py-2">{locale === "zh" ? "日期" : "Date"}</th>
                <th>{locale === "zh" ? "班次" : "Shift"}</th>
                <th>{locale === "zh" ? "车型" : "Model"}</th>
                <th>{t.planning.units}</th>
                <th>{t.planning.changeover}</th>
                <th>{t.planning.staff}</th>
                <th>{locale === "zh" ? "备注" : "Note"}</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((p) => (
                <tr key={p.id} className="border-b border-zinc-50">
                  <td className="py-2">{p.date}</td>
                  <td><Badge>{shiftLabel(p.shift)}</Badge></td>
                  <td className="font-medium">{modelName(p.modelId)}</td>
                  <td>{p.units}</td>
                  <td>{p.changeoverBeforeMin ? `${p.changeoverBeforeMin} ${locale === "zh" ? "分钟" : "min"}` : "—"}</td>
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
              <Badge tone={h.impact === "closed" ? "danger" : "warn"}>{impactLabel(h.impact)}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={locale === "zh" ? "换型矩阵（分钟）" : "Changeover matrix (min)"}>
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
