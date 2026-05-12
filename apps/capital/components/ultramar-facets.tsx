import { ArrowRight, BarChart3, Building2, Landmark } from "lucide-react"
import {
  ultramarCurrentApp,
  ultramarProductFacets,
} from "@/lib/ultramar-apps"

const facetIcons = {
  capital: Landmark,
  polymarket: BarChart3,
  privateEquities: Building2,
} as const

export function UltramarFacets() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-accent">
            Ultramar.capital ecosystem
          </p>
          <h2 className="font-serif text-4xl font-semibold sm:text-5xl">
            One investment platform, three operating surfaces.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Start with the allocator, inspect the market-neutral signal engine,
            then move into tokenized private-market assets without losing the
            Ultramar context.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ultramarProductFacets.map((facet, index) => {
            const Icon = facetIcons[facet.key]
            const active = facet.key === ultramarCurrentApp

            return (
              <a
                key={facet.key}
                href={facet.href}
                className={`group flex min-h-[280px] flex-col border p-6 transition-colors ${
                  active
                    ? "border-accent bg-background"
                    : "border-border bg-background/60 hover:border-accent"
                }`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border border-border bg-muted">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  {facet.eyebrow}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-semibold">
                  {facet.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {facet.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground">
                  {active ? "Current surface" : facet.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
