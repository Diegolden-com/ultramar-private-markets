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
    <nav
      className="tabs tabs-border flex-nowrap overflow-x-auto border-x border-t border-border-muted bg-surface"
      aria-label={`${productRouteGroups[product].title} routes`}
    >
      {productRouteGroups[product].links.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            role="tab"
            aria-selected={isActive}
            className={`tab h-auto min-h-11 whitespace-nowrap border-r border-r-border-muted font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors last:border-r-0 ${
              isActive
                ? "tab-active bg-surface-container text-primary"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
