import { OracleConsole } from "@/components/oracle-console";
import { ProductTabs } from "@/components/product-tabs";
import { SectionHeader } from "@/components/section-header";
import { createSeoMetadata, seoImages } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Private Equities Oracle",
  description: "Issuer accounting oracle and solvency proof workflow.",
  path: "/private-equities/oracle",
  image: seoImages.privateEquities,
  keywords: ["issuer oracle", "solvency proof", "QuickBooks oracle", "RWA transparency"],
});

export default function OraclePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 bg-surface-ink px-4 py-8 text-on-surface md:px-12">
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
