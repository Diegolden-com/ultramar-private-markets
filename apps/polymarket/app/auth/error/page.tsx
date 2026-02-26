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
      <div className="w-full max-w-sm text-center">
        <Link
          href="/"
          className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          Ultramar
        </Link>
        <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
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
            className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
