import {
  averageAbsoluteSpread,
  samplePositions,
  sampleSignals,
  totalExposure,
  type Position,
  type Signal,
} from "@/lib/arbitrage";
import { Activity, BarChart3, Shield, Wallet } from "lucide-react";
import { MetricCard } from "./metric-card";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchBackend<T>(path: string, fallback: T): Promise<T> {
  if (!baseUrl) return fallback;

  try {
    const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const data = (await response.json()) as T;
    return Array.isArray(data) && data.length === 0 ? fallback : data;
  } catch {
    return fallback;
  }
}

export async function SignalDashboard() {
  const [signals, positions] = await Promise.all([
    fetchBackend<Signal[]>("/signals", sampleSignals),
    fetchBackend<Position[]>("/positions", samplePositions),
  ]);

  const exposure = totalExposure(positions);
  const avgSpread = averageAbsoluteSpread(signals);

  return (
    <div className="space-y-1">
      <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Signals"
          value={signals.length.toString()}
          detail="Active or monitored dislocations"
          icon={Activity}
        />
        <MetricCard
          label="Avg spread"
          value={avgSpread.toFixed(3)}
          detail="Absolute probability spread"
          icon={BarChart3}
        />
        <MetricCard
          label="Exposure"
          value={`$${exposure.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          detail="Current notional sizing"
          icon={Wallet}
        />
        <MetricCard
          label="Guardrails"
          value="Live"
          detail="Sizing and concentration checks"
          icon={Shield}
        />
      </div>

      <div className="grid gap-1 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 border border-border-muted bg-surface">
          <div className="border-b border-border-muted p-4">
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
              Signal Board
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Polymarket prices normalized against derivatives-implied probabilities.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left font-mono text-sm">
              <thead className="border-b border-border-muted bg-surface-container-low text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3 font-medium">Market</th>
                  <th className="px-4 py-3 font-medium">Implied</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">Spread</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr key={signal.id} className="border-b border-border-muted last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-on-surface">{signal.market}</p>
                      <p className="mt-1 text-[11px] text-on-surface-variant">
                        {signal.venue} / {signal.updatedAt}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-on-surface">{formatProb(signal.impliedProb)}</td>
                    <td className="px-4 py-3 text-on-surface">
                      {formatProb(signal.theoreticalProb)}
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        signal.spread > 0 ? "text-status-signal" : "text-destructive"
                      }`}
                    >
                      {signal.spread > 0 ? "+" : ""}
                      {signal.spread.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-on-surface">{signal.confidence}</td>
                    <td className="px-4 py-3">
                      <span className="border border-border-muted bg-surface-ink px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                        {signal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="min-w-0 border border-border-muted bg-surface p-4">
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
            Position Summary
          </h2>
          <div className="mt-5 space-y-4">
            {positions.map((position) => (
              <div key={position.id} className="border border-border-muted bg-surface-ink p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{position.market}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
                      {position.venue}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-on-surface">
                    ${(position.size * position.avgPrice).toLocaleString("en-US")}
                  </span>
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
                  Hedge: {position.hedge}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatProb(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
