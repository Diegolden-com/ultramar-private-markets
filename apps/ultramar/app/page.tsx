import { MetricCard } from "@/components/metric-card";
import { SectionHeader } from "@/components/section-header";
import { products } from "@ultramar/product-model";
import { ArrowRight, BarChart3, BriefcaseBusiness, ShieldCheck, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src="/abstract-financial-growth-chart-geometric-shapes.jpg"
          alt="Institutional financial growth chart"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/72" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl text-background">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Ultramar.capital
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Two capital products, one institutional surface.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/78">
              Ultramar.capital is the umbrella platform for Private Equities and
              a Polymarket-first Arbitrage Hedge Fund. The home explains the
              relationship, then routes allocators to the right product.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/private-equities"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Private Equities
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/arbitrage-hedge-fund"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background hover:bg-background hover:text-foreground"
              >
                Arbitrage Hedge Fund
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
          <MetricCard
            label="Public taxonomy"
            value="2 products"
            detail="Capital is the platform layer, not a third product."
            icon={Target}
          />
          <MetricCard
            label="Fund focus"
            value="Polymarket"
            detail="Arbitrage Hedge Fund v1 is prediction-market arbitrage."
            icon={BarChart3}
          />
          <MetricCard
            label="Private market"
            value="RWA rail"
            detail="Issuer, asset, oracle, market, and portfolio workflows."
            icon={ShieldCheck}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeader
          eyebrow="Products"
          title="A clear split for investors and operators"
          description="The interface presents Private Equities and Arbitrage Hedge Fund as the only product choices. Shared navigation keeps context visible across both."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {products.map((product, index) => (
            <Link
              key={product.slug}
              href={product.href}
              className="group grid overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative min-h-72 border-b border-border md:border-b-0 md:border-r">
                <Image
                  src={
                    index === 0
                      ? "/solarpunk-laundromat.png"
                      : "/abstract-financial-growth-chart-geometric-shapes.jpg"
                  }
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {product.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-semibold">{product.name}</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-6 grid gap-4 border-t border-border pt-5">
                  <ProductFact label="For" value={product.audience} />
                  <ProductFact label="Problem" value={product.problem} />
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {product.primaryCta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Operating model"
            title="One brand system, shared routes, product-specific workflows"
            description="Every product page answers what it is, who it serves, what workflow it owns, and where the other product fits."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Shared header and footer across every public route",
              "Canonical SEO on ultramar.capital only",
              "Legacy subdomains redirected into the mega app",
              "Product copy avoids presenting Capital as a third offer",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-card p-5">
                <BriefcaseBusiness className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6">{value}</p>
    </div>
  );
}
