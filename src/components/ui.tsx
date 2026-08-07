import type { ReactNode } from "react";

export function Card({
  title,
  children,
  className = "",
  action,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] ${className}`}
    >
      {title ? (
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className={title ? "p-4" : "p-4"}>{children}</div>
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
    <div
      className={`rounded-[var(--radius)] border p-4 shadow-[var(--shadow-sm)] ${
        alert ? "border-amber-300 bg-amber-50/80" : "border-[var(--border)] bg-[var(--bg-surface)]"
      }`}
    >
      <div className="text-xs font-medium text-[var(--text-secondary)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-[var(--text-primary)]">{value}</div>
      {sub ? <div className="mt-1 text-xs text-[var(--text-muted)]">{sub}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warn" | "danger" | "primary";
}) {
  const tones = {
    default: "bg-[var(--bg-base)] text-[var(--text-secondary)]",
    primary: "bg-[var(--primary-light)] text-[var(--primary)]",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-800",
    danger: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`min-h-9 rounded-md px-3 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-[var(--bg-surface)] text-[var(--primary)] shadow-[var(--shadow-sm)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
