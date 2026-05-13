import { AssetExplorer } from "@/components/asset-explorer";
import { ProductCrosslink } from "@/components/product-crosslink";
import { SectionHeader } from "@/components/section-header";
import { createSeoMetadata, seoImages } from "@/lib/seo";

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
