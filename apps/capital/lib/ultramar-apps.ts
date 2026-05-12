export const ultramarDomains = {
  capital:
    process.env.NEXT_PUBLIC_ULTRAMAR_CAPITAL_URL ??
    "https://capital.ultramar.capital",
  polymarket:
    process.env.NEXT_PUBLIC_ULTRAMAR_POLYMARKET_URL ??
    "https://polymarket.ultramar.capital",
  privateEquities:
    process.env.NEXT_PUBLIC_ULTRAMAR_PRIVATE_EQUITIES_URL ??
    "https://private-equities.ultramar.capital",
} as const

export const ultramarCurrentApp = "capital"

export const ultramarProductFacets = [
  {
    key: "capital",
    label: "Capital",
    eyebrow: "Allocator",
    title: "Portfolio allocator",
    href: "/app",
    cta: "View strategies",
    description:
      "The investor-facing gateway for comparing the Ultramar strategy suite, risk notes, and portfolio views.",
  },
  {
    key: "polymarket",
    label: "Polymarket",
    href: ultramarDomains.polymarket,
    eyebrow: "Signals",
    title: "Event-market alpha",
    cta: "Open signals",
    description:
      "A quantitative dashboard for Polymarket probability dislocations, Deribit context, and execution monitoring.",
  },
  {
    key: "privateEquities",
    label: "Private Equities",
    href: ultramarDomains.privateEquities,
    eyebrow: "Private markets",
    title: "Tokenized real assets",
    cta: "Explore assets",
    description:
      "The RWA rail for issuer data, solvency proofs, permissioned assets, and secondary-market experiments.",
  },
] as const

export const ultramarSuiteLinks = ultramarProductFacets.filter(
  (app) => app.key !== ultramarCurrentApp,
)
