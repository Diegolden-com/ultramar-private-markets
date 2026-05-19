import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/section-header";
import { averageAbsoluteSpread, samplePositions, sampleSignals, totalExposure } from "@/lib/arbitrage";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { Activity, CircuitBoard, DatabaseZap, Radar, ShieldCheck } from "lucide-react";
import Link from "next/link";

const statusPath = "/system-status";
const description =
  "System status surface for Ultramar.capital public pages, API telemetry, arbitrage signals, private-equities data, and disclosure routes.";

const avgSpread = averageAbsoluteSpread(sampleSignals);
const exposure = totalExposure(samplePositions);

const statusItems = [
  {
    icon: Activity,
    name: "Public web surface",
    status: "Operational",
    detail: "App shell, product routes, research pages, and disclosure pages are available through the canonical public app.",
    href: "/sitemap",
  },
  {
    icon: Radar,
    name: "Arbitrage signals",
    status: "Operational",
    detail: `${sampleSignals.length} sample signals reporting an average absolute spread of ${avgSpread.toFixed(3)}.`,
    href: "/arbitrage-hedge-fund/signals",
  },
  {
    icon: DatabaseZap,
    name: "Portfolio telemetry",
    status: "Operational",
    detail: `Read-only position telemetry is available with modeled exposure of $${exposure.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}.`,
    href: "/api/private-equities/portfolio",
  },
  {
    icon: ShieldCheck,
    name: "Compliance routes",
    status: "Operational",
    detail: "Footer disclosure routes resolve to human-readable pages instead of raw endpoints or missing route shells.",
    href: "/compliance",
  },
] as const;

const incidents = [
  ["Open Incidents", "0"],
  ["Public APIs", "4"],
  ["Footer Routes", "5/5"],
  ["Status Mode", "Read-only"],
] as const;

export const metadata = createSeoMetadata({
  title: "System Status",
  description,
  path: statusPath,
  image: seoImages.platform,
  keywords: ["Ultramar system status", "capital platform uptime", "API status"],
});

export default function SystemStatusPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="system-status-json-ld"
        data={[
          webPageJsonLd({ path: statusPath, name: "Ultramar.capital System Status", description }),
          itemListJsonLd({
            path: statusPath,
            name: "Ultramar.capital status checks",
            description,
            items: statusItems.map((item) => ({
              name: item.name,
              url: item.href,
              description: item.detail,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "System Status", path: statusPath },
          ]),
        ]}
      />

      <section className="grid gap-1 border border-border-muted bg-border-muted lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-surface p-6 md:p-8">
          <SectionHeader
            eyebrow="System monitor"
            title="Public route and telemetry status"
            description="A compact operating surface for checking whether the public routes and read-only API surfaces are wired and discoverable."
          />
        </div>
        <div className="grid grid-cols-1 gap-1 bg-border-muted sm:grid-cols-2">
          {incidents.map(([label, value]) => (
            <div key={label} className="border border-border-muted bg-surface p-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                {label}
              </p>
              <p className="mt-4 font-mono text-lg font-semibold uppercase text-status-signal">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-1 border border-border-muted bg-border-muted">
        {statusItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="grid gap-4 bg-surface p-5 transition-colors hover:bg-surface-container md:grid-cols-[48px_1fr_auto] md:items-center"
          >
            <item.icon className="h-5 w-5 text-status-signal" />
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.detail}</p>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-status-signal">
              <span className="h-2 w-2 bg-status-signal" />
              {item.status}
            </span>
          </Link>
        ))}
      </section>

      <section className="border border-border-muted bg-surface p-6">
        <CircuitBoard className="h-5 w-5 text-status-signal" />
        <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface">
          Status scope
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-on-surface-variant">
          This page reports the availability of public app routes and read-only sample telemetry in
          the current Ultramar.capital app. It is not a broker-dealer, custodian, bank, exchange, or
          production incident-management portal.
        </p>
      </section>
    </main>
  );
}
