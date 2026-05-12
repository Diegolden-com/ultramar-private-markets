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

export const ultramarSuiteLinks = [
    {
        label: "Capital",
        href: ultramarDomains.capital,
    },
    {
        label: "Polymarket",
        href: ultramarDomains.polymarket,
    },
] as const
