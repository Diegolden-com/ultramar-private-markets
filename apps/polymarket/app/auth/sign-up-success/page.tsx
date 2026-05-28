import { Mail } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="card card-border w-full max-w-sm bg-card text-center">
        <div className="card-body">
        <Link
          href="/"
          className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          Ultramar
        </Link>
        <div className="avatar placeholder mx-auto mt-6">
          <div className="w-12 rounded-full border border-border bg-secondary text-primary">
            <Mail className="h-5 w-5" />
          </div>
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
            className="btn btn-primary btn-sm"
          >
            Back to sign in
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
