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
      className="tabs tabs-border card card-border flex min-h-12 max-w-full flex-nowrap justify-start overflow-x-auto overscroll-x-contain bg-surface"
      aria-label={`${productRouteGroups[product].title} navigation`}
      role="tablist"
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
            className={`tab h-auto min-h-12 min-w-fit snap-start whitespace-nowrap border-r border-r-border-muted px-5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] transition-colors last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:text-[11px] ${
              isActive
                ? "tab-active bg-surface-container-low text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
