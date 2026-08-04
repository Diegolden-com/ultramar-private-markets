export type Deal = {
  id: string;
  name: string;
  legalName?: string;
  ticker: string;
  description: string;
  sector: string;
  location: string;
  image: string;
  equityForSale?: number;
  valuation?: number;
  minInvestment?: number;
  apy?: number;
  complianceScore?: number;
  status: "preparing" | "active" | "closing_soon" | "funded";
  tags: string[];
  type: "primary" | "secondary";
  capitalRaise?: CapitalRaise;
  secondarySale?: SecondarySale;
};

export type CapitalRaise = {
  roundTitle: string;
  roundStatus: string;
  targetRaise: number;
  closingWindow: string;
  instrument: string;
  investorProfile: string;
  diligenceStatus: string;
  summary: string;
  useOfFunds: UseOfFundsItem[];
  proofPoints: string[];
  milestones: Milestone[];
  investorProcess: InvestorProcessStep[];
  crmStages: string[];
  risks: string[];
  missingBeforeClose: string[];
};

export type UseOfFundsItem = {
  label: string;
  percent: number;
  body: string;
};

export type SecondarySale = {
  title: string;
  status: string;
  structure: string;
  equityPathway: string;
  termsStatus: string;
  investorProfile: string;
  diligenceStatus: string;
  summary: string;
  diligenceFocus: string[];
  transferProcess: InvestorProcessStep[];
  risks: string[];
  missingBeforeReview: string[];
};

export type Milestone = {
  label: string;
  timing: string;
  body: string;
};

export type InvestorProcessStep = {
  label: string;
  body: string;
};

export const deals: Deal[] = [
  {
    id: "1",
    name: "Lavanderias CX",
    ticker: "lcx",
    description:
      "Potential secondary transfer of existing Lavanderias CX equity. Cartuja is already built; operating performance and its early ramp remain diligence topics.",
    sector: "Consumer Services",
    location: "Mexico City, MX",
    image: "/solarpunk-laundromat.png",
    status: "preparing",
    tags: ["Secondary transfer", "No SPV", "Not live"],
    type: "secondary",
    secondarySale: {
      title: "LCX secondary transfer review",
      status: "Data room buildout · not a live offer",
      structure: "Potential transfer of existing Lavanderias CX equity directly from current holders. No SPV is contemplated.",
      equityPathway: "Existing holders only. No new Lavanderias CX equity is being issued.",
      termsStatus: "Price, percentage, buyer rights, and transfer mechanics are not published and require seller, issuer, and counsel review.",
      investorProfile:
        "Eligible private-market investors after KYC/KYB, suitability, jurisdiction, and issuer transfer-control review.",
      diligenceStatus: "Operating and ownership proof pack in progress",
      summary:
        "Ultramar is preparing a controlled diligence workspace for a possible secondary transfer. It is not accepting allocations, subscriptions, funds, or transfer instructions.",
      diligenceFocus: [
        "Ownership, seller authority, current debt, and transfer restrictions.",
        "Chain-level financials, store-level operating metrics, and cash reconciliation.",
        "Cartuja's post-build operating ramp and the network's capacity to absorb early losses.",
        "Leases, permits, insurance, and the repeatability of investor reporting.",
      ],
      transferProcess: [
        {
          label: "Request access",
          body: "An investor requests diligence access. No money, allocation, subscription, or binding transfer instruction is accepted here.",
        },
        {
          label: "Eligibility screen",
          body: "KYC/KYB, investor category, jurisdiction, suitability, and issuer transfer-control checks are completed before document access.",
        },
        {
          label: "Data room review",
          body: "Approved reviewers receive ownership, operating, and legal documents through the controlled data room.",
        },
        {
          label: "Transfer review",
          body: "Only after seller, issuer, and counsel approval can any transaction documents, transfer restrictions, and settlement mechanics be discussed.",
        },
      ],
      risks: [
        "Transfer-control risk: seller authority, issuer consent, buyer eligibility, and any restrictions must be verified before a transfer can proceed.",
        "Operating risk: Cartuja is built but its early operating performance, as well as the network's loss-absorption capacity, must be evidenced.",
        "Concentration risk: early performance may depend on a small number of operating sites and neighborhoods.",
        "Cash reconciliation risk: store-level revenue, expenses, and bank activity must reconcile cleanly before investor reporting.",
        "Currency risk: USD investor materials and MXN operating cash flows need an explicit FX policy.",
      ],
      missingBeforeReview: [
        "Final legal issuer name, cap table, seller authority, issuer consent requirements, and transfer restrictions.",
        "Clean 24-month financial package or a clearly explained shorter operating history.",
        "Store-level KPI export with repeatable oracle mapping and exception handling.",
        "Counsel-reviewed transfer documents, buyer eligibility process, settlement mechanics, and post-transfer reporting calendar.",
      ],
    },
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

export type DealListingMetric = {
  label: string;
  value: string;
};

export function getDealListingMetrics(deal: Deal): DealListingMetric[] {
  if (deal.secondarySale) {
    return [
      { label: "Structure", value: "Secondary" },
      { label: "Equity pathway", value: "Existing holders" },
      { label: "Status", value: "Not live" },
      { label: "Terms", value: "Not published" },
    ];
  }

  if (deal.capitalRaise) {
    return [
      { label: "Valuation", value: formatCurrency(deal.valuation) },
      { label: "Raise", value: formatCurrency(deal.capitalRaise.targetRaise) },
      { label: "Score", value: deal.complianceScore?.toString() ?? "—" },
      { label: "Minimum", value: formatCurrency(deal.minInvestment) },
    ];
  }

  return [
    { label: "Valuation", value: formatCurrency(deal.valuation) },
    { label: "Target", value: deal.apy === undefined ? "—" : `${deal.apy}%` },
    { label: "Score", value: deal.complianceScore?.toString() ?? "—" },
    { label: "Minimum", value: formatCurrency(deal.minInvestment) },
  ];
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "Not disclosed";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
