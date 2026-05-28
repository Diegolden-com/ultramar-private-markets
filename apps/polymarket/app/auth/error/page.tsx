import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <p className="text-sm text-muted-foreground">
      {params?.error ? `Error: ${params.error}` : "An unspecified error occurred."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
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
          <div className="w-12 rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <div className="mt-3">
          <Suspense>
            <ErrorContent searchParams={searchParams} />
          </Suspense>
        </div>
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
