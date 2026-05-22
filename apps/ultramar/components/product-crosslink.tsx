import { BrandName } from "@/components/brand-name";
import { productBySlug, type ProductSlug } from "@ultramar/product-model";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ProductCrosslink({ current }: { current: ProductSlug }) {
  const target =
    current === "private-equities"
      ? productBySlug["arbitrage-hedge-fund"]
      : productBySlug["private-equities"];

  return (
    <section className="border-t border-border-muted bg-surface-container-lowest">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-12">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
            Also on <BrandName />
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-on-surface">
            {target.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            {target.shortDescription}
          </p>
        </div>
        <Link
          href={target.href}
          className="btn btn-outline btn-success w-fit font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
        >
          View Product
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
