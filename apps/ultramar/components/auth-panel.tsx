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

export function AuthPanel({
  title,
  description,
  mode,
}: {
  title: string;
  description: string;
  mode: AuthMode;
}) {
  const showPassword = mode === "login" || mode === "signup" || mode === "update";
  const showEmail = mode !== "message";

  return (
    <main className="relative isolate overflow-hidden bg-foreground text-background">
      <div className="blackwork-hatch absolute inset-0 opacity-[0.08]" />
      <div className="financial-grid absolute inset-0 opacity-[0.07]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-8 sm:px-6 xl:grid-cols-[0.96fr_1.04fr] xl:py-10">
        <div className="flex min-w-0 flex-col justify-between border-x border-background/15 px-5 py-8 sm:px-8 xl:py-12 xl:pr-12">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-background/60">
              Ultramar.capital / {modeEyebrows[mode]}
            </p>
            <h1 className="mt-8 max-w-3xl break-words font-serif text-4xl font-bold leading-[0.92] [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-background/72 sm:text-lg sm:leading-8">
              {description}
            </p>
          </div>

          <div className="mt-12 grid gap-px bg-background/20 sm:grid-cols-2">
            {accessRails.map((rail) => {
              const Icon = rail.icon;

              return (
                <div key={rail.label} className="bg-foreground p-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-background/50">
                      {rail.label}
                    </p>
                    <Icon className="h-5 w-5 shrink-0 text-accent" />
                  </div>
                  <h2 className="mt-8 font-serif text-2xl font-bold leading-tight">
                    {rail.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-background/65">{rail.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="grid min-w-0 border-x border-b border-background/15 bg-background text-foreground xl:border-l-0 xl:border-y">
          <div className="relative min-h-[220px] overflow-hidden border-b border-border sm:min-h-[280px]">
            <Image
              src="/abstract-financial-growth-chart-geometric-shapes.jpg"
              alt="Institutional market geometry"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="image-blackwork object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-foreground/45" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="bg-background px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                Shared account
              </span>
              <span className="border border-background/50 bg-foreground/55 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-background backdrop-blur">
                Capital rail
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-background/20 bg-foreground/80 text-background backdrop-blur-sm">
              {["Issuer", "Signal", "Risk"].map((label) => (
                <div key={label} className="border-r border-background/20 p-4 last:border-r-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">
                    Access
                  </p>
                  <p className="mt-2 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[420px] flex-col justify-center p-5 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-start justify-between gap-4 border-b border-border pb-6">
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.26em] text-accent">
                  Secure workflow
                </p>
                <h2 className="mt-3 break-words font-serif text-3xl font-bold leading-tight">
                  Ultramar access
                </h2>
              </div>
              <span className="hidden h-11 w-11 shrink-0 place-items-center rounded border border-border bg-card sm:grid">
                {mode === "message" ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <LockKeyhole className="h-5 w-5 text-accent" />
                )}
              </span>
            </div>

            {mode === "message" ? (
              <Link
                href="/"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded border border-foreground bg-foreground px-5 font-mono text-xs font-bold uppercase tracking-widest text-background transition hover:bg-background hover:text-foreground"
              >
                Return Home
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ) : (
              <form className="grid gap-5">
                {showEmail ? (
                  <label className="block">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Email
                    </span>
                    <input
                      type="email"
                      className="mt-3 h-12 w-full rounded border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
                      placeholder="investor@example.com"
                    />
                  </label>
                ) : null}
                {showPassword ? (
                  <label className="block">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {mode === "update" ? "New password" : "Password"}
                    </span>
                    <input
                      type="password"
                      className="mt-3 h-12 w-full rounded border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
                      placeholder="********"
                    />
                  </label>
                ) : null}
                <button
                  type="button"
                  className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-3 rounded border border-foreground bg-foreground px-5 font-mono text-xs font-bold uppercase tracking-widest text-background transition hover:bg-background hover:text-foreground"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </form>
            )}

            {mode === "login" ? (
              <div className="mt-6 grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
                <Link
                  href="/auth/sign-up"
                  className="font-mono text-xs font-bold uppercase tracking-widest text-accent transition hover:text-foreground"
                >
                  Create account
                </Link>
                <Link
                  href="/auth/forgot-password"
                  className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
                >
                  Forgot password
                </Link>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
