import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="border border-border-muted bg-surface p-4 transition-colors hover:border-status-signal">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
          {label}
        </p>
        <Icon className="h-4 w-4 text-status-signal" />
      </div>
      <p className="mt-4 font-mono text-xl font-semibold text-on-surface">{value}</p>
      <p className="mt-2 text-sm leading-normal text-on-surface-variant">{detail}</p>
    </div>
  );
}
