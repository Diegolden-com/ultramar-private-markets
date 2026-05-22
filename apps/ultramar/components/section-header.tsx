import { BrandText } from "@/components/brand-name";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="badge badge-outline badge-success font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
        <BrandText>{title}</BrandText>
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          <BrandText>{description}</BrandText>
        </p>
      ) : null}
    </div>
  );
}
