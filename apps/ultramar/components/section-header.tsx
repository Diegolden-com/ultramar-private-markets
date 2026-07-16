import { BrandText } from "@/components/brand-name";

export function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const headingClassName =
    headingLevel === "h1"
      ? "text-4xl sm:text-5xl lg:text-[3.5rem]"
      : "text-3xl sm:text-4xl lg:text-[2.75rem]";

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3">
        <p className="badge badge-outline badge-info h-auto min-h-6 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]">
          {eyebrow}
        </p>
        <span className="hidden h-px w-12 bg-border-muted sm:block" aria-hidden="true" />
      </div>
      <Heading
        className={`mt-5 max-w-[18ch] text-balance font-serif font-semibold leading-[1.02] text-on-surface ${headingClassName}`}
      >
        <BrandText>{title}</BrandText>
      </Heading>
      {description ? (
        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-on-surface-variant">
          <BrandText>{description}</BrandText>
        </p>
      ) : null}
    </div>
  );
}
