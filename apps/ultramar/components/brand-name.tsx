import type { ElementType, HTMLAttributes } from "react";

type BrandNameProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

const brandToken = "Ultramar.capital";

export function BrandName({
  as: Component = "span",
  className,
  ...props
}: BrandNameProps) {
  const classes = ["normal-case tracking-normal", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} aria-label="Ultramar Capital" translate="no" {...props}>
      <span>Ultramar.</span>
      <span className="italic">Capital</span>
    </Component>
  );
}

export function BrandText({ children }: { children: string }) {
  const parts = children.split(brandToken);

  if (parts.length === 1) return <>{children}</>;

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <BrandName /> : null}
        </span>
      ))}
    </>
  );
}
