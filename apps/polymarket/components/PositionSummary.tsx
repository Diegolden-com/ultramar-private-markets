import { Badge } from "@/components/ui/badge";
import { Wallet, PackageOpen } from "lucide-react";

type Position = {
  id: number;
  venue: string;
  size: number;
  avg_price: number;
};

type Props = {
  positions: Position[];
};

function VenueBadge({ venue }: { venue: string }) {
  const v = venue.toLowerCase();
  let colors = "bg-muted text-muted-foreground";
  if (v.includes("polymarket")) colors = "bg-primary/15 text-primary";
  else if (v.includes("deribit")) colors = "bg-chart-2/15 text-chart-2";

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${colors}`}
    >
      {venue}
    </span>
  );
}

export default function PositionSummary({ positions }: Props) {
  const total = positions.reduce(
    (acc, pos) => acc + pos.size * pos.avg_price,
    0,
  );

  const maxNotional =
    positions.length > 0
      ? Math.max(...positions.map((p) => p.size * p.avg_price))
      : 1;

  return (
    <section className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <Wallet className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Positions</h2>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {positions.length}
        </Badge>
      </div>

      <div className="p-5">
        {/* Exposure card */}
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Total Exposure
          </p>
          <p
            className={`mt-2 font-mono text-2xl font-semibold font-data ${
              total > 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            ${total.toFixed(2)}
          </p>
        </div>

        {/* Position list */}
        <div className="mt-5 space-y-3">
          {positions.map((pos) => {
            const notional = pos.size * pos.avg_price;
            const barWidth = maxNotional > 0 ? (notional / maxNotional) * 100 : 0;

            return (
              <div
                key={pos.id}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <VenueBadge venue={pos.venue} />
                    <p className="mt-2 font-mono text-sm font-data text-foreground">
                      {pos.size} units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold font-data text-foreground">
                      ${pos.avg_price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      avg price
                    </p>
                  </div>
                </div>
                {/* Size bar */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/60 transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}

          {positions.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <PackageOpen className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No open positions
              </p>
              <p className="text-xs text-muted-foreground/70">
                Positions will appear when trades are executed
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
