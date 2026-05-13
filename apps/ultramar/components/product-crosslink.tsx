import { productBySlug, type ProductSlug } from "@ultramar/product-model";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ProductCrosslink({ current }: { current: ProductSlug }) {
  const target =
    current === "private-equities"
      ? productBySlug["arbitrage-hedge-fund"]
      : productBySlug["private-equities"];

  return (
    <section className="border-t border-border bg-muted/35">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Also on Ultramar.capital
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{target.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {target.shortDescription}
          </p>
        </div>
        <Link
          href={target.href}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
        >
          View Product
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
