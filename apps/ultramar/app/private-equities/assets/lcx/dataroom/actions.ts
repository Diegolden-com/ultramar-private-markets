"use server";

import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { slugifyDataRoomLabel } from "@/lib/data-room/slug";
import type { DataRoomClearanceReviewRole } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { DataRoomActionState } from "./action-state";

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

export async function requestAccessAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const requestNote = String(formData.get("requestNote") ?? "").trim().slice(0, 500);
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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = integerValue(formData.get("sortOrder"), 0);
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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const folderId = String(formData.get("folderId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const readinessStatus = String(formData.get("readinessStatus") ?? "missing");
  const sortOrder = integerValue(formData.get("sortOrder"), 0);
  const intent = String(formData.get("intent") ?? "save");

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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const documentId = String(formData.get("documentId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const documentDate = String(formData.get("documentDate") ?? "").trim();
  const folderId = String(formData.get("folderId") ?? "");
  const sortOrder = integerValue(formData.get("sortOrder"), 0);

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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const documentId = String(formData.get("documentId") ?? "");
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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  // A clearance action is metadata-only. Do not special-case the client form's
  // candidateFile name: a malicious multipart request can use any key. Reject
  // all non-string values and unexpected/duplicated metadata fields so file
  // bytes cannot be accepted, staged, or forwarded by this action.
  if (!hasOnlyExpectedClearanceMetadata(formData)) {
    return failure("Clearance records accept only the expected fingerprint metadata; file bytes are not accepted.");
  }

  const checksum = String(formData.get("checksumSha256") ?? "").trim().toLowerCase();
  const mimeType = String(formData.get("mimeType") ?? "").trim().toLowerCase();
  const sizeBytes = Number(formData.get("sizeBytes"));
  const financeOpsReviewerId = String(formData.get("financeOpsReviewerId") ?? "");
  const redactionReviewerId = String(formData.get("redactionReviewerId") ?? "");
  const counselReviewerId = String(formData.get("counselReviewerId") ?? "");
  const dataRoomAdminReviewerId = String(formData.get("dataRoomAdminReviewerId") ?? "");
  const expiresAt = String(formData.get("expiresAt") ?? "").trim();
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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const clearanceId = String(formData.get("clearanceId") ?? "");
  const reviewRole = String(formData.get("reviewRole") ?? "");
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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const clearanceId = String(formData.get("clearanceId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
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
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const documentId = String(formData.get("documentId") ?? "");
  if (!documentId) return failure("Document is required.");

  const { error } = await result.supabase.rpc("archive_data_room_document", {
    target_document_id: documentId,
  });

  if (error) return failure(error.message);

  return success("Document archived.");
}

export async function resolveAccessAction(
  _previousState: DataRoomActionState,
  formData: FormData,
): Promise<DataRoomActionState> {
  const result = await authenticatedClient();
  if (!result.ok) return failure(result.error);

  const requestId = String(formData.get("requestId") ?? "");
  const resolution = String(formData.get("resolution") ?? "");
  const note = String(formData.get("note") ?? "").trim();

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

function hasOnlyExpectedClearanceMetadata(formData: FormData) {
  const receivedFields = new Set<string>();

  for (const [name, value] of formData.entries()) {
    if (
      !clearanceMetadataFields.has(name)
      || receivedFields.has(name)
      || typeof value !== "string"
    ) {
      return false;
    }
    receivedFields.add(name);
  }

  return clearanceMetadataFields.size === receivedFields.size;
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
