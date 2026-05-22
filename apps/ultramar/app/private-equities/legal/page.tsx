import { JsonLd } from "@/components/json-ld";
import {
  FeatureCard,
  ProductRouteHeader,
  SurfaceGrid,
  SurfacePanel,
} from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  itemListJsonLd,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";
import { BadgeCheck, ClipboardCheck, FileWarning, LockKeyhole, Scale, UserCheck } from "lucide-react";

const legalPath = "/private-equities/legal";
const description = "Legal and compliance overview for Ultramar Private Equities.";
const legalControls = [
  {
    icon: Scale,
    title: "Regulated offering wrappers",
    body: "Production offerings require issuer-specific documents, appropriate exemptions or registrations, and legal review.",
  },
  {
    icon: BadgeCheck,
    title: "Investor eligibility",
    body: "Investor participation must be gated by KYC, accreditation or suitability, and jurisdictional transfer rules.",
  },
  {
    icon: LockKeyhole,
    title: "Transfer controls",
    body: "Private-market tokens need permissioning, lockups, whitelists, and custody controls before secondary trading.",
  },
  {
    icon: FileWarning,
    title: "No public solicitation shortcut",
    body: "Marketing copy must describe the platform and product workflow without making unmanaged return promises.",
  },
  {
    icon: ClipboardCheck,
    title: "Closing readiness",
    body: "Before a real closing, each issuer needs a final data room, approved term sheet, subscription package, funds-flow memo, and reporting calendar.",
  },
  {
    icon: UserCheck,
    title: "Gated diligence",
    body: "Investor materials should move behind access controls once they include issuer-specific financials, non-public data, or subscription instructions.",
  },
] as const;

export const metadata = createSeoMetadata({
  title: "Private Equities Legal",
  description,
  path: legalPath,
  image: seoImages.privateEquities,
  keywords: ["private equity compliance", "RWA legal", "investor eligibility"],
});

export default function LegalPage() {
  return (
    <>
      <JsonLd
        id="private-equities-legal-json-ld"
        data={[
          webPageJsonLd({ path: legalPath, name: "Ultramar Private Equities Legal", description }),
          itemListJsonLd({
            path: legalPath,
            name: "Ultramar Private Equities legal controls",
            description,
            items: legalControls.map((control) => ({
              name: control.title,
              url: legalPath,
              description: control.body,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Legal", path: legalPath },
          ]),
        ]}
      />

      <ProductRouteHeader
        product="private-equities"
        active="legal"
        eyebrow="Private Equities / Counsel Gate"
        title="Legal and compliance boundaries"
        description="The public product explains the intended operating model without implying unrestricted securities availability."
      />
      <SurfaceGrid columns="md:grid-cols-2">
        {legalControls.map((item) => (
          <FeatureCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
        ))}
      </SurfaceGrid>
      <SurfacePanel padded={false} className="border-t-destructive p-5">
        <FileWarning className="h-5 w-5 text-destructive" />
        <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface">
          Capital acceptance boundary
        </h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Ultramar public pages should not collect funds, publish subscription
          instructions, or treat expressions of interest as binding commitments.
          Those steps belong in a counsel-approved, investor-gated workflow.
        </p>
      </SurfacePanel>
    </>
  );
}
