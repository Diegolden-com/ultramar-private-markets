import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="stat card card-border min-w-0 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
          {label}
        </p>
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-border-muted bg-surface-container-low">
          <Icon className="h-4 w-4 text-status-signal" />
        </span>
      </div>
      <p className="stat-value mt-5 break-words font-mono text-2xl font-semibold leading-tight text-on-surface">{value}</p>
      {detail ? <p className="stat-desc mt-2 text-sm leading-normal text-on-surface-variant">{detail}</p> : null}
    </div>
  );
}
