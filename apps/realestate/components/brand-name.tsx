export function BrandName({ className }: { className?: string }) {
  return (
    <span className={className} aria-label="Ultramar Real Estate">
      <span>Ultramar</span>
      <span className="italic">.capital</span>
      <span className="brand-descriptor">Real Estate</span>
    </span>
  );
}
