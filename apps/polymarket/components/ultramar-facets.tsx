import { ArrowRight, BarChart3, Building2, Landmark } from "lucide-react";
import { BrandName } from "@/components/brand-name";
import {
  ultramarCurrentApp,
  ultramarProductFacets,
} from "@/lib/ultramar-apps";

const facetIcons = {
  capital: Landmark,
  polymarket: BarChart3,
  privateEquities: Building2,
} as const;

export function UltramarFacets() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            <BrandName /> ecosystem
          </p>
          <h2 className="mt-3 text-3xl font-semibold lg:text-4xl">
            One investment platform, three operating surfaces.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            Start with the allocator, inspect the market-neutral signal engine,
            then move into tokenized private-market assets without losing the
            Ultramar context.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ultramarProductFacets.map((facet, index) => {
            const Icon = facetIcons[facet.key];
            const active = facet.key === ultramarCurrentApp;

            return (
              <a
                key={facet.key}
                href={facet.href}
                className={`group flex min-h-[280px] flex-col rounded-lg border p-6 transition-colors ${
                  active
                    ? "border-primary/60 bg-background"
                    : "border-border bg-background/60 hover:border-primary/50"
                }`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                  {facet.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold">
                  {facet.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {facet.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground">
                  {active ? "Current surface" : facet.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
