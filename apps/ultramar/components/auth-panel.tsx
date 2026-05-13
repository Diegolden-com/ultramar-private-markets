import Link from "next/link";

export function AuthPanel({
  title,
  description,
  mode,
}: {
  title: string;
  description: string;
  mode: "login" | "signup" | "reset" | "update" | "message";
}) {
  const showPassword = mode === "login" || mode === "signup" || mode === "update";
  const showEmail = mode !== "message";

  return (
    <main className="financial-grid min-h-[calc(100vh-4rem)]">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Ultramar.capital
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

          {mode === "message" ? (
            <Link
              href="/"
              className="mt-6 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              Return Home
            </Link>
          ) : (
            <form className="mt-6 space-y-4">
              {showEmail ? (
                <label className="block">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    type="email"
                    className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-accent"
                    placeholder="investor@example.com"
                  />
                </label>
              ) : null}
              {showPassword ? (
                <label className="block">
                  <span className="text-sm font-medium">
                    {mode === "update" ? "New password" : "Password"}
                  </span>
                  <input
                    type="password"
                    className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-accent"
                    placeholder="********"
                  />
                </label>
              ) : null}
              <button
                type="button"
                className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Continue
              </button>
            </form>
          )}

          {mode === "login" ? (
            <div className="mt-5 flex justify-between gap-4 text-sm">
              <Link href="/auth/sign-up" className="text-accent hover:underline">
                Create account
              </Link>
              <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-accent">
                Forgot password
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
