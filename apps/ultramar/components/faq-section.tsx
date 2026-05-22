import { BrandText } from "@/components/brand-name";
import { SplitPanel } from "@/components/page-layout";
import { SectionHeader } from "@/components/section-header";
import type { FaqItem } from "@/lib/seo";

export function FaqSection({
  eyebrow = "FAQ",
  title,
  description,
  items,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  items: FaqItem[];
}) {
  return (
    <SplitPanel
      columns="lg:grid-cols-[0.75fr_1.25fr]"
      asidePadded={false}
      aside={
        <div className="grid gap-1 bg-border-muted">
          {items.map((item) => (
            <article key={item.question} className="bg-surface p-5">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-on-surface">
                <BrandText>{item.question}</BrandText>
              </h2>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                <BrandText>{item.answer}</BrandText>
              </p>
            </article>
          ))}
        </div>
      }
    >
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
    </SplitPanel>
  );
}
