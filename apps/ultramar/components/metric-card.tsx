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
    <div className="rounded border border-border/70 bg-card/70 p-5 transition-colors hover:border-accent/50">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
