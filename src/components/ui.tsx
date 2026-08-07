import type { ReactNode } from "react";

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
      {title ? <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">{title}</h2> : null}
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string | number;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${alert ? "border-amber-400 bg-amber-50" : "border-zinc-200 bg-white"}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warn" | "danger";
}) {
  const tones = {
    default: "bg-zinc-100 text-zinc-700",
    success: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
  };
  return <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
