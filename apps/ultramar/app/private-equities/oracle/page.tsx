import { JsonLd } from "@/components/json-ld";
import { OracleConversationPanel } from "@/components/daisyui-route-widgets";
import { OracleConsole } from "@/components/oracle-console";
import { ProductRouteHeader } from "@/components/page-layout";
import {
  breadcrumbJsonLd,
  createSeoMetadata,
  seoImages,
  webPageJsonLd,
} from "@/lib/seo";

const oraclePath = "/private-equities/oracle";
const description = "Issuer accounting oracle for solvency, liquidity, and data freshness.";

export const metadata = createSeoMetadata({
  title: "Private Equities Oracle",
  description,
  path: oraclePath,
  image: seoImages.privateEquities,
  keywords: ["issuer oracle", "solvency proof", "QuickBooks oracle", "RWA transparency"],
});

export default function OraclePage() {
  return (
    <>
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

      <ProductRouteHeader
        product="private-equities"
        active="oracle"
        eyebrow="Private Equities / Issuer Oracle"
        title="Oracle"
        description="A bridge between issuer operating data and investor-facing private-market confidence."
      />
      <section>
        <OracleConsole />
      </section>
      <OracleConversationPanel />
    </>
  );
}
