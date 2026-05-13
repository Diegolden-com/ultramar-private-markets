import { AssetExplorer } from "@/components/asset-explorer";
import { JsonLd } from "@/components/json-ld";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { deals } from "@/lib/deals";
import { breadcrumbJsonLd, createSeoMetadata, itemListJsonLd, seoImages } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Private Equities Assets",
  description: "Browse primary and secondary private-market assets on Ultramar.capital.",
  path: "/private-equities/assets",
  image: seoImages.privateEquities,
  keywords: ["private equity assets", "RWA marketplace", "tokenized assets"],
});

export default function AssetsPage() {
  return (
    <main>
      <JsonLd
        id="private-equities-assets-json-ld"
        data={[
          itemListJsonLd({
            path: "/private-equities/assets",
            name: "Ultramar Private Equities asset marketplace",
            description:
              "Primary and secondary tokenized private-market assets available in the Ultramar.capital private-equities workflow.",
            items: deals.map((deal) => ({
              name: `${deal.name} (${deal.ticker})`,
              url: `/private-equities/assets/${deal.ticker}`,
              description: deal.description,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Private Equities", path: "/private-equities" },
            { name: "Assets", path: "/private-equities/assets" },
          ]),
        ]}
      />
      <section className="financial-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader
            eyebrow="Private Equities"
            title="Asset marketplace"
            description="A single browsing surface for private-market opportunities, issuer rounds, and eligible secondary transfers."
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <AssetExplorer />
      </section>
      <ProductCrosslink current="private-equities" />
    </main>
  );
}
