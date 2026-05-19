import { productRouteGroups, type ProductTabKey } from "@/lib/site-navigation";
import type { ProductSlug } from "@ultramar/product-model";
import Link from "next/link";

export function ProductTabs<TProduct extends ProductSlug>({
  product,
  active,
}: {
  product: TProduct;
  active: ProductTabKey<TProduct>;
}) {
  return (
    <nav className="tabs tabs-border tabs-sm flex-nowrap overflow-x-auto border border-border-muted bg-surface">
      {productRouteGroups[product].links.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`tab h-auto whitespace-nowrap border-r border-border-muted px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors last:border-r-0 ${
              isActive
                ? "tab-active border-b-2 border-b-status-signal bg-surface-container text-status-signal"
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
