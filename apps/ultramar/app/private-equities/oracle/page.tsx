import { JsonLd } from "@/components/json-ld";
import { OracleConsole } from "@/components/oracle-console";
import { ProductTabs } from "@/components/product-tabs";
import { SectionHeader } from "@/components/section-header";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";

const oraclePath = "/private-equities/oracle";
const description = "Issuer accounting oracle and solvency proof workflow.";

export const metadata = createSeoMetadata({
  title: "Private Equities Oracle",
  description,
  path: oraclePath,
  image: seoImages.privateEquities,
  keywords: ["issuer oracle", "solvency proof", "QuickBooks oracle", "RWA transparency"],
});

export default function OraclePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
      <JsonLd
        id="private-equities-oracle-json-ld"
        data={[
          webPageJsonLd({ path: oraclePath, name: "Ultramar Private Equities Oracle", description }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Oracle", path: oraclePath },
          ]),
        ]}
      />

      <section className="border border-border-muted bg-surface p-6 md:p-8">
        <SectionHeader
          eyebrow="Private Equities / Issuer Oracle"
          title="Oracle"
          description="A bridge between issuer operating data and investor-facing private-market confidence."
        />
      </section>
      <ProductTabs product="private-equities" active="oracle" />
      <section>
        <OracleConsole />
      </section>
    </main>
  );
}
