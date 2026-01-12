
export type Deal = {
    id: string
    name: string
    ticker: string
    description: string
    sector: string
    location: string
    image: string
    equityForSale: number
    valuation: number
    minInvestment: number
    apy: number
    complianceScore: number
    status: "active" | "closing_soon" | "funded"
    tags: string[]
    type: "primary" | "secondary"
}

export const DEALS: Deal[] = [
    {
        id: "1",
        name: "Lavanderías CX",
        ticker: "lcx",
        description: "Chain of automated laundromats expanding to high-growth sectors. Proven recurring revenue model.",
        sector: "Consumer Services",
        location: "Mexico City, MX",
        image: "/solarpunk-laundromat.png",
        equityForSale: 12.5,
        valuation: 4500000,
        minInvestment: 500,
        apy: 18.4,
        complianceScore: 98,
        status: "active",
        tags: ["Cash Flow Positive", "Brick & Mortar", "Family owned"],
        type: "primary"
    },
    {
        id: "2",
        name: "Nexus Logistics",
        ticker: "NXS.LOG",
        description: "AI-driven last-mile delivery fleet electrification and optimization hub.",
        sector: "Logistics",
        location: "São Paulo, BR",
        image: "/shipping-logistics.png",
        equityForSale: 8.0,
        valuation: 12000000,
        minInvestment: 1000,
        apy: 14.2,
        complianceScore: 94,
        status: "closing_soon",
        tags: ["High Growth", "Tech Enabled"],
        type: "primary"
    },
    {
        id: "3",
        name: "Vertex Realty Core",
        ticker: "VRX.RE",
        description: "Tokenized commercial real estate portfolio focusing on mixed-use developments in emerging tech hubs.",
        sector: "Real Estate",
        location: "Austin, USA",
        image: "/industrial-warehouse.png",
        equityForSale: 15.0,
        valuation: 25000000,
        minInvestment: 2500,
        apy: 9.5,
        complianceScore: 99,
        status: "active",
        tags: ["Asset Backed", "Low Volatility"],
        type: "secondary"
    },
    {
        id: "4",
        name: "AgroFuture Yield",
        ticker: "AGR.YLD",
        description: "Vertical farming infrastructure scaling specifically for high-margin medicinal herbs.",
        sector: "Agriculture",
        location: "Bogotá, CO",
        image: "/vertical-farming.png",
        equityForSale: 20.0,
        valuation: 3200000,
        minInvestment: 100,
        apy: 22.1,
        complianceScore: 91,
        status: "active",
        tags: ["ESG", "High Yield"],
        type: "secondary"
    }
]
