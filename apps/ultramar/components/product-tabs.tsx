import Link from "next/link";

const productTabs = {
  "private-equities": [
    { key: "overview", label: "Overview", href: "/private-equities" },
    { key: "assets", label: "Assets", href: "/private-equities/assets" },
    { key: "deals", label: "Deals", href: "/private-equities/deals" },
    { key: "oracle", label: "Oracle", href: "/private-equities/oracle" },
    { key: "market", label: "Market", href: "/private-equities/market" },
    { key: "portfolio", label: "Portfolio", href: "/private-equities/portfolio" },
    { key: "legal", label: "Legal", href: "/private-equities/legal" },
  ],
  "arbitrage-hedge-fund": [
    { key: "overview", label: "Overview", href: "/arbitrage-hedge-fund" },
    { key: "dashboard", label: "Dashboard", href: "/arbitrage-hedge-fund/dashboard" },
    { key: "signals", label: "Signals", href: "/arbitrage-hedge-fund/signals" },
    { key: "risk", label: "Risk", href: "/arbitrage-hedge-fund/risk" },
    { key: "research", label: "Research", href: "/arbitrage-hedge-fund/research" },
  ],
} as const;

type ProductTabMap = typeof productTabs;
type ProductKey = keyof ProductTabMap;

export function ProductTabs<TProduct extends ProductKey>({
  product,
  active,
}: {
  product: TProduct;
  active: ProductTabMap[TProduct][number]["key"];
}) {
  return (
    <nav className="flex overflow-x-auto border border-border-muted bg-surface">
      {productTabs[product].map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`whitespace-nowrap border-r border-border-muted px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors last:border-r-0 ${
              isActive
                ? "border-b-2 border-b-status-signal bg-surface-container text-status-signal"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
