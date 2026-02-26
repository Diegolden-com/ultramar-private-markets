import { Mail } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <Link
          href="/"
          className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          Ultramar
        </Link>
        <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ve successfully signed up. Please check your email to confirm
          your account before signing in.
        </p>
        <div className="mt-6">
          <Link
            href="/auth/login"
            className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
