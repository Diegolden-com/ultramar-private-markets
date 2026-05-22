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
    <nav className="flex flex-nowrap overflow-x-auto border-x border-t border-border-muted bg-surface">
      {productRouteGroups[product].links.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`whitespace-nowrap border-r border-b-2 border-r-border-muted px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors last:border-r-0 ${
              isActive
                ? "border-b-primary bg-surface-container text-primary"
                : "border-b-border-muted text-on-surface-variant hover:bg-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
