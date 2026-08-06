"use server";

import {
  LCX_DATA_ROOM,
  LCX_RELEASE_MAX_FRESHNESS_DAYS,
  LCX_RELEASE_MAX_MODEL_AGE_DAYS,
} from "@/lib/data-room/constants";
import { normalizeReactActionFormData } from "@/lib/data-room/action-form-data";
import { slugifyDataRoomLabel } from "@/lib/data-room/slug";
import type { DataRoomClearanceReviewRole } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { DataRoomActionState } from "./action-state";

const requestAccessFields = new Set(["requestNote"]);
const createFolderFields = new Set(["name", "description", "sortOrder"]);
const updateFolderFields = new Set(["folderId", "name", "description", "readinessStatus", "sortOrder", "intent"]);
const updateFolderRequiredFields = new Set(["folderId", "name", "readinessStatus", "sortOrder"]);
const updateDocumentFields = new Set(["documentId", "title", "description", "documentDate", "folderId", "sortOrder"]);
const documentIdFields = new Set(["documentId"]);
const clearanceMetadataFields = new Set([
  "checksumSha256",
  "mimeType",
  "sizeBytes",
  "financeOpsReviewerId",
  "redactionReviewerId",
  "counselReviewerId",
  "dataRoomAdminReviewerId",
  "expiresAt",
]);
const clearanceAttestationFields = new Set(["clearanceId", "reviewRole"]);
const voidClearanceFields = new Set(["clearanceId", "reason"]);
const releaseManifestMetadataFields = new Set([
  "pwaApprovalAttestationId",
  "pwaSourceId",
  "pwaManifestSha256",
  "pwaSnapshotSha256",
  "modelAsOf",
  "freshnessDueAt",
  "financeOpsReviewerId",
  "redactionReviewerId",
  "counselReviewerId",
  "dataRoomAdminReviewerId",
]);
const releaseAttestationFields = new Set(["manifestId", "reviewRole"]);
const releaseOpenFields = new Set(["manifestId"]);
const accessResolutionFields = new Set(["requestId", "resolution", "note"]);
const accessResolutionRequiredFields = new Set(["requestId", "resolution"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function requestAccessAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, requestAccessFields);
  if (!actionFormData) return failure("The access request contains invalid form data.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  if (!await isLcxDiligenceOpen(result.supabase)) {
    return failure("Diligence is not open. Investor access requests are not being accepted.");
  }

  const requestNote = String(actionFormData.get("requestNote") ?? "").trim().slice(0, 500);
  const { data: existing } = await result.supabase
    .from("data_room_access_requests")
    .select("status")
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .eq("user_id", result.userId)
    .maybeSingle();

  if (existing?.status === "pending") return success("Your access request is already pending.");
  if (existing?.status === "approved") return success("Your access has already been approved.");
  if (existing?.status === "revoked") return failure("This access was revoked. Contact the issuer for review.");

  const { data: request, error } = await result.supabase
    .from("data_room_access_requests")
    .insert({
      data_room_id: LCX_DATA_ROOM.id,
      user_id: result.userId,
      ...(requestNote ? { request_note: requestNote } : {}),
    })
    .select("id")
    .single();

  if (error || !request) return failure(error?.message ?? "The access request could not be created.");

  const searchParams = new URLSearchParams({
    notice: "access-requested",
    request: request.id,
  });
  redirect(`${LCX_DATA_ROOM.path}?${searchParams.toString()}`);
}

export async function createFolderAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, createFolderFields);
  if (!actionFormData) return failure("The folder form contains invalid data.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const name = String(actionFormData.get("name") ?? "").trim();
  const description = String(actionFormData.get("description") ?? "").trim();
  const sortOrder = integerValue(actionFormData.get("sortOrder"), 0);
  if (!name) return failure("Folder name is required.");

  const { error } = await result.supabase.from("data_room_folders").insert({
    data_room_id: LCX_DATA_ROOM.id,
    name,
    slug: `${slugifyDataRoomLabel(name)}-${crypto.randomUUID().slice(0, 8)}`,
    description: description || null,
    readiness_status: "missing",
    sort_order: sortOrder,
  });

  if (error) return failure(error.message);

  return success("Folder created.");
}

