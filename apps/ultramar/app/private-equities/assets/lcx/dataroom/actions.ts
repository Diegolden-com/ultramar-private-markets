"use server";

import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { slugifyDataRoomLabel } from "@/lib/data-room/slug";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { DataRoomActionState } from "./action-state";

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

  const notice = resolution === "approved" ? "access-approved" : "access-revoked";
  const searchParams = new URLSearchParams({
    view: "admin",
    notice,
    request: requestId,
  });
  redirect(`${LCX_DATA_ROOM.path}?${searchParams.toString()}`);
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

export async function cleanupDataRoomObjectAction(storagePath: string) {
  const result = await authenticatedClient();
  if (!result.ok) return;

  const [dataRoomId, documentId] = storagePath.split("/");
  if (dataRoomId !== LCX_DATA_ROOM.id || !documentId) return;

  const { data: canManage, error: capabilityError } = await result.supabase.rpc(
    "can_manage_data_room",
    { target_data_room_id: LCX_DATA_ROOM.id },
  );
  if (capabilityError || canManage !== true) return;

  const { count, error: referenceError } = await result.supabase
    .from("data_room_document_versions")
    .select("id", { count: "exact", head: true })
    .eq("storage_path", storagePath);
  if (referenceError || (count ?? 0) > 0) return;

  const admin = await createAdminClient();
  if (!admin) return;

  await admin.storage.from(LCX_DATA_ROOM.bucket).remove([storagePath]);
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

function failure(message: string): DataRoomActionState {
  return { status: "error", message };
}

function success(message: string): DataRoomActionState {
  return { status: "success", message };
}
