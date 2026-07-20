export type Deal = {
  id: string;
  name: string;
  legalName?: string;
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
  capitalRaise?: CapitalRaise;
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
    legalName: "Issuer vehicle pending counsel review",
    ticker: "lcx",
    description:
      "Automated laundromat chain preparing a counsel-gated expansion round across Mexico City with recurring revenue, unit economics, and operating data moving into investor diligence.",
    sector: "Consumer Services",
    location: "Mexico City, MX",
    image: "/solarpunk-laundromat.png",
    equityForSale: 12.5,
    valuation: 4500000,
    minInvestment: 500,
    apy: 18.4,
    complianceScore: 98,
    status: "active",
    tags: ["Expansion round", "Brick and mortar", "Oracle-ready"],
    type: "primary",
    capitalRaise: {
      roundTitle: "Mexico City unit expansion round",
      roundStatus: "Data room buildout",
      targetRaise: 560000,
      closingWindow: "Counsel-gated before commitments",
      instrument: "Preferred equity or revenue-share note, pending counsel",
      investorProfile:
        "Eligible private-market investors after KYC/KYB, suitability, and jurisdiction review.",
      diligenceStatus: "Operating proof pack in progress",
      summary:
        "Lavanderias CX needs a capital-ready package before Ultramar can introduce eligible investors to the opportunity. Public materials should build confidence, while actual subscriptions remain gated until counsel approves the offering path, documents, eligibility rules, and transfer controls.",
      useOfFunds: [
        {
          label: "New-store capex",
          percent: 48,
          body: "Buildout, lease deposits, utility work, and opening inventory for additional laundromat units.",
        },
        {
          label: "Equipment and maintenance",
          percent: 22,
          body: "Commercial washers, dryers, payment systems, spares, and preventive maintenance reserves.",
        },
        {
          label: "Working capital",
          percent: 16,
          body: "Payroll, detergents, water, electricity, marketing ramp, and early operating float.",
        },
        {
          label: "Compliance and data room",
          percent: 8,
          body: "Legal review, investor materials, eligibility checks, and issuer reporting controls.",
        },
        {
          label: "Contingency reserve",
          percent: 6,
          body: "Buffer for construction delays, equipment downtime, and supplier price movement.",
        },
      ],
      proofPoints: [
        "Brick-and-mortar service with tangible equipment and local demand drivers.",
        "Round economics can be tied to store-level deployment milestones instead of vague platform growth.",
        "Issuer oracle path can convert accounting exports into investor-facing solvency and liquidity context.",
        "Minimum-ticket access can remain private and gated while public materials explain the asset clearly.",
      ],
      milestones: [
        {
          label: "Data room lock",
          timing: "T-30",
          body: "Complete legal entity, cap table, financial, lease, tax, insurance, and permit folders.",
        },
        {
          label: "Counsel approval",
          timing: "T-21",
          body: "Select exemption or registration path, finalize offering documents, and approve public language.",
        },
        {
          label: "Investor access",
          timing: "T-14",
          body: "Open gated diligence access only for verified investors and track Q&A centrally.",
        },
        {
          label: "Closing readiness",
          timing: "T-0",
          body: "Subscription package, funds flow, allocation table, transfer restrictions, and first update calendar are ready.",
        },
      ],
      investorProcess: [
        {
          label: "Request access",
          body: "Investor submits interest through Ultramar; no money or binding commitment is accepted publicly.",
        },
        {
          label: "Eligibility screen",
          body: "KYC/KYB, investor category, jurisdiction, suitability, and transfer-control checks are completed before diligence access.",
        },
        {
          label: "Data room review",
          body: "Verified investors receive issuer materials, Q&A, oracle context, and round economics in a tracked review process.",
        },
        {
          label: "Subscription",
          body: "Only after counsel approval, investors receive final documents, allocation, funds-flow instructions, and closing conditions.",
        },
      ],
      crmStages: [
        "Interest",
        "Eligibility",
        "NDA",
        "Diligence",
        "Allocation",
        "Subscription",
        "Closed",
      ],
      risks: [
        "Offering path risk: marketing, eligibility, and acceptance of funds must match the selected securities framework.",
        "Execution risk: new-store buildout can slip because of leases, permits, utilities, or equipment lead times.",
        "Concentration risk: early performance may depend on a small number of operating sites and neighborhoods.",
        "Cash reconciliation risk: store-level revenue, expenses, and bank activity must reconcile cleanly before investor reporting.",
        "Currency risk: USD investor materials and MXN operating cash flows need an explicit FX policy.",
      ],
      missingBeforeClose: [
        "Approved legal offering path and counsel-reviewed public/private investor copy.",
        "Final issuer entity, cap table, board approvals, and authorized signers.",
        "Clean 24-month financial package or a clearly explained shorter operating history.",
        "Store-level KPI export with repeatable oracle mapping and exception handling.",
        "Investor eligibility checks, subscription package, funds-flow memo, and post-close reporting calendar.",
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

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
