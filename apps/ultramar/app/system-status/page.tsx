import { JsonLd } from "@/components/json-ld";
import { PageHeader, PageShell, StatTile, SurfaceGrid } from "@/components/page-layout";
import { averageAbsoluteSpread, samplePositions, sampleSignals, totalExposure } from "@/lib/arbitrage";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { Activity, DatabaseZap, Radar, ShieldCheck } from "lucide-react";
import Link from "next/link";

const statusPath = "/system-status";
const description =
  "System status for Ultramar.capital availability, read-only reference feeds, arbitrage examples, private-equities data, and disclosures.";

const avgSpread = averageAbsoluteSpread(sampleSignals);
const exposure = totalExposure(samplePositions);

const statusItems = [
  {
    icon: Activity,
    name: "Website availability",
    status: "Operational",
    detail: "Product areas, research, disclosures, and public navigation are responding normally.",
    href: "/sitemap",
  },
  {
    icon: Radar,
    name: "Arbitrage signals",
    status: "Operational",
    detail: `${sampleSignals.length} reference signals available with an average absolute spread of ${avgSpread.toFixed(3)}.`,
    href: "/arbitrage-hedge-fund/signals",
  },
  {
    icon: DatabaseZap,
    name: "Portfolio data",
    status: "Operational",
    detail: `Read-only reference position data is available with modeled exposure of $${exposure.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}.`,
    href: "/api/private-equities/portfolio",
  },
  {
    icon: ShieldCheck,
    name: "Compliance materials",
    status: "Operational",
    detail: "Legal, compliance, and sitemap materials are available for reviewer reference.",
    href: "/compliance",
  },
] as const;

const incidents = [
  ["Open Incidents", "0"],
  ["Data Feeds", "4"],
  ["Disclosure Links", "3"],
  ["Status Mode", "Read-only"],
] as const;

export const metadata = createSeoMetadata({
  title: "System Status",
  description,
  path: statusPath,
  image: seoImages.platform,
  keywords: ["Ultramar system status", "capital platform uptime", "API status"],
  noIndex: true,
});

export default function SystemStatusPage() {
  return (
    <PageShell>
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

      <PageHeader
        eyebrow="System monitor"
        title="System status"
        asidePadded={false}
        asideClassName="grid grid-cols-1 gap-1 bg-border-muted sm:grid-cols-2"
      >
        {incidents.map(([label, value]) => (
          <StatTile key={label} label={label} value={value} tone="signal" />
        ))}
      </PageHeader>

      <SurfaceGrid bordered>
        {statusItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="card card-border grid gap-4 bg-surface p-5 transition-colors hover:bg-surface-container md:grid-cols-[48px_1fr_auto] md:items-center"
          >
            <item.icon className="h-5 w-5 text-status-signal" />
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                {item.name}
              </h2>
            </div>
            <span className="badge badge-outline badge-success gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
              <span className="status status-success" />
              {item.status}
            </span>
          </Link>
        ))}
      </SurfaceGrid>
    </PageShell>
  );
}
