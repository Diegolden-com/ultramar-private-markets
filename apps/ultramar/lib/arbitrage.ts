export type Signal = {
  id: number;
  market: string;
  venue: string;
  impliedProb: number;
  theoreticalProb: number;
  spread: number;
  confidence: "High" | "Medium" | "Watch";
  status: "Active" | "Sizing" | "Monitoring";
  updatedAt: string;
};

export type Position = {
  id: number;
  venue: string;
  market: string;
  size: number;
  avgPrice: number;
  hedge: string;
};

export const sampleSignals: Signal[] = [
  {
    id: 101,
    market: "US election popular vote share above threshold",
    venue: "Polymarket",
    impliedProb: 0.42,
    theoreticalProb: 0.48,
    spread: 0.06,
    confidence: "High",
    status: "Active",
    updatedAt: "2m ago",
  },
  {
    id: 102,
    market: "BTC closes above weekly volatility band",
    venue: "Polymarket",
    impliedProb: 0.31,
    theoreticalProb: 0.36,
    spread: 0.05,
    confidence: "Medium",
    status: "Sizing",
    updatedAt: "8m ago",
  },
  {
    id: 103,
    market: "ETH ETF flow exceeds consensus range",
    venue: "Polymarket",
    impliedProb: 0.57,
    theoreticalProb: 0.53,
    spread: -0.04,
    confidence: "Watch",
    status: "Monitoring",
    updatedAt: "14m ago",
  },
];

export const samplePositions: Position[] = [
  {
    id: 1,
    venue: "Polymarket",
    market: "Election probability basket",
    size: 18000,
    avgPrice: 0.42,
    hedge: "Deribit BTC vol proxy",
  },
  {
    id: 2,
    venue: "Polymarket",
    market: "Macro data event basket",
    size: 9500,
    avgPrice: 0.31,
    hedge: "USDC cash reserve",
  },
];

export function averageAbsoluteSpread(signals: Signal[]) {
  if (signals.length === 0) return 0;
  return signals.reduce((sum, signal) => sum + Math.abs(signal.spread), 0) / signals.length;
}

export function totalExposure(positions: Position[]) {
  return positions.reduce((sum, position) => sum + position.size * position.avgPrice, 0);
}