export async function updateFolderAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(
    formData,
    updateFolderFields,
    updateFolderRequiredFields,
  );
  if (!actionFormData) return failure("The folder form contains invalid data.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const folderId = String(actionFormData.get("folderId") ?? "");
  const name = String(actionFormData.get("name") ?? "").trim();
  const description = String(actionFormData.get("description") ?? "").trim();
  const readinessStatus = String(actionFormData.get("readinessStatus") ?? "missing");
  const sortOrder = integerValue(actionFormData.get("sortOrder"), 0);
  const intent = String(actionFormData.get("intent") ?? "save");

  if (!folderId || !name) return failure("Folder name is required.");
  if (!["ready", "in_review", "missing", "gated"].includes(readinessStatus)) {
    return failure("Folder readiness state is invalid.");
  }

  const values = intent === "archive"
    ? { archived_at: new Date().toISOString() }
    : {
        name,
        description: description || null,
        readiness_status: readinessStatus,
        sort_order: sortOrder,
      };

  const { error } = await result.supabase
    .from("data_room_folders")
    .update(values)
    .eq("id", folderId)
    .eq("data_room_id", LCX_DATA_ROOM.id);

  if (error) return failure(error.message);

  return success(intent === "archive" ? "Folder archived." : "Folder updated.");
}

export async function updateDocumentAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, updateDocumentFields);
  if (!actionFormData) return failure("The document metadata form contains invalid data.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const documentId = String(actionFormData.get("documentId") ?? "");
  const title = String(actionFormData.get("title") ?? "").trim();
  const description = String(actionFormData.get("description") ?? "").trim();
  const documentDate = String(actionFormData.get("documentDate") ?? "").trim();
  const folderId = String(actionFormData.get("folderId") ?? "");
  const sortOrder = integerValue(actionFormData.get("sortOrder"), 0);

  if (!documentId || !folderId || !title) return failure("Title and folder are required.");

  const { error } = await result.supabase
    .from("data_room_documents")
    .update({
      title,
      description: description || null,
      document_date: documentDate || null,
      folder_id: folderId,
      sort_order: sortOrder,
    })
    .eq("id", documentId)
    .eq("data_room_id", LCX_DATA_ROOM.id);

  if (error) return failure(error.message);

  return success("Document metadata updated.");
}

export async function publishDocumentAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, documentIdFields);
  if (!actionFormData) return failure("The document action contains invalid form data.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const documentId = String(actionFormData.get("documentId") ?? "");
  if (!documentId) return failure("Document is required.");

  const { error } = await result.supabase.rpc("publish_data_room_document", {
    target_document_id: documentId,
  });

  if (error) return failure(error.message);

  return success("Document published.");
}

export async function createDocumentClearanceAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const metadataFormData = normalizeReactActionFormData(formData, clearanceMetadataFields);
  if (!metadataFormData) {
    return failure("Clearance records accept only the expected fingerprint metadata; file bytes are not accepted.");
  }

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  // A clearance action is metadata-only. Do not special-case the client form's
  // candidateFile name: a malicious multipart request can use any key. Reject
  // all non-string values and unexpected/duplicated metadata fields so file
  // bytes cannot be accepted, staged, or forwarded by this action.
  const checksum = String(metadataFormData.get("checksumSha256") ?? "").trim().toLowerCase();
  const mimeType = String(metadataFormData.get("mimeType") ?? "").trim().toLowerCase();
  const sizeBytes = Number(metadataFormData.get("sizeBytes"));
  const financeOpsReviewerId = String(metadataFormData.get("financeOpsReviewerId") ?? "");
  const redactionReviewerId = String(metadataFormData.get("redactionReviewerId") ?? "");
  const counselReviewerId = String(metadataFormData.get("counselReviewerId") ?? "");
  const dataRoomAdminReviewerId = String(metadataFormData.get("dataRoomAdminReviewerId") ?? "");
  const expiresAt = String(metadataFormData.get("expiresAt") ?? "").trim();
  const parsedExpiry = new Date(expiresAt);

  if (!/^[a-f0-9]{64}$/.test(checksum)) return failure("A valid SHA-256 fingerprint is required.");
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(mimeType)) {
    return failure("Clearance MIME type must be PDF, JPEG, or PNG.");
  }
  if (!Number.isInteger(sizeBytes) || sizeBytes <= 0 || sizeBytes > 25 * 1024 * 1024) {
    return failure("Clearance file size is invalid.");
  }
  if (!Number.isFinite(parsedExpiry.valueOf()) || parsedExpiry.valueOf() <= Date.now()) {
    return failure("Choose a future clearance expiration.");
  }

  const { data, error } = await result.supabase.rpc("create_data_room_document_clearance", {
    target_data_room_id: LCX_DATA_ROOM.id,
    target_checksum_sha256: checksum,
    target_mime_type: mimeType,
    target_size_bytes: sizeBytes,
    target_finance_ops_reviewer_id: financeOpsReviewerId,
    target_redaction_reviewer_id: redactionReviewerId,
    target_counsel_reviewer_id: counselReviewerId,
    target_data_room_admin_reviewer_id: dataRoomAdminReviewerId,
    target_expires_at: parsedExpiry.toISOString(),
  });

  if (error || !data) return failure(error?.message ?? "The derivative clearance could not be created.");

  return success("Clearance created. Each assigned reviewer must attest before upload.");
}

