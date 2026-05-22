import { BrandName, BrandText } from "@/components/brand-name";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

type AuthMode = "login" | "signup" | "reset" | "update" | "message";
type AuthAction = { href: string; label: string };

const accessRails = [
  {
    label: "01 / Private Equities",
    title: "Private-market rail",
    body: "Issuer, oracle, asset, and portfolio workflows share one account surface.",
    icon: Building2,
  },
  {
    label: "02 / Arbitrage Fund",
    title: "Signal discipline",
    body: "Allocator access stays tied to monitored signals, exposure, and risk controls.",
    icon: BarChart3,
  },
];

const modeEyebrows: Record<AuthMode, string> = {
  login: "Institutional access",
  signup: "Account request",
  reset: "Credential recovery",
  update: "Credential update",
  message: "Access status",
};

const modeForms: Record<
  Exclude<AuthMode, "message">,
  { heading: string; submitLabel: string; links: AuthAction[] }
> = {
  login: {
    heading: "Sign in to Ultramar",
    submitLabel: "Sign in",
    links: [
      { href: "/auth/sign-up", label: "Create account" },
      { href: "/auth/forgot-password", label: "Reset password" },
    ],
  },
  signup: {
    heading: "Request shared access",
    submitLabel: "Request access",
    links: [{ href: "/auth/login", label: "Already have access? Sign in" }],
  },
  reset: {
    heading: "Reset account password",
    submitLabel: "Send reset link",
    links: [{ href: "/auth/login", label: "Back to sign in" }],
  },
  update: {
    heading: "Set a new password",
    submitLabel: "Update password",
    links: [{ href: "/auth/login", label: "Back to sign in" }],
  },
};

export function AuthPanel({
  title,
  description,
  mode,
  primaryAction,
}: {
  title: string;
  description: string;
  mode: AuthMode;
  primaryAction?: AuthAction;
}) {
  const showPassword = mode === "login" || mode === "signup" || mode === "update";
  const showEmail = mode !== "message";
  const formDetails = mode === "message" ? null : modeForms[mode];
  const messageAction = primaryAction ?? { href: "/", label: "Return home" };

  return (
    <main className="terminal-grid mx-4 flex min-h-[calc(100vh-48px)] flex-col border-x border-border-muted bg-surface-ink text-on-surface md:mx-12">
      <section className="grid flex-1 grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-w-0 flex-col justify-between border-b border-border-muted p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
              <BrandName /> / {modeEyebrows[mode]}
            </p>
            <h1 className="mt-5 max-w-3xl break-words font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base md:leading-7">
              <BrandText>{description}</BrandText>
            </p>
          </div>

          <div className="mt-10 grid gap-1 bg-border-muted sm:grid-cols-2">
            {accessRails.map((rail) => {
              const Icon = rail.icon;

              return (
                <div key={rail.label} className="card card-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                      {rail.label}
                    </p>
                    <Icon className="h-5 w-5 shrink-0 text-status-signal" />
                  </div>
                  <h2 className="mt-6 font-serif text-2xl font-semibold leading-tight text-on-surface">
                    {rail.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">{rail.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="grid min-w-0 bg-surface text-on-surface">
          <div className="relative min-h-[220px] overflow-hidden border-b border-border-muted sm:min-h-[280px]">
            <Image
              src="/abstract-financial-growth-chart-geometric-shapes.jpg"
              alt="Institutional market geometry"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="image-blackwork object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-surface-ink/55" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="badge badge-outline bg-surface-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface">
                Shared account
              </span>
              <span className="badge badge-outline badge-success bg-surface px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">
                Capital rail
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-border-muted bg-surface-ink/90 text-on-surface">
              {["Issuer", "Signal", "Risk"].map((label) => (
                <div key={label} className="border-r border-border-muted p-4 last:border-r-0">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                    Access
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold uppercase text-on-surface">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[420px] flex-col justify-center p-5 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-start justify-between gap-4 border-b border-border-muted pb-6">
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal">
                  {modeEyebrows[mode]}
                </p>
                <h2 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight">
                  {formDetails?.heading ?? title}
                </h2>
              </div>
              <span
                className="btn btn-square btn-ghost hidden h-11 w-11 shrink-0 border border-border-muted bg-surface-ink sm:grid"
                aria-hidden="true"
              >
                {mode === "message" ? (
                  <CheckCircle2 className="h-5 w-5 text-status-signal" />
                ) : (
                  <LockKeyhole className="h-5 w-5 text-status-signal" />
                )}
              </span>
            </div>

            {mode === "message" ? (
              <Link
                href={messageAction.href}
                className="btn btn-outline btn-success group h-12 font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
              >
                {messageAction.label}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ) : (
              <form className="grid gap-5">
                {showEmail ? (
                  <label className="grid gap-3" htmlFor={`${mode}-email`}>
                    <span className="label p-0">
                      <span className="label-text font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                        Email address
                      </span>
                    </span>
                    <input
                      id={`${mode}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="input input-success h-12 w-full bg-surface-ink text-sm text-on-surface placeholder:text-on-surface-variant/60"
                      placeholder="investor@example.com"
                    />
                  </label>
                ) : null}
                {showPassword ? (
                  <label className="grid gap-3" htmlFor={`${mode}-password`}>
                    <span className="label p-0">
                      <span className="label-text font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
                        {mode === "update" ? "New password" : "Password"}
                      </span>
                    </span>
                    <input
                      id={`${mode}-password`}
                      name="password"
                      type="password"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      className="input input-success h-12 w-full bg-surface-ink text-sm text-on-surface placeholder:text-on-surface-variant/60"
                      placeholder="********"
                    />
                  </label>
                ) : null}
                <button
                  type="button"
                  className="btn btn-success group mt-1 h-12 w-full font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                >
                  {formDetails?.submitLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </form>
            )}

            {formDetails ? (
              <div className="mt-6 grid gap-3 border-t border-border-muted pt-5 text-sm sm:grid-cols-2">
                {formDetails.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="link link-hover font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-status-signal"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
