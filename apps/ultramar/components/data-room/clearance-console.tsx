"use client";

import {
  attestDocumentClearanceAction,
  createDocumentClearanceAction,
  voidDocumentClearanceAction,
} from "@/app/private-equities/assets/lcx/dataroom/actions";
import { initialDataRoomActionState } from "@/app/private-equities/assets/lcx/dataroom/action-state";
import { DataRoomActionForm } from "@/components/data-room/action-form";
import {
  DATA_ROOM_CLEARANCE_REVIEW_ROLES,
  LCX_DATA_ROOM_CLEARANCE_CLASSIFICATION,
} from "@/lib/data-room/constants";
import { inspectRedactedDerivative, sha256Hex } from "@/lib/data-room/upload-policy";
import type {
  DataRoomClearance,
  DataRoomClearanceReviewer,
} from "@/lib/data-room/types";
import type { DataRoomClearanceReviewRole } from "@/lib/supabase/database.types";
import { ClipboardCheck, FileCheck2, ShieldAlert } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

type LocalState = { status: "idle" | "error"; message: string };

const reviewRoleLabels: Record<DataRoomClearanceReviewRole, string> = {
  finance_ops: "Finance Ops",
  redaction: "Redaction review",
  counsel: "Counsel review",
  data_room_admin: "Data-room administrator",
};

