import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Radio,
} from "lucide-react";

type Signal = {
  id: number;
  implied_prob: number;
  theoretical_prob: number;
  spread: number;
  meta?: Record<string, unknown>;
  created_at?: string;
};

type Props = {
  signals: Signal[];
};

function SpreadStrength({ spread }: { spread: number }) {
  const abs = Math.abs(spread);
  let level: "low" | "med" | "high";
  if (abs >= 0.05) level = "high";
  else if (abs >= 0.02) level = "med";
  else level = "low";

  const classes = {
    high: "badge-success",
    med: "badge-warning",
    low: "badge-neutral",
  };

  return (
    <span
      className={`badge badge-outline ${classes[level]} text-[10px] uppercase tracking-wider`}
    >
      {level}
    </span>
  );
}

export default function SignalTable({ signals }: Props) {
  return (
    <section className="card card-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Signals</h2>
        </div>
        <span className="badge badge-secondary font-mono text-xs">
          {signals.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Market</th>
              <th className="px-5 py-3 font-medium text-right">Implied</th>
              <th className="px-5 py-3 font-medium text-right">Theo</th>
              <th className="px-5 py-3 font-medium text-right">Spread</th>
              <th className="px-5 py-3 font-medium text-center">Strength</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr
                key={signal.id}
                className="transition-colors hover:bg-accent/50"
              >
                <td className="px-5 py-3">
                  <span className="font-medium text-foreground">
                    {(signal.meta?.market_id as string) ?? `SIG-${signal.id}`}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-mono font-data text-muted-foreground">
                  {signal.implied_prob.toFixed(3)}
                </td>
                <td className="px-5 py-3 text-right font-mono font-data text-muted-foreground">
                  {signal.theoretical_prob.toFixed(3)}
                </td>
                <td className="px-5 py-3 text-right font-mono font-data font-semibold">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      signal.spread >= 0
                        ? "text-signal-positive"
                        : "text-signal-negative"
                    }`}
                  >
                    {signal.spread >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {signal.spread >= 0 ? "+" : ""}
                    {signal.spread.toFixed(3)}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <SpreadStrength spread={signal.spread} />
                </td>
              </tr>
            ))}
            {signals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="w-12 rounded-full border border-dashed border-border bg-background text-muted-foreground">
                        <Radio className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No signals detected yet
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Signals will appear when the backend detects price
                      discrepancies
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
