"use client";

import { useId } from "react";

export type ChartSeries = {
  label: string;
  values: number[];
  color?: string;
  dashed?: boolean;
  forecastFromIndex?: number;
};

const COLORS = ["#3370ff", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444", "#64748b"];

function emptyMessage() {
  return <div className="chart-empty">No data</div>;
}

export function LineChart({
  labels,
  series,
  height = 260,
  valueSuffix = "",
  forecastLabel,
}: {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  valueSuffix?: string;
  forecastLabel?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  if (!labels.length || !series.length) return emptyMessage();

  const width = 760;
  const pad = { top: 24, right: 24, bottom: 42, left: 52 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const allValues = series.flatMap((s) => s.values).filter(Number.isFinite);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const range = rawMax - rawMin || Math.max(Math.abs(rawMax), 1);
  const min = Math.max(0, rawMin - range * 0.12);
  const max = rawMax + range * 0.12;
  const x = (index: number) => pad.left + (labels.length === 1 ? innerW / 2 : (index / (labels.length - 1)) * innerW);
  const y = (value: number) => pad.top + innerH - ((value - min) / (max - min || 1)) * innerH;
  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4).reverse();

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        {series.map((s, i) => (
          <span key={s.label}><i className={s.dashed ? "dashed" : ""} style={{ background: s.color || COLORS[i % COLORS.length] }} />{s.label}</span>
        ))}
        {forecastLabel && series.some((item) => item.forecastFromIndex !== undefined) && <span><i className="dashed" style={{ color: "#64748b" }} />{forecastLabel}</span>}
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={series.map((s) => s.label).join(", ")}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.label} id={`${gradientId}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color || COLORS[i % COLORS.length]} stopOpacity="0.2" />
              <stop offset="100%" stopColor={s.color || COLORS[i % COLORS.length]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((tick, i) => {
          const tickY = pad.top + (i / 4) * innerH;
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={tickY} y2={tickY} className="chart-gridline" />
              <text x={pad.left - 10} y={tickY + 4} textAnchor="end" className="chart-axis-label">{Math.round(tick * 10) / 10}{valueSuffix}</text>
            </g>
          );
        })}
        {labels.map((label, i) => (
          <text key={`${label}-${i}`} x={x(i)} y={height - 14} textAnchor="middle" className="chart-axis-label">{label}</text>
        ))}
        {series.map((s, seriesIndex) => {
          const color = s.color || COLORS[seriesIndex % COLORS.length];
          const points = s.values.map((value, i) => `${x(i)},${y(value)}`).join(" ");
          const area = `${pad.left},${pad.top + innerH} ${points} ${x(s.values.length - 1)},${pad.top + innerH}`;
          const split = s.forecastFromIndex;
          const actualPoints = split === undefined ? points : s.values.slice(0, split + 1).map((value, i) => `${x(i)},${y(value)}`).join(" ");
          const forecastPoints = split === undefined ? "" : s.values.slice(split).map((value, i) => `${x(i + split)},${y(value)}`).join(" ");
          return (
            <g key={s.label}>
              {series.length <= 2 && split === undefined && <polygon points={area} fill={`url(#${gradientId}-${seriesIndex})`} />}
              <polyline points={actualPoints} fill="none" stroke={color} strokeWidth="3" strokeDasharray={s.dashed ? "8 7" : undefined} strokeLinejoin="round" strokeLinecap="round" />
              {forecastPoints && <polyline points={forecastPoints} fill="none" stroke={color} strokeWidth="3" strokeDasharray="8 7" strokeLinejoin="round" strokeLinecap="round" />}
              {s.values.map((value, i) => (
                <circle key={i} cx={x(i)} cy={y(value)} r="4" fill="#fff" stroke={color} strokeWidth="2">
                  <title>{`${labels[i]} · ${s.label}: ${value}${valueSuffix}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BarChart({
  labels,
  series,
  height = 260,
  valueSuffix = "",
  stacked = false,
  forecastLabel,
}: {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  valueSuffix?: string;
  stacked?: boolean;
  forecastLabel?: string;
}) {
  if (!labels.length || !series.length) return emptyMessage();
  const width = 760;
  const pad = { top: 20, right: 20, bottom: 50, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const totals = labels.map((_, index) => series.reduce((sum, s) => sum + (s.values[index] || 0), 0));
  const max = Math.max(1, stacked ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.values))) * 1.12;
  const groupW = innerW / labels.length;
  const barGap = 4;
  const barW = stacked ? Math.min(54, groupW * 0.62) : Math.max(8, Math.min(38, (groupW * 0.72 - barGap * (series.length - 1)) / series.length));
  const ticks = Array.from({ length: 5 }, (_, i) => (max * (4 - i)) / 4);

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        {series.map((s, i) => <span key={s.label}><i className={s.dashed ? "dashed" : ""} style={{ background: s.color || COLORS[i % COLORS.length] }} />{s.label}</span>)}
        {forecastLabel && series.some((item) => item.forecastFromIndex !== undefined) && <span><i style={{ background: "#94a3b8", opacity: 0.45 }} />{forecastLabel}</span>}
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={series.map((s) => s.label).join(", ")}>
        {ticks.map((tick, i) => {
          const tickY = pad.top + (i / 4) * innerH;
          return <g key={i}><line x1={pad.left} x2={width - pad.right} y1={tickY} y2={tickY} className="chart-gridline" /><text x={pad.left - 8} y={tickY + 4} textAnchor="end" className="chart-axis-label">{Math.round(tick)}</text></g>;
        })}
        {labels.map((label, labelIndex) => {
          const center = pad.left + groupW * labelIndex + groupW / 2;
          let stackedHeight = 0;
          return (
            <g key={`${label}-${labelIndex}`}>
              {series.map((s, seriesIndex) => {
                const value = s.values[labelIndex] || 0;
                const h = (value / max) * innerH;
                const x = stacked ? center - barW / 2 : center - ((barW + barGap) * series.length - barGap) / 2 + seriesIndex * (barW + barGap);
                const y = pad.top + innerH - h - stackedHeight;
                if (stacked) stackedHeight += h;
                const forecast = s.forecastFromIndex !== undefined && labelIndex >= s.forecastFromIndex;
                return <rect key={s.label} x={x} y={y} width={barW} height={Math.max(h, 1)} rx="4" fill={s.color || COLORS[seriesIndex % COLORS.length]} opacity={forecast ? 0.42 : 1}><title>{`${label} · ${s.label}: ${value}${valueSuffix}${forecast && forecastLabel ? ` · ${forecastLabel}` : ""}`}</title></rect>;
              })}
              <text x={center} y={height - 17} textAnchor="middle" className="chart-axis-label">{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function HorizontalBarChart({
  rows,
  valueSuffix = "",
  target,
}: {
  rows: { label: string; value: number; color?: string }[];
  valueSuffix?: string;
  target?: number;
}) {
  const max = Math.max(1, target || 0, ...rows.map((r) => r.value)) * 1.05;
  return (
    <div className="hbar-chart">
      {rows.map((row, i) => (
        <div className="hbar-row" key={row.label}>
          <div className="hbar-meta"><span>{row.label}</span><strong>{row.value}{valueSuffix}</strong></div>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(row.value / max) * 100}%`, background: row.color || COLORS[i % COLORS.length] }} />
            {target !== undefined && <i className="hbar-target" style={{ left: `${(target / max) * 100}%` }} title={`Target ${target}${valueSuffix}`} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color?: string }[];
  centerLabel: string;
  centerValue: string | number;
}) {
  const total = Math.max(1, segments.reduce((sum, s) => sum + s.value, 0));
  let offset = 0;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="donut-layout">
      <svg viewBox="0 0 180 180" className="donut-svg" role="img" aria-label={centerLabel}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#eef0f2" strokeWidth="22" />
        {segments.map((segment, i) => {
          const length = (segment.value / total) * circumference;
          const currentOffset = offset;
          offset += length;
          return <circle key={segment.label} cx="90" cy="90" r={radius} fill="none" stroke={segment.color || COLORS[i % COLORS.length]} strokeWidth="22" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-currentOffset} transform="rotate(-90 90 90)"><title>{`${segment.label}: ${segment.value}`}</title></circle>;
        })}
        <text x="90" y="86" textAnchor="middle" className="donut-value">{centerValue}</text>
        <text x="90" y="106" textAnchor="middle" className="donut-label">{centerLabel}</text>
      </svg>
      <div className="donut-legend">
        {segments.map((segment, i) => <div key={segment.label}><i style={{ background: segment.color || COLORS[i % COLORS.length] }} /><span>{segment.label}</span><strong>{segment.value}</strong></div>)}
      </div>
    </div>
  );
}
