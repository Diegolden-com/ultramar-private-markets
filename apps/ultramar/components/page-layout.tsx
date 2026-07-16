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
  standard: "max-w-[1440px]",
  wide: "max-w-[1600px]",
  full: "max-w-none",
};

const gapClasses: Record<PageGap, string> = {
  compact: "gap-3 md:gap-4",
  normal: "gap-5 md:gap-6",
  loose: "gap-8 md:gap-10",
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
      id="main-content"
      className={cn(
        "mx-auto flex min-h-[calc(100vh-64px)] w-full scroll-mt-20 flex-col bg-surface-ink px-4 py-6 text-on-surface sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12",
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
      className={cn(
        "card card-border grid min-w-0 gap-px overflow-hidden bg-border-muted",
        columns,
        className,
      )}
    >
      <div className={cn("min-w-0 bg-surface", contentPadded && "p-6 sm:p-7 lg:p-8", contentClassName)}>
        {children}
      </div>
      <div className={cn("min-w-0 bg-surface", asidePadded && "p-6 sm:p-7 lg:p-8", asideClassName)}>
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
        "grid min-w-0 gap-3 md:gap-4",
        bordered && "border border-border-muted bg-surface-container-lowest p-2 md:p-3",
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
      className={cn(
        "card card-border min-w-0 overflow-hidden bg-surface",
        padded && "p-6 sm:p-7 lg:p-8",
        className,
      )}
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
    <article
      id={id}
      className={cn(
        "card card-border min-w-0 bg-surface p-6 sm:p-7 hover:border-outline-variant",
        className,
      )}
    >
      {Icon ? (
        <span className="grid h-10 w-10 place-items-center border border-border-muted bg-surface-container-low">
          <Icon className="h-5 w-5 text-primary" />
        </span>
      ) : null}
      {eyebrow ? (
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-5 text-balance font-serif text-2xl font-semibold leading-[1.15] text-on-surface sm:text-[1.7rem]",
          !Icon && !eyebrow && "mt-0",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {body ? <p className="mt-4 max-w-prose text-sm leading-6 text-on-surface-variant">{body}</p> : null}
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
        "stat card card-border min-w-0 border-l-2 border-l-outline-variant bg-surface p-5 sm:p-6",
        tone === "signal" && "border-l-status-signal",
        tone === "warning" && "border-l-status-warning",
        tone === "danger" && "border-l-destructive",
        className,
      )}
    >
      <p className="stat-title whitespace-normal break-words font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant [overflow-wrap:anywhere]">
        {label}
      </p>
      <p
        className={cn(
          "stat-value mt-4 whitespace-normal break-words font-mono text-xl font-semibold leading-tight [overflow-wrap:anywhere]",
          valueClassName,
        )}
      >
        {value}
      </p>
      {detail ? (
        <p className="stat-desc mt-2 whitespace-normal break-words text-sm leading-normal text-on-surface-variant [overflow-wrap:anywhere]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
