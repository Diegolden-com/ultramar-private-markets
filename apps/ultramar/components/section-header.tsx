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
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">{description}</p>
      ) : null}
    </div>
  );
}
