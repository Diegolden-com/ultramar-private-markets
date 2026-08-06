"use client";

import {
  attestReleaseManifestAction,
  closeLcxDiligenceAction,
  createReleaseManifestAction,
  openLcxDiligenceAction,
} from "@/app/private-equities/assets/lcx/dataroom/actions";
import { DataRoomActionForm } from "@/components/data-room/action-form";
import {
  DATA_ROOM_CLEARANCE_REVIEW_ROLES,
  LCX_RELEASE_MAX_FRESHNESS_DAYS,
  LCX_RELEASE_MAX_MODEL_AGE_DAYS,
} from "@/lib/data-room/constants";
import type {
  DataRoomClearanceReviewer,
  DataRoomReleaseManifest,
} from "@/lib/data-room/types";
import type {
  DataRoomClearanceReviewRole,
  DataRoomReleaseState,
  ProfileRole,
} from "@/lib/supabase/database.types";
import { ClipboardCheck, LockKeyhole, UnlockKeyhole } from "lucide-react";

const reviewRoleLabels: Record<DataRoomClearanceReviewRole, string> = {
  finance_ops: "Finance Ops",
  redaction: "Redaction review",
  counsel: "Counsel",
  data_room_admin: "Data-room administrator",
};

export function ReleaseGateConsole({
  viewerId,
  viewerRole,
  releaseState,
  manifests,
  reviewerCandidates,
}: {
  viewerId: string;
  viewerRole: ProfileRole;
  releaseState: DataRoomReleaseState;
  manifests: DataRoomReleaseManifest[];
  reviewerCandidates: DataRoomClearanceReviewer[];
}) {
  const isPlatformAdmin = viewerRole === "admin";

  return (
    <div className="grid gap-5">
      <section className={`border p-4 sm:p-5 ${releaseState === "diligence_open" ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
        <div className="flex items-start gap-3">
          {releaseState === "diligence_open" ? (
            <UnlockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          )}
          <div className="grid gap-2 text-sm leading-6 text-on-surface-variant">
            <p className="font-medium text-on-surface">
              {releaseState === "diligence_open" ? "LCX diligence is open." : "LCX diligence is not open."}
            </p>
            <p>
              This is a release control for the LCX secondary-transfer data room only. It never follows round status and never creates an offering, allocation, subscription, payment, or transfer workflow.
            </p>
            <p>
              Managers can prepare drafts and cleared derivatives while closed. Investors cannot request access, receive grants, or see documents until a fresh PWA-linked manifest receives four human attestations and a platform administrator opens the gate.
            </p>
          </div>
        </div>

        {releaseState === "diligence_open" && isPlatformAdmin ? (
          <DataRoomActionForm
            action={closeLcxDiligenceAction}
            submitLabel="Close LCX diligence"
            buttonClassName="btn btn-outline btn-error btn-sm mt-5 w-full sm:w-fit"
            refreshMode="reload"
          >
            <input type="hidden" name="intent" value="close" />
          </DataRoomActionForm>
        ) : null}
      </section>

      <CreateManifestForm reviewerCandidates={reviewerCandidates} />

      <section className="grid gap-4" aria-labelledby="release-manifest-register-title">
        <div className="flex items-center justify-between gap-4 border-b border-border-muted pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">Release register</p>
            <h3 id="release-manifest-register-title" className="mt-1 font-serif text-xl font-semibold">PWA-linked release manifests</h3>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">{manifests.length} recorded</span>
        </div>

        {manifests.length ? (
          <div className="grid gap-3">
            {manifests.map((manifest) => (
              <ReleaseManifestRecord
                key={manifest.id}
                manifest={manifest}
                viewerId={viewerId}
                canOpen={isPlatformAdmin && releaseState !== "diligence_open" && manifest.status === "ready"}
              />
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-border-muted bg-surface p-5 text-sm text-on-surface-variant">
            No release manifest exists. The LCX data room remains in internal preparation until an approved PWA reference is recorded and fully attested.
          </p>
        )}
      </section>
    </div>
  );
}

function CreateManifestForm({ reviewerCandidates }: { reviewerCandidates: DataRoomClearanceReviewer[] }) {
  const hasEnoughReviewers = reviewerCandidates.length >= DATA_ROOM_CLEARANCE_REVIEW_ROLES.length;

  return (
    <DataRoomActionForm
      action={createReleaseManifestAction}
      submitLabel="Create release manifest"
      buttonClassName="btn btn-primary w-full sm:w-fit"
      className="grid gap-4 border border-border-muted bg-surface p-4 sm:p-5"
      refreshMode="reload"
    >
      <div className="flex items-start gap-3 border-b border-border-muted pb-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-primary/40 bg-primary/10 text-primary"><ClipboardCheck className="h-4 w-4" aria-hidden="true" /></span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">LCX release preparation</p>
          <h3 className="mt-1 font-serif text-xl font-semibold">Bind the approved PWA record</h3>
        </div>
      </div>

      <p className="border-l-2 border-primary/50 bg-surface-dim px-3 py-2 font-mono text-[11px] leading-5 text-on-surface-variant">
        Fixed contract: scenario consolidated-secondary · finance schema v3 · model cut ≤ {LCX_RELEASE_MAX_MODEL_AGE_DAYS} days old · freshness ≤ {LCX_RELEASE_MAX_FRESHNESS_DAYS} days · no financial terms, documents, valuation, price, percentage, or allocation data enter this form.
      </p>

      {!hasEnoughReviewers ? (
        <p className="alert alert-error rounded-none text-xs" role="alert">
          Four distinct active LCX data-room manager identities are required. No reviewer is auto-assigned.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PWA approval attestation ID" htmlFor="release-approval-id">
          <input id="release-approval-id" name="pwaApprovalAttestationId" className="input input-primary w-full font-mono" placeholder="UUID from approved PWA snapshot" required disabled={!hasEnoughReviewers} />
        </Field>
        <Field label="PWA source ID" htmlFor="release-source-id">
          <input id="release-source-id" name="pwaSourceId" className="input input-primary w-full font-mono" maxLength={200} placeholder="Opaque source identifier" required disabled={!hasEnoughReviewers} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PWA manifest SHA-256" htmlFor="release-manifest-hash">
          <input id="release-manifest-hash" name="pwaManifestSha256" className="input input-primary w-full font-mono" inputMode="text" maxLength={64} placeholder="Approved declaration hash" required disabled={!hasEnoughReviewers} />
        </Field>
        <Field label="PWA snapshot SHA-256" htmlFor="release-snapshot-hash">
          <input id="release-snapshot-hash" name="pwaSnapshotSha256" className="input input-primary w-full font-mono" inputMode="text" maxLength={64} placeholder="Rendered payload hash" required disabled={!hasEnoughReviewers} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PWA model cut (YYYY-MM-DD)" htmlFor="release-model-as-of">
          <input id="release-model-as-of" name="modelAsOf" type="date" className="input input-primary w-full" required disabled={!hasEnoughReviewers} />
        </Field>
        <Field label="PWA freshness deadline" htmlFor="release-freshness">
          <input id="release-freshness" name="freshnessDueAt" type="datetime-local" className="input input-primary w-full" required disabled={!hasEnoughReviewers} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReviewerSelect id="release-finance-ops" name="financeOpsReviewerId" label="Finance Ops reviewer" candidates={reviewerCandidates} disabled={!hasEnoughReviewers} />
        <ReviewerSelect id="release-redaction" name="redactionReviewerId" label="Redaction reviewer" candidates={reviewerCandidates} disabled={!hasEnoughReviewers} />
        <ReviewerSelect id="release-counsel" name="counselReviewerId" label="Counsel reviewer" candidates={reviewerCandidates} disabled={!hasEnoughReviewers} />
        <ReviewerSelect id="release-admin" name="dataRoomAdminReviewerId" label="Data-room administrator" candidates={reviewerCandidates} disabled={!hasEnoughReviewers} />
      </div>
    </DataRoomActionForm>
  );
}

function ReleaseManifestRecord({
  manifest,
  viewerId,
  canOpen,
}: {
  manifest: DataRoomReleaseManifest;
  viewerId: string;
  canOpen: boolean;
}) {
  return (
    <details className="collapse-arrow collapse border border-border-muted bg-surface-container-lowest">
      <summary className="collapse-title min-h-0 py-4">
        <span className="flex flex-wrap items-center gap-2 pr-6">
          <ReleaseManifestStatus status={manifest.status} />
          <span className="font-mono text-xs">revision {manifest.revision}</span>
          <span className="text-xs text-on-surface-variant">{manifest.scenario} · finance schema v{manifest.financeSchemaVersion}</span>
        </span>
      </summary>
      <div className="collapse-content grid gap-4">
        <dl className="grid gap-1 border-y border-border-muted py-3 text-xs text-on-surface-variant sm:grid-cols-2">
          <ReleaseMetadata label="PWA approval ID" value={manifest.pwaApprovalAttestationId} />
          <ReleaseMetadata label="PWA source ID" value={manifest.pwaSourceId} />
          <ReleaseMetadata label="Manifest hash" value={shortHash(manifest.pwaManifestSha256)} />
          <ReleaseMetadata label="Snapshot hash" value={shortHash(manifest.pwaSnapshotSha256)} />
          <ReleaseMetadata label="Model cut" value={manifest.modelAsOf} />
          <ReleaseMetadata label="Fresh through" value={formatTimestamp(manifest.freshnessDueAt)} />
        </dl>

        <ol className="grid gap-2" aria-label="Release reviewer checklist">
          {DATA_ROOM_CLEARANCE_REVIEW_ROLES.map((role) => {
            const reviewer = manifest.reviewers[role];
            const attestation = manifest.attestations.find((entry) => entry.reviewRole === role);
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
                ) : isCurrentReviewer && manifest.status === "awaiting_attestations" ? (
                  <DataRoomActionForm
                    action={attestReleaseManifestAction}
                    submitLabel="Record release attestation"
                    buttonClassName="btn btn-primary btn-sm w-full sm:w-auto"
                    className="grid gap-2"
                    refreshMode="reload"
                  >
                    <input type="hidden" name="manifestId" value={manifest.id} />
                    <input type="hidden" name="reviewRole" value={role} />
                  </DataRoomActionForm>
                ) : (
                  <span className="badge badge-warning badge-sm">awaiting assigned reviewer</span>
                )}
              </li>
            );
          })}
        </ol>

        {canOpen ? (
          <DataRoomActionForm
            action={openLcxDiligenceAction}
            submitLabel="Open LCX diligence"
            buttonClassName="btn btn-primary btn-sm w-full sm:w-fit"
            className="grid gap-3 border-t border-border-muted pt-4"
            refreshMode="reload"
          >
            <input type="hidden" name="manifestId" value={manifest.id} />
            <p className="text-xs leading-5 text-on-surface-variant">This makes investor requests and already-approved document visibility available only while this exact PWA reference remains fresh.</p>
          </DataRoomActionForm>
        ) : null}
      </div>
    </details>
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

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <label className="grid min-w-0 gap-2" htmlFor={htmlFor}><span className="font-mono text-[10px] uppercase tracking-[0.08em] text-on-surface-variant">{label}</span>{children}</label>;
}

function ReleaseManifestStatus({ status }: { status: DataRoomReleaseManifest["status"] }) {
  const style = status === "ready" ? "badge-success" : status === "expired" ? "badge-error" : "badge-warning";
  const label = status === "awaiting_attestations" ? "awaiting attestations" : status;
  return <span className={`badge badge-sm ${style}`}>{label}</span>;
}

function ReleaseMetadata({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 sm:grid-cols-[7rem_minmax(0,1fr)]"><dt className="font-mono text-[10px] uppercase tracking-[0.08em]">{label}</dt><dd className="min-w-0 break-all font-mono text-[11px] text-on-surface">{value}</dd></div>;
}

function shortHash(value: string) {
  return `${value.slice(0, 12)}…${value.slice(-8)}`;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
