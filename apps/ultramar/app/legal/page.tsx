import { BrandText } from "@/components/brand-name";
import { JsonLd } from "@/components/json-ld";
import {
  FeatureCard,
  PageHeader,
  PageShell,
  SplitPanel,
  SurfaceGrid,
} from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { FileWarning, Landmark, LockKeyhole, Scale, ShieldAlert, TerminalSquare } from "lucide-react";
import Link from "next/link";

const legalPath = "/legal";
const description =
  "Legal disclosures for Ultramar.capital covering platform scope, investment limitations, data use, jurisdiction controls, and counsel-gated workflows.";

const disclosures = [
  {
    icon: Scale,
    title: "No investment advice",
    body: "Ultramar.capital pages are product and research surfaces. They do not provide legal, tax, accounting, or investment advice.",
  },
  {
    icon: Landmark,
    title: "Private-market limitations",
    body: "Private-market participation may require offering exemptions, registrations, investor eligibility checks, and issuer-specific documents.",
  },
  {
    icon: FileWarning,
    title: "Forward-looking content",
    body: "Projected returns, yields, timelines, market conditions, and operating milestones are illustrative unless finalized in controlled documents.",
  },
  {
    icon: LockKeyhole,
    title: "Gated materials",
    body: "Non-public financials, subscription instructions, funds-flow details, and allocation decisions belong behind permissioned investor access.",
  },
  {
    icon: TerminalSquare,
    title: "API and data use",
    body: "Public API examples are read-only product telemetry. Production access can require authentication, rate limits, and written integration terms.",
  },
  {
    icon: ShieldAlert,
    title: "Jurisdiction controls",
    body: "Availability can vary by investor location, issuer location, product line, regulatory status, and the counsel-approved offering path.",
  },
] as const;

export const metadata = createSeoMetadata({
  title: "Legal",
  description,
  path: legalPath,
  image: seoImages.platform,
  keywords: ["Ultramar legal", "investment disclosures", "private market legal"],
});

export default function LegalPage() {
  return (
    <PageShell>
      <JsonLd
        id="legal-json-ld"
        data={[
          webPageJsonLd({ path: legalPath, name: "Ultramar.capital Legal", description }),
          itemListJsonLd({
            path: legalPath,
            name: "Ultramar.capital legal disclosures",
            description,
            items: disclosures.map((disclosure) => ({
              name: disclosure.title,
              url: legalPath,
              description: disclosure.body,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Legal", path: legalPath },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Legal register"
        title="Public disclosures and transaction boundaries"
        description="This page keeps general platform disclosures separate from product-specific counsel gates and investor-only documents."
      />

      <SurfaceGrid columns="md:grid-cols-2 xl:grid-cols-3">
        {disclosures.map((disclosure) => (
          <FeatureCard
            key={disclosure.title}
            icon={disclosure.icon}
            title={disclosure.title}
            body={<BrandText>{disclosure.body}</BrandText>}
          />
        ))}
      </SurfaceGrid>

      <SplitPanel
        columns="lg:grid-cols-3"
        contentPadded={false}
        asidePadded={false}
        contentClassName="p-6"
        asideClassName="p-6 lg:col-span-2"
        aside={
          <>
            <p className="text-sm leading-6 text-on-surface-variant">
              If a route describes an issuer, market, signal, model, or operating workflow, that route is still
              only a public product surface. Binding transaction terms require approved documents,
              eligibility checks, and a controlled closing process.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/compliance"
                className="btn btn-outline btn-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
              >
                Compliance controls
              </Link>
              <Link
                href="/private-equities/legal"
                className="btn btn-outline btn-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
              >
                Product legal gate
              </Link>
            </div>
          </>
        }
      >
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          Counsel path
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface">
          Product copy does not replace offering documents.
        </h2>
      </SplitPanel>
    </PageShell>
  );
}
