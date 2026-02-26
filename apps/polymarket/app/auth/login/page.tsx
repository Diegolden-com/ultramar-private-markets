import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full">
      {/* Brand panel */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-border bg-card p-10 lg:flex">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Ultramar
          </p>
        </div>
        <div className="relative z-10">
          <p className="max-w-sm text-2xl font-semibold leading-tight tracking-tight text-foreground">
            Trading signals where options meet prediction markets.
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Detect price discrepancies between Deribit crypto options and
            Polymarket prediction markets in real-time.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            Crypto options signal infrastructure
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
