import { BrandText } from "@/components/brand-name";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
} from "lucide-react";

type AuthMode = "login" | "signup" | "reset" | "update" | "message";
type AuthAction = { href: string; label: string };

const modeForms: Record<
  Exclude<AuthMode, "message">,
  { submitLabel: string; links: AuthAction[] }
> = {
  login: {
    submitLabel: "Sign in",
    links: [
      { href: "/auth/sign-up", label: "Create account" },
      { href: "/auth/forgot-password", label: "Reset password" },
    ],
  },
  signup: {
    submitLabel: "Request access",
    links: [{ href: "/auth/login", label: "Already have access? Sign in" }],
  },
  reset: {
    submitLabel: "Send reset link",
    links: [{ href: "/auth/login", label: "Back to sign in" }],
  },
  update: {
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
            <h1 className="max-w-3xl break-words font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
              {title}
            </h1>
            {mode === "message" ? (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base md:leading-7">
                <BrandText>{description}</BrandText>
              </p>
            ) : null}
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
          </div>

          <div className="flex min-h-[420px] flex-col justify-center p-5 sm:p-8 lg:p-10">
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