export async function attestDocumentClearanceAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, clearanceAttestationFields);
  if (!actionFormData) return failure("Clearance review assignment is invalid.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const clearanceId = String(actionFormData.get("clearanceId") ?? "");
  const reviewRole = String(actionFormData.get("reviewRole") ?? "");
  if (!clearanceId || !isClearanceReviewRole(reviewRole)) return failure("Clearance review assignment is invalid.");

  const { error } = await result.supabase.rpc("attest_data_room_document_clearance", {
    target_clearance_id: clearanceId,
    target_review_role: reviewRole,
  });
  if (error) return failure(error.message);

  return success("Human attestation recorded for the assigned review role.");
}

export async function voidDocumentClearanceAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, voidClearanceFields);
  if (!actionFormData) return failure("A clearance and void reason are required.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const clearanceId = String(actionFormData.get("clearanceId") ?? "");
  const reason = String(actionFormData.get("reason") ?? "").trim();
  if (!clearanceId || !reason) return failure("A clearance and void reason are required.");

  const { error } = await result.supabase.rpc("void_data_room_document_clearance", {
    target_clearance_id: clearanceId,
    target_reason: reason,
  });
  if (error) return failure(error.message);

  return success("Unconsumed clearance voided.");
}

export async function archiveDocumentAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, documentIdFields);
  if (!actionFormData) return failure("The document action contains invalid form data.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const documentId = String(actionFormData.get("documentId") ?? "");
  if (!documentId) return failure("Document is required.");

  const { error } = await result.supabase.rpc("archive_data_room_document", {
    target_document_id: documentId,
  });

  if (error) return failure(error.message);

  return success("Document archived.");
}

export async function createReleaseManifestAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const metadataFormData = normalizeReactActionFormData(formData, releaseManifestMetadataFields);
  if (!metadataFormData) {
    return failure("Release manifests accept only the required opaque reference metadata.");
  }

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const approvalAttestationId = String(metadataFormData.get("pwaApprovalAttestationId") ?? "").trim();
  const sourceId = String(metadataFormData.get("pwaSourceId") ?? "").trim();
  const manifestSha256 = String(metadataFormData.get("pwaManifestSha256") ?? "").trim().toLowerCase();
  const snapshotSha256 = String(metadataFormData.get("pwaSnapshotSha256") ?? "").trim().toLowerCase();
  const modelAsOf = String(metadataFormData.get("modelAsOf") ?? "").trim();
  const freshnessDueAt = String(metadataFormData.get("freshnessDueAt") ?? "").trim();
  const financeOpsReviewerId = String(metadataFormData.get("financeOpsReviewerId") ?? "");
  const redactionReviewerId = String(metadataFormData.get("redactionReviewerId") ?? "");
  const counselReviewerId = String(metadataFormData.get("counselReviewerId") ?? "");
  const dataRoomAdminReviewerId = String(metadataFormData.get("dataRoomAdminReviewerId") ?? "");
  const parsedFreshnessDueAt = new Date(freshnessDueAt);

  if (!UUID.test(approvalAttestationId)) return failure("A valid PWA approval attestation ID is required.");
  if (!sourceId || sourceId.length > 200) return failure("A valid opaque PWA source ID is required.");
  if (!/^[a-f0-9]{64}$/.test(manifestSha256)) return failure("A valid PWA manifest SHA-256 is required.");
  if (!/^[a-f0-9]{64}$/.test(snapshotSha256)) return failure("A valid PWA snapshot SHA-256 is required.");
  if (!isCalendarDate(modelAsOf)) return failure("Model cut must use PWA calendar-date format YYYY-MM-DD.");
  if (!isModelCutWithinReleaseWindow(modelAsOf)) {
    return failure(`Model cut must be today or within the prior ${LCX_RELEASE_MAX_MODEL_AGE_DAYS} calendar days.`);
  }
  if (!Number.isFinite(parsedFreshnessDueAt.valueOf()) || parsedFreshnessDueAt.valueOf() <= Date.now()) {
    return failure("Choose a future PWA freshness deadline.");
  }
  if (!isFreshnessWithinReleaseWindow(modelAsOf, parsedFreshnessDueAt)) {
    return failure(`Freshness must be within ${LCX_RELEASE_MAX_FRESHNESS_DAYS} days of both the current time and the PWA model cut.`);
  }

  const { data, error } = await result.supabase.rpc("create_data_room_release_manifest", {
    target_release_context_data_room_id: LCX_DATA_ROOM.id,
    target_pwa_approval_attestation_id: approvalAttestationId,
    target_pwa_source_id: sourceId,
    target_pwa_manifest_sha256: manifestSha256,
    target_pwa_snapshot_sha256: snapshotSha256,
    target_model_as_of: modelAsOf,
    target_freshness_due_at: parsedFreshnessDueAt.toISOString(),
    target_finance_ops_reviewer_id: financeOpsReviewerId,
    target_redaction_reviewer_id: redactionReviewerId,
    target_counsel_reviewer_id: counselReviewerId,
    target_data_room_admin_reviewer_id: dataRoomAdminReviewerId,
  });

  if (error || !data) return failure(error?.message ?? "The release manifest could not be created.");

  return success("Release manifest created. Four assigned reviewers must attest before an administrator can open diligence.");
}

