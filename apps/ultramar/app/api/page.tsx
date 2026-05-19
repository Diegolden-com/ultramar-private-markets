import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/section-header";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { Database, Gauge, RadioTower, ShieldCheck } from "lucide-react";
import Link from "next/link";

const apiPath = "/api";
const description =
  "Public API directory for Ultramar.capital read-only product telemetry across arbitrage signals, positions, private-equities portfolio data, and oracle scoring.";

const endpoints = [
  {
    method: "GET",
    path: "/api/arbitrage/signals",
    title: "Arbitrage signals",
    body: "Sample Polymarket-first signal feed with implied probability, model probability, spread, confidence, and status fields.",
  },
  {
    method: "GET",
    path: "/api/arbitrage/positions",
    title: "Arbitrage positions",
    body: "Read-only position inventory used by the public dashboard and signal pages for product telemetry.",
  },
  {
    method: "GET",
    path: "/api/private-equities/portfolio",
    title: "Private-equities portfolio",
    body: "Portfolio summary endpoint for tokenized private-market asset balances, prices, values, and day-change data.",
  },
  {
    method: "GET",
    path: "/api/private-equities/oracle/score",
    title: "Oracle score",
    body: "Issuer oracle scoring sample for the private-equities operating-data console.",
  },
] as const;

const principles = [
  {
    icon: ShieldCheck,
    title: "Read-only public surface",
    body: "The listed endpoints expose product telemetry only. Transactional, investor, issuer, and admin workflows require controlled access.",
  },
  {
    icon: Gauge,
    title: "Stable route names",
    body: "Endpoint paths are explicit by product line so crawlers, dashboards, and reviewers can distinguish arbitrage from private-equities data.",
  },
  {
    icon: RadioTower,
    title: "Status pairing",
    body: "API availability should be reviewed alongside the system-status page rather than inferred from a single product screen.",
  },
] as const;

export const metadata = createSeoMetadata({
  title: "API",
  description,
  path: apiPath,
  image: seoImages.platform,
  keywords: ["Ultramar API", "capital platform API", "Polymarket signals API", "issuer oracle API"],
});

export default function ApiPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="api-json-ld"
        data={[
          webPageJsonLd({ path: apiPath, name: "Ultramar.capital API", description }),
          itemListJsonLd({
            path: apiPath,
            name: "Ultramar.capital public API endpoints",
            description,
            items: endpoints.map((endpoint) => ({
              name: endpoint.title,
              url: endpoint.path,
              description: endpoint.body,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "API", path: apiPath },
          ]),
        ]}
      />

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-surface p-6 md:p-8">
          <SectionHeader
            eyebrow="API directory"
            title="Read-only product telemetry"
            description="The public API index makes machine routes discoverable without sending footer traffic directly into raw JSON."
          />
        </div>
        <div className="border border-border-muted bg-surface p-6 md:p-8">
          <Database className="h-5 w-5 text-status-signal" />
          <p className="mt-4 text-sm leading-6 text-on-surface-variant">
            These endpoints are public product samples. Production integrations should expect authentication,
            rate limits, contractual terms, and product-specific permissions.
          </p>
        </div>
      </section>

      <section className="grid gap-1 border border-border-muted bg-border-muted">
        {endpoints.map((endpoint) => (
          <Link
            key={endpoint.path}
            href={endpoint.path}
            className="grid gap-4 bg-surface p-5 transition-colors hover:bg-surface-container md:grid-cols-[160px_1fr_auto] md:items-center"
          >
            <div>
              <span className="border border-status-signal px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-status-signal">
                {endpoint.method}
              </span>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                {endpoint.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{endpoint.body}</p>
            </div>
            <code className="font-mono text-[11px] font-medium text-on-surface-variant">
              {endpoint.path}
            </code>
          </Link>
        ))}
      </section>

      <section className="grid gap-1 bg-border-muted md:grid-cols-3">
        {principles.map((principle) => (
          <article key={principle.title} className="border border-border-muted bg-surface p-5">
            <principle.icon className="h-5 w-5 text-status-signal" />
            <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface">
              {principle.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{principle.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
