"use client";

import { useMemo, useState } from "react";

export type DrillRow = Record<string, string | number | boolean | undefined>;
export type DrillDimension = {
  key: string;
  label: string;
  valueLabel?: (value: string) => string;
};

type PathItem = { dimensionIndex: number; value: string; label: string };

export function DimensionDrilldown({
  rows,
  dimensions,
  measureKey,
  measureLabel,
  aggregation = "sum",
  valueSuffix = "",
  locale,
}: {
  rows: DrillRow[];
  dimensions: DrillDimension[];
  measureKey: string;
  measureLabel: string;
  aggregation?: "sum" | "average";
  valueSuffix?: string;
  locale: "en" | "zh";
}) {
  const [path, setPath] = useState<PathItem[]>([]);
  const level = Math.min(path.length, dimensions.length - 1);
  const dimension = dimensions[level];

  const filteredRows = useMemo(() => rows.filter((row) => path.every((item) => String(row[dimensions[item.dimensionIndex].key]) === item.value)), [dimensions, path, rows]);
  const groups = useMemo(() => {
    const grouped = new Map<string, number[]>();
    filteredRows.forEach((row) => {
      const key = String(row[dimension.key] ?? (locale === "zh" ? "未指定" : "Unspecified"));
      const value = Number(row[measureKey] || 0);
      grouped.set(key, [...(grouped.get(key) || []), value]);
    });
    return [...grouped.entries()].map(([key, values]) => ({
      key,
      label: dimension.valueLabel?.(key) || key,
      value: aggregation === "average" ? values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1) : values.reduce((sum, value) => sum + value, 0),
      records: values.length,
    })).sort((a, b) => b.value - a.value);
  }, [aggregation, dimension, filteredRows, locale, measureKey]);
  const max = Math.max(1, ...groups.map((group) => group.value));
  const total = aggregation === "average"
    ? filteredRows.reduce((sum, row) => sum + Number(row[measureKey] || 0), 0) / Math.max(filteredRows.length, 1)
    : filteredRows.reduce((sum, row) => sum + Number(row[measureKey] || 0), 0);
  const canDrill = level < dimensions.length - 1;
  const format = (value: number) => `${Number.isInteger(value) ? value : value.toFixed(1)}${valueSuffix}`;

  const drill = (key: string, label: string) => {
    if (!canDrill) return;
    setPath((current) => [...current, { dimensionIndex: level, value: key, label }]);
  };

  return (
    <div className="dimension-explorer">
      <div className="dimension-breadcrumbs" aria-label={locale === "zh" ? "分析层级" : "Analysis hierarchy"}>
        <button type="button" onClick={() => setPath([])}>{locale === "zh" ? "全部" : "All"}</button>
        {path.map((item, index) => (
          <span key={`${item.value}-${index}`}>› <button type="button" onClick={() => setPath((current) => current.slice(0, index + 1))}>{item.label}</button></span>
        ))}
      </div>
      <div className="dimension-summary">
        <div><span>{locale === "zh" ? "当前维度" : "Current dimension"}</span><strong>{dimension.label}</strong></div>
        <div><span>{measureLabel}</span><strong>{format(total)}</strong></div>
        <div><span>{locale === "zh" ? "记录" : "Records"}</span><strong>{filteredRows.length}</strong></div>
      </div>
      <div className="dimension-groups">
        {groups.map((group) => (
          <button key={group.key} type="button" onClick={() => drill(group.key, group.label)} disabled={!canDrill}>
            <span className="dimension-group-label">{group.label}<small>{group.records} {locale === "zh" ? "条" : "records"}</small></span>
            <span className="dimension-group-track"><i style={{ width: `${(group.value / max) * 100}%` }} /></span>
            <strong>{format(group.value)}</strong>
            <em>{canDrill ? (locale === "zh" ? "下钻 ›" : "Drill ›") : (locale === "zh" ? "明细" : "Detail")}</em>
          </button>
        ))}
      </div>
      {path.length > 0 && <button type="button" className="dimension-rollup" onClick={() => setPath((current) => current.slice(0, -1))}>← {locale === "zh" ? "汇总上卷" : "Roll up"}</button>}
    </div>
  );
}
