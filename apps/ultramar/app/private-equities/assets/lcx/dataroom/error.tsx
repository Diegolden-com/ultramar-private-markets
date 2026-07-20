"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function DataRoomError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="card card-border grid min-h-[520px] place-items-center bg-surface p-8 text-center">
      <div className="max-w-lg">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" aria-hidden="true" />
        <h1 className="mt-5 font-serif text-4xl font-semibold">The workspace could not load</h1>
        <p className="mt-4 text-sm leading-6 text-on-surface-variant">Your access was not changed. Retry the protected request.</p>
        <button type="button" onClick={reset} className="btn btn-primary mt-7"><RefreshCcw className="h-4 w-4" aria-hidden="true" />Retry</button>
      </div>
    </section>
  );
}
