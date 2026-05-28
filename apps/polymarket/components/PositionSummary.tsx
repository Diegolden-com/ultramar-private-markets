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
  let colors = "badge-neutral";
  if (v.includes("polymarket")) colors = "badge-primary";
  else if (v.includes("deribit")) colors = "badge-info";

  return (
    <span
      className={`badge badge-outline ${colors} text-[10px] uppercase tracking-wider`}
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
    <section className="card card-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <Wallet className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Positions</h2>
        </div>
        <span className="badge badge-secondary font-mono text-xs">
          {positions.length}
        </span>
      </div>

      <div className="p-5">
        {/* Exposure card */}
        <div className="stat rounded-lg border border-border bg-background p-4">
          <p className="stat-title text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Total Exposure
          </p>
          <p
            className={`stat-value mt-2 font-mono text-2xl font-semibold font-data ${
              total > 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            ${total.toFixed(2)}
          </p>
        </div>

        {/* Position list */}
        <div className="list mt-5 gap-3">
          {positions.map((pos) => {
            const notional = pos.size * pos.avg_price;
            const barWidth = maxNotional > 0 ? (notional / maxNotional) * 100 : 0;

            return (
              <div
                key={pos.id}
                className="list-row rounded-lg border border-border bg-background p-3"
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
                <progress
                  className="progress progress-primary mt-3 h-1 w-full"
                  value={barWidth}
                  max={100}
                />
              </div>
            );
          })}

          {positions.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <div className="avatar placeholder">
                <div className="w-12 rounded-full border border-dashed border-border bg-background text-muted-foreground">
                  <PackageOpen className="h-6 w-6" />
                </div>
              </div>
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
