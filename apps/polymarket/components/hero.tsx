import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const SAMPLE_SIGNALS = [
  { market: "BTC-28MAR-100K", implied: 0.342, theo: 0.418, spread: +0.076 },
  { market: "ETH-28MAR-4500", implied: 0.281, theo: 0.195, spread: -0.086 },
  { market: "BTC-25APR-120K", implied: 0.156, theo: 0.203, spread: +0.047 },
  { market: "ETH-25APR-5000", implied: 0.094, theo: 0.071, spread: -0.023 },
  { market: "BTC-30MAY-150K", implied: 0.067, theo: 0.112, spread: +0.045 },
];

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-1">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-signal-negative/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-signal-neutral/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-signal-positive/60" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          ultramar — signal-feed
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-signal-positive">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-positive animate-terminal-pulse" />
          LIVE
        </span>
      </div>

      {/* Terminal body */}
      <div className="overflow-hidden bg-background/50 p-0">
        <table className="w-full text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">MARKET</th>
              <th className="px-4 py-2.5 font-medium text-right">IMPLIED</th>
              <th className="px-4 py-2.5 font-medium text-right">THEO</th>
              <th className="px-4 py-2.5 font-medium text-right">SPREAD</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_SIGNALS.map((s, i) => (
              <tr
                key={s.market}
                className={`border-b border-border/50 animate-fade-in-up delay-${i + 1}`}
              >
                <td className="px-4 py-2.5 text-foreground">{s.market}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground font-data">
                  {s.implied.toFixed(3)}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground font-data">
                  {s.theo.toFixed(3)}
                </td>
                <td className="px-4 py-2.5 text-right font-data">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      s.spread >= 0 ? "text-signal-positive" : "text-signal-negative"
                    }`}
                  >
                    {s.spread >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {s.spread >= 0 ? "+" : ""}
                    {s.spread.toFixed(3)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
