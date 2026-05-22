import { ProductTabs } from "@/components/product-tabs";
import { SectionHeader } from "@/components/section-header";
import type { ProductTabKey } from "@/lib/site-navigation";
import type { ProductSlug } from "@ultramar/product-model";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageMaxWidth = "standard" | "wide" | "full";
type PageGap = "compact" | "normal" | "loose";
type HeadingLevel = "h1" | "h2";

const maxWidthClasses: Record<PageMaxWidth, string> = {
  standard: "max-w-[1600px]",
  wide: "max-w-[1800px]",
  full: "max-w-none",
};

const gapClasses: Record<PageGap, string> = {
  compact: "gap-1",
  normal: "gap-4",
  loose: "gap-6",
};

export function PageShell({
  children,
  maxWidth = "standard",
  gap = "compact",
  className,
}: {
  children: ReactNode;
  maxWidth?: PageMaxWidth;
  gap?: PageGap;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-[calc(100vh-48px)] w-full flex-col bg-surface-ink px-4 py-8 text-on-surface md:px-12",
        maxWidthClasses[maxWidth],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  columns = "lg:grid-cols-[1.15fr_0.85fr]",
  className,
  asideClassName,
  asidePadded = true,
  headingLevel = "h1",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  columns?: string;
  className?: string;
  asideClassName?: string;
  asidePadded?: boolean;
  headingLevel?: HeadingLevel;
}) {
  if (!children) {
    return (
      <SurfacePanel className={className}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          headingLevel={headingLevel}
        />
      </SurfacePanel>
    );
  }

  return (
    <SplitPanel
      columns={columns}
      className={className}
      aside={children}
      asideClassName={asideClassName}
      asidePadded={asidePadded}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        headingLevel={headingLevel}
      />
    </SplitPanel>
  );
}

export function ProductRouteHeader<TProduct extends ProductSlug>({
  product,
  active,
  eyebrow,
  title,
  description,
  children,
  columns,
  asideClassName,
  asidePadded,
  headingLevel,
}: {
  product: TProduct;
  active: ProductTabKey<TProduct>;
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  columns?: string;
  asideClassName?: string;
  asidePadded?: boolean;
  headingLevel?: HeadingLevel;
}) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        columns={columns}
        asideClassName={asideClassName}
        asidePadded={asidePadded}
        headingLevel={headingLevel}
      >
        {children}
      </PageHeader>
      <ProductTabs product={product} active={active} />
    </>
  );
}

export function SplitPanel({
  children,
  aside,
  columns = "lg:grid-cols-[1.15fr_0.85fr]",
  className,
  contentClassName,
  asideClassName,
  contentPadded = true,
  asidePadded = true,
}: {
  children: ReactNode;
  aside: ReactNode;
  columns?: string;
  className?: string;
  contentClassName?: string;
  asideClassName?: string;
  contentPadded?: boolean;
  asidePadded?: boolean;
}) {
  return (
    <section
      className={cn("grid gap-1 border border-border-muted bg-border-muted", columns, className)}
    >
      <div className={cn("bg-surface", contentPadded && "p-6 md:p-8", contentClassName)}>
        {children}
      </div>
      <div className={cn("bg-surface", asidePadded && "p-6 md:p-8", asideClassName)}>
        {aside}
      </div>
    </section>
  );
}

export function SurfaceGrid({
  children,
  columns,
  bordered = false,
  className,
}: {
  children: ReactNode;
  columns?: string;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-1 bg-border-muted",
        bordered && "border border-border-muted",
        columns,
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SurfacePanel({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn("border border-border-muted bg-surface", padded && "p-6 md:p-8", className)}
    >
      {children}
    </section>
  );
}

export function FeatureCard({
  id,
  icon: Icon,
  eyebrow,
  title,
  body,
  children,
  className,
  titleClassName,
}: {
  id?: string;
  icon?: LucideIcon;
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <article id={id} className={cn("card card-border bg-surface p-5", className)}>
      {Icon ? <Icon className="h-5 w-5 text-status-signal" /> : null}
      {eyebrow ? (
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 font-serif text-2xl font-semibold leading-tight text-on-surface",
          !Icon && !eyebrow && "mt-0",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {body ? <p className="mt-3 text-sm leading-6 text-on-surface-variant">{body}</p> : null}
      {children}
    </article>
  );
}

export function StatTile({
  label,
  value,
  detail,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "signal" | "warning" | "danger";
  className?: string;
}) {
  const valueClassName =
    tone === "signal"
      ? "text-status-signal"
      : tone === "warning"
        ? "text-status-warning"
        : tone === "danger"
          ? "text-destructive"
          : "text-on-surface";

  return (
    <div
      className={cn(
        "card card-border bg-surface p-5",
        tone === "signal" && "border-t border-status-signal",
        tone === "warning" && "border-t border-status-warning",
        tone === "danger" && "border-t border-destructive",
        className,
      )}
    >
      <p className="stat-title font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </p>
      <p className={cn("stat-value mt-4 font-mono text-lg font-semibold uppercase", valueClassName)}>
        {value}
      </p>
      {detail ? (
        <p className="stat-desc mt-2 text-sm leading-normal text-on-surface-variant">{detail}</p>
      ) : null}
    </div>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
