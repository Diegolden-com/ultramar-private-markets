const brandToken = "Ultramar.capital"

export function BrandName({ className }: { className?: string }) {
  const classes = ["normal-case tracking-normal", className].filter(Boolean).join(" ")

  return (
    <span className={classes} aria-label="Ultramar Capital">
      <span>Ultramar.</span>
      <span className="italic">Capital</span>
    </span>
  )
}

export function BrandText({ children }: { children: string }) {
  const parts = children.split(brandToken)

  if (parts.length === 1) return <>{children}</>

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <BrandName /> : null}
        </span>
      ))}
    </>
  )
}
