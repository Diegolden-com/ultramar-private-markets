export type Deal = {
  id: string;
  name: string;
  ticker: string;
  description: string;
  sector: string;
  location: string;
  image: string;
  equityForSale: number;
  valuation: number;
  minInvestment: number;
  apy: number;
  complianceScore: number;
  status: "active" | "closing_soon" | "funded";
  tags: string[];
  type: "primary" | "secondary";
};

export const deals: Deal[] = [
  {
    id: "1",
    name: "CX Laundry",
    ticker: "lcx",
    description:
      "Automated laundromat chain expanding across Mexico City with audited recurring revenue and operational unit economics.",
    sector: "Consumer Services",
    location: "Mexico City, MX",
    image: "/solarpunk-laundromat.png",
    equityForSale: 12.5,
    valuation: 4500000,
    minInvestment: 500,
    apy: 18.4,
    complianceScore: 98,
    status: "active",
    tags: ["Cash flow positive", "Brick and mortar", "Family owned"],
    type: "primary",
  },
  {
    id: "2",
    name: "Nexus Logistics",
    ticker: "NXS.LOG",
    description:
      "Last-mile logistics operator using electrified fleet infrastructure and route optimization for predictable regional growth.",
    sector: "Logistics",
    location: "Sao Paulo, BR",
    image: "/shipping-logistics.png",
    equityForSale: 8,
    valuation: 12000000,
    minInvestment: 1000,
    apy: 14.2,
    complianceScore: 94,
    status: "closing_soon",
    tags: ["High growth", "Tech enabled"],
    type: "primary",
  },
  {
    id: "3",
    name: "Vertex Realty Core",
    ticker: "VRX.RE",
    description:
      "Tokenized commercial real estate portfolio focused on mixed-use developments in durable demand corridors.",
    sector: "Real Estate",
    location: "Austin, USA",
    image: "/industrial-warehouse.png",
    equityForSale: 15,
    valuation: 25000000,
    minInvestment: 2500,
    apy: 9.5,
    complianceScore: 99,
    status: "active",
    tags: ["Asset backed", "Low volatility"],
    type: "secondary",
  },
  {
    id: "4",
    name: "AgroFuture Yield",
    ticker: "AGR.YLD",
    description:
      "Vertical farming infrastructure for high-margin medicinal herbs with controlled harvest cycles and local demand.",
    sector: "Agriculture",
    location: "Bogota, CO",
    image: "/vertical-farming.png",
    equityForSale: 20,
    valuation: 3200000,
    minInvestment: 100,
    apy: 22.1,
    complianceScore: 91,
    status: "active",
    tags: ["ESG", "High yield"],
    type: "secondary",
  },
];

export function findDeal(ticker: string) {
  return deals.find((deal) => deal.ticker.toLowerCase() === ticker.toLowerCase());
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