export async function attestReleaseManifestAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, releaseAttestationFields);
  if (!actionFormData) return failure("Release-manifest review assignment is invalid.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const manifestId = String(actionFormData.get("manifestId") ?? "");
  const reviewRole = String(actionFormData.get("reviewRole") ?? "");
  if (!UUID.test(manifestId) || !isClearanceReviewRole(reviewRole)) {
    return failure("Release-manifest review assignment is invalid.");
  }

  const { error } = await result.supabase.rpc("attest_data_room_release_manifest", {
    target_manifest_id: manifestId,
    target_review_role: reviewRole,
  });
  if (error) return failure(error.message);

  return success("Human release attestation recorded for the assigned review role.");
}

export async function openLcxDiligenceAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(formData, releaseOpenFields);
  if (!actionFormData) return failure("A valid release manifest is required.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const manifestId = String(actionFormData.get("manifestId") ?? "");
  if (!UUID.test(manifestId)) return failure("A valid release manifest is required.");

  const { error } = await result.supabase.rpc("open_data_room_diligence", {
    target_manifest_id: manifestId,
  });
  if (error) return failure(error.message);

  return success("LCX diligence is open for approved access requests.");
}

export async function closeLcxDiligenceAction(
  previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  void previousState;
  void formData;
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const { error } = await result.supabase.rpc("close_data_room_diligence");
  if (error) return failure(error.message);

  return success("LCX diligence is closed. Internal preparation remains available to managers.");
}

export async function resolveAccessAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const actionFormData = normalizeReactActionFormData(
    formData,
    accessResolutionFields,
    accessResolutionRequiredFields,
  );
  if (!actionFormData) return failure("Choose a valid access resolution.");

  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const requestId = String(actionFormData.get("requestId") ?? "");
  const resolution = String(actionFormData.get("resolution") ?? "");
  const note = String(actionFormData.get("note") ?? "").trim();

  if (!requestId || !["approved", "revoked"].includes(resolution)) {
    return failure("Choose a valid access resolution.");
  }

  const { error } = await result.supabase.rpc("resolve_data_room_access", {
    request_id: requestId,
    resolution,
    note: note || null,
  });

  if (error) return failure(error.message);

  return success(resolution === "approved" ? "Access approved." : "Access revoked.");
}

export async function recordVisitAction() {
  const result = await authenticatedClient();
  if (!result.ok) return;

  const now = new Date().toISOString();
  await result.supabase.from("data_room_visits").upsert(
    {
      data_room_id: LCX_DATA_ROOM.id,
      user_id: result.userId,
      last_visited_at: now,
    },
    { onConflict: "data_room_id,user_id" },
  );
}

async function authenticatedClient() {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured in this environment." } as const;

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return { ok: false, error: "Your session has expired. Sign in again." } as const;

  return { ok: true, supabase, userId } as const;
}

function integerValue(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

async function isLcxDiligenceOpen(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>) {
  const { data, error } = await supabase.rpc("get_data_room_release_state");
  return !error && data === "diligence_open";
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isModelCutWithinReleaseWindow(value: string) {
  const modelCut = new Date(`${value}T00:00:00.000Z`).valueOf();
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const earliestAllowed = today - LCX_RELEASE_MAX_MODEL_AGE_DAYS * 24 * 60 * 60 * 1000;
  return modelCut >= earliestAllowed && modelCut <= today;
}

function isFreshnessWithinReleaseWindow(modelAsOf: string, freshnessDueAt: Date) {
  const [year, month, day] = modelAsOf.split("-").map(Number);
  const modelCut = Date.UTC(year, month - 1, day);
  const maxFromModelCut = modelCut + LCX_RELEASE_MAX_FRESHNESS_DAYS * 24 * 60 * 60 * 1000;
  const maxFromNow = Date.now() + LCX_RELEASE_MAX_FRESHNESS_DAYS * 24 * 60 * 60 * 1000;
  return freshnessDueAt.valueOf() <= maxFromModelCut && freshnessDueAt.valueOf() <= maxFromNow;
}

function isClearanceReviewRole(value: string): value is DataRoomClearanceReviewRole {
  return ["finance_ops", "redaction", "counsel", "data_room_admin"].includes(value);
}

function failure(message: string): DataRoomActionState {
  return { status: "error", message };
}

function success(message: string): DataRoomActionState {
  return { status: "success", message };
}