export function ClearanceConsole({
  viewerId,
  clearances,
  reviewerCandidates,
}: {
  viewerId: string;
  clearances: DataRoomClearance[];
  reviewerCandidates: DataRoomClearanceReviewer[];
}) {
  return (
    <div className="grid gap-5">
      <section className="border border-border-muted bg-surface-dim p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="grid gap-2 text-sm leading-6 text-on-surface-variant">
            <p className="font-medium text-on-surface">Human clearance is required before an upload or publication.</p>
            <p>
              The record binds exactly one SHA-256 fingerprint, MIME type, byte size, and the required classification label. It requires four assigned human attestations and is consumed once.
            </p>
            <p>
              Each reviewer performs their review off-platform against the candidate matching this fingerprint, then records it here. This console never stages or previews the file.
            </p>
            <p>
              This is an auditable workflow record only. The system does not semantically inspect a PDF or image, prove redaction quality, or certify counsel&apos;s professional advice.
            </p>
            <p>
              The uploader cannot be an assigned reviewer. The data-room administrator remains an intended approval role and may publish under existing manager authority; there is no separate fifth publisher role.
            </p>
          </div>
        </div>
      </section>

      <CreateClearanceForm reviewerCandidates={reviewerCandidates} />

      <section className="grid gap-4" aria-labelledby="clearance-register-title">
        <div className="flex items-center justify-between gap-4 border-b border-border-muted pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Audit register</p>
            <h3 id="clearance-register-title" className="mt-1 font-serif text-xl font-semibold">Derivative clearances</h3>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">{clearances.length} recorded</span>
        </div>

        {clearances.length ? (
          <div className="grid gap-3">
            {clearances.map((clearance) => (
              <ClearanceRecord key={clearance.id} clearance={clearance} viewerId={viewerId} />
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-border-muted bg-surface p-5 text-sm text-on-surface-variant">
            No derivative clearance has been created. A derivative cannot be uploaded until a complete clearance exists.
          </p>
        )}
      </section>
    </div>
  );
}

function CreateClearanceForm({ reviewerCandidates }: { reviewerCandidates: DataRoomClearanceReviewer[] }) {
  const [serverState, formAction, pending] = useActionState(createDocumentClearanceAction, initialDataRoomActionState);
  const [localState, setLocalState] = useState<LocalState>({ status: "idle", message: "" });
  const expiryInputRef = useRef<HTMLInputElement>(null);
  const hasEnoughReviewers = reviewerCandidates.length >= DATA_ROOM_CLEARANCE_REVIEW_ROLES.length;

  useEffect(() => {
    if (serverState.status === "success") window.location.reload();
  }, [serverState.status]);

  useEffect(() => {
    if (expiryInputRef.current && !expiryInputRef.current.value) {
      expiryInputRef.current.value = toDatetimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("candidateFile");
    if (!(file instanceof File)) {
      setLocalState({ status: "error", message: "Choose the reviewed derivative to fingerprint." });
      return;
    }

    setLocalState({ status: "idle", message: "" });
    try {
      const derivative = await inspectRedactedDerivative(file);
      formData.set("checksumSha256", await sha256Hex(file));
      formData.set("mimeType", derivative.mimeType);
      formData.set("sizeBytes", String(file.size));
      const expiry = String(formData.get("expiresAt") ?? "");
      const parsedExpiry = new Date(expiry);
      if (!Number.isFinite(parsedExpiry.valueOf())) {
        setLocalState({ status: "error", message: "Choose a valid clearance expiration." });
        return;
      }
      formData.set("expiresAt", parsedExpiry.toISOString());
      // Fingerprinting happens in the browser only. Never serialize candidate
      // bytes into the Server Action request; the action accepts metadata, not
      // a staged file.
      formData.delete("candidateFile");
      formAction(formData);
    } catch (error) {
      setLocalState({
        status: "error",
        message: error instanceof Error ? error.message : "The derivative could not be fingerprinted.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-border-muted bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-3 border-b border-border-muted pb-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-primary/40 bg-primary/10 text-primary"><ClipboardCheck className="h-4 w-4" aria-hidden="true" /></span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Pre-clearance</p>
          <h3 className="mt-1 font-serif text-xl font-semibold">Create derivative clearance</h3>
        </div>
      </div>

      <p className="border-l-2 border-primary/50 bg-surface-dim px-3 py-2 font-mono text-[11px] leading-5 text-on-surface-variant">
        Required artifact label: {LCX_DATA_ROOM_CLEARANCE_CLASSIFICATION}
      </p>

      {!hasEnoughReviewers ? (
        <p className="alert alert-error rounded-none text-xs" role="alert">
          Four distinct active data-room manager identities must exist before a clearance can be created. No reviewer is auto-assigned.
        </p>
      ) : null}

      <Field label="Candidate derivative to fingerprint (not uploaded or previewed here)" htmlFor="clearance-file">
        <input id="clearance-file" name="candidateFile" type="file" accept=".pdf,.jpg,.jpeg,.png" className="file-input file-input-primary w-full" required disabled={!hasEnoughReviewers || pending} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReviewerSelect id="clearance-finance-ops" name="financeOpsReviewerId" label="Finance Ops reviewer" candidates={reviewerCandidates} disabled={!hasEnoughReviewers || pending} />
        <ReviewerSelect id="clearance-redaction" name="redactionReviewerId" label="Redaction reviewer" candidates={reviewerCandidates} disabled={!hasEnoughReviewers || pending} />
        <ReviewerSelect id="clearance-counsel" name="counselReviewerId" label="Counsel reviewer" candidates={reviewerCandidates} disabled={!hasEnoughReviewers || pending} />
        <ReviewerSelect id="clearance-admin" name="dataRoomAdminReviewerId" label="Data-room administrator" candidates={reviewerCandidates} disabled={!hasEnoughReviewers || pending} />
      </div>

      <Field label="Expires at" htmlFor="clearance-expiry">
        <input ref={expiryInputRef} id="clearance-expiry" name="expiresAt" type="datetime-local" className="input input-primary w-full sm:max-w-xs" required disabled={!hasEnoughReviewers || pending} />
      </Field>

      <ClearanceMessage localState={localState} serverState={serverState} />
      <button type="submit" className="btn btn-primary w-full sm:w-fit" disabled={!hasEnoughReviewers || pending}>
        <FileCheck2 className="h-4 w-4" aria-hidden="true" />
        {pending ? "Creating clearance…" : "Create clearance"}
      </button>
    </form>
  );
}

function ReviewerSelect({
  id,
  name,
  label,
  candidates,
  disabled,
}: {
  id: string;
  name: string;
  label: string;
  candidates: DataRoomClearanceReviewer[];
  disabled: boolean;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <select id={id} name={name} className="select select-primary w-full" required disabled={disabled} defaultValue="">
        <option value="">Assign a distinct reviewer</option>
        {candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.fullName || candidate.email} · {candidate.email}</option>)}
      </select>
    </Field>
  );
}

function ClearanceRecord({ clearance, viewerId }: { clearance: DataRoomClearance; viewerId: string }) {
  const canVoid = clearance.status === "awaiting_attestations" || clearance.status === "ready" || clearance.status === "expired";

  return (
    <details className="collapse-arrow collapse border border-border-muted bg-surface-container-lowest">
      <summary className="collapse-title min-h-0 py-4">
        <span className="flex flex-wrap items-center gap-2 pr-6">
          <ClearanceStatus status={clearance.status} />
          <span className="font-mono text-xs">SHA-256 {shortHash(clearance.checksumSha256)}</span>
          <span className="text-xs text-on-surface-variant">{clearance.mimeType} · {formatBytes(clearance.sizeBytes)}</span>
        </span>
      </summary>
      <div className="collapse-content grid gap-4">
        <div className="grid gap-1 border-y border-border-muted py-3 text-xs text-on-surface-variant sm:grid-cols-2">
          <span>Expires {formatTimestamp(clearance.expiresAt)}</span>
          <span className="font-mono">{clearance.classificationLabel}</span>
          <span className="sm:col-span-2">Review off-platform: attest only after comparing the candidate to this exact SHA-256, MIME type, and byte size.</span>
          {clearance.voidReason ? <span className="sm:col-span-2">Void reason: {clearance.voidReason}</span> : null}
          {clearance.consumedVersionId ? <span className="sm:col-span-2">Consumed by version {clearance.consumedVersionId}</span> : null}
        </div>

        <ol className="grid gap-2" aria-label="Clearance reviewer checklist">
          {DATA_ROOM_CLEARANCE_REVIEW_ROLES.map((role) => {
            const reviewer = clearance.reviewers[role];
            const attestation = clearance.attestations.find((entry) => entry.reviewRole === role);
            const isCurrentReviewer = reviewer.id === viewerId;
            return (
              <li key={role} className="grid gap-2 border border-border-muted bg-surface-dim p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-on-surface-variant">{reviewRoleLabels[role]}</p>
                  <p className="mt-1 text-sm">{reviewer.fullName || reviewer.email}</p>
                  <p className="text-xs text-on-surface-variant">{reviewer.email}</p>
                </div>
                {attestation ? (
                  <span className="badge badge-success badge-sm">attested {formatTimestamp(attestation.attestedAt)}</span>
                ) : isCurrentReviewer && clearance.status === "awaiting_attestations" ? (
                  <DataRoomActionForm
                    action={attestDocumentClearanceAction}
                    submitLabel="Record off-platform attestation"
                    buttonClassName="btn btn-primary btn-sm w-full sm:w-auto"
                    className="grid gap-2"
                    refreshMode="reload"
                  >
                    <input type="hidden" name="clearanceId" value={clearance.id} />
                    <input type="hidden" name="reviewRole" value={role} />
                  </DataRoomActionForm>
                ) : (
                  <span className="badge badge-warning badge-sm">awaiting assigned reviewer</span>
                )}
              </li>
            );
          })}
        </ol>

        {canVoid ? (
          <DataRoomActionForm
            action={voidDocumentClearanceAction}
            submitLabel="Void clearance"
            buttonClassName="btn btn-outline btn-error btn-sm w-full sm:w-fit"
            className="grid gap-3 border-t border-border-muted pt-4"
            refreshMode="reload"
          >
            <input type="hidden" name="clearanceId" value={clearance.id} />
            <Field label="Void reason" htmlFor={`clearance-void-${clearance.id}`}>
              <input id={`clearance-void-${clearance.id}`} name="reason" className="input input-primary w-full" maxLength={500} required />
            </Field>
          </DataRoomActionForm>
        ) : null}
      </div>
    </details>
  );
}

function ClearanceStatus({ status }: { status: DataRoomClearance["status"] }) {
  const style = status === "ready"
    ? "badge-success"
    : status === "awaiting_attestations"
      ? "badge-warning"
      : status === "consumed"
        ? "badge-neutral"
        : "badge-error";
  const label = status === "awaiting_attestations" ? "awaiting attestations" : status;
  return <span className={`badge badge-sm ${style}`}>{label}</span>;
}

function ClearanceMessage({
  localState,
  serverState,
}: {
  localState: LocalState;
  serverState: { status: "idle" | "error" | "success"; message: string };
}) {
  const state = localState.status === "error" ? localState : serverState;
  if (state.status === "idle") return null;
  return <div className={`alert rounded-none py-2 text-xs ${state.status === "success" ? "alert-success" : "alert-error"}`} role={state.status === "success" ? "status" : "alert"}>{state.message}</div>;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <label className="grid min-w-0 gap-2" htmlFor={htmlFor}><span className="font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">{label}</span>{children}</label>;
}

function toDatetimeLocal(value: Date) {
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.valueOf() - offset).toISOString().slice(0, 16);
}

function shortHash(value: string) {
  return `${value.slice(0, 12)}…${value.slice(-8)}`;
}

function formatBytes(value: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value / 1024) + " KiB";
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
