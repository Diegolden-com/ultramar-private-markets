import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { slugifyDataRoomLabel } from "@/lib/data-room/slug";
import { inspectRedactedDerivative, sha256Hex } from "@/lib/data-room/upload-policy";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonError("Invalid upload origin.", 403);

  const context = await managerContext();
  if (!context.ok) return jsonError(context.error, context.status);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("A valid multipart upload is required.", 400);
  }

  const file = formData.get("file");
  if (!isFile(file)) return jsonError("Choose a file to upload.", 400);

  let derivative: Awaited<ReturnType<typeof inspectRedactedDerivative>>;
  try {
    derivative = await inspectRedactedDerivative(file);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "The file could not be validated.", 400);
  }

  const clearanceId = formValue(formData, "clearanceId");
  if (!UUID.test(clearanceId)) {
    return jsonError("Select a complete derivative clearance before uploading.", 400);
  }

  const checksum = await sha256Hex(file);
  const { error: clearanceError } = await context.supabase.rpc("assert_data_room_document_clearance", {
    target_clearance_id: clearanceId,
    target_data_room_id: LCX_DATA_ROOM.id,
    target_checksum_sha256: checksum,
    target_mime_type: derivative.mimeType,
    target_size_bytes: file.size,
  });
  if (clearanceError) {
    return jsonError("The selected clearance is not complete, current, or bound to this exact derivative.", 400);
  }

  const uploadKind = formValue(formData, "kind");
  if (uploadKind === "new") {
    const newDocument = parseNewDocument(formData);
    if (!newDocument.ok) return jsonError(newDocument.error, 400);

    return uploadNewDocument(context, newDocument.value, clearanceId, checksum, file, derivative);
  }

  if (uploadKind === "version") {
    const documentId = formValue(formData, "documentId");
    if (!UUID.test(documentId)) return jsonError("A valid document is required.", 400);

    return uploadVersion(context, documentId, clearanceId, checksum, file, derivative);
  }

  return jsonError("Choose a valid upload operation.", 400);
}

async function uploadNewDocument(
  context: UploadContext,
  input: NewDocumentFields,
  clearanceId: string,
  checksum: string,
  file: File,
  derivative: Awaited<ReturnType<typeof inspectRedactedDerivative>>,
) {
  const documentId = crypto.randomUUID();
  const versionId = crypto.randomUUID();
  const slugBase = slugifyDataRoomLabel(input.title) || "redacted-document";

  const { error: documentError } = await context.supabase.from("data_room_documents").insert({
    id: documentId,
    data_room_id: LCX_DATA_ROOM.id,
    folder_id: input.folderId,
    slug: `${slugBase}-${documentId.slice(0, 8)}`,
    title: input.title,
    description: input.description,
    document_date: input.documentDate,
    sort_order: input.sortOrder,
    created_by: context.userId,
  });

  if (documentError) return jsonError("The document register could not be updated.", 400);

  const versionResult = await persistVersion(context, documentId, versionId, clearanceId, checksum, file, derivative);
  if (!versionResult.ok) {
    await context.supabase.rpc("archive_data_room_document", { target_document_id: documentId });
    return jsonError(versionResult.error, 400);
  }

  return NextResponse.json({ ok: true, documentId }, { headers: noStoreHeaders() });
}

async function uploadVersion(
  context: UploadContext,
  documentId: string,
  clearanceId: string,
  checksum: string,
  file: File,
  derivative: Awaited<ReturnType<typeof inspectRedactedDerivative>>,
) {
  const { data: document, error: documentError } = await context.supabase
    .from("data_room_documents")
    .select("id")
    .eq("id", documentId)
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .maybeSingle();

  if (documentError || !document) return jsonError("Document not found or not manageable.", 404);

  const versionResult = await persistVersion(context, documentId, crypto.randomUUID(), clearanceId, checksum, file, derivative);
  if (!versionResult.ok) return jsonError(versionResult.error, 400);

  return NextResponse.json({ ok: true, documentId }, { headers: noStoreHeaders() });
}

async function persistVersion(
  context: UploadContext,
  documentId: string,
  versionId: string,
  clearanceId: string,
  checksum: string,
  file: File,
  derivative: Awaited<ReturnType<typeof inspectRedactedDerivative>>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Secure document storage is not configured." };

  const storagePath = `${LCX_DATA_ROOM.id}/${documentId}/${versionId}-${derivative.filename}`;
  const { error: storageError } = await admin.storage
    .from(LCX_DATA_ROOM.bucket)
    .upload(storagePath, file, {
      cacheControl: "0",
      contentType: derivative.mimeType,
      upsert: false,
    });

  if (storageError) return { ok: false, error: "The derivative could not be stored." };

  const { error: versionError } = await context.supabase.rpc("append_data_room_document_version", {
    target_document_id: documentId,
    target_version_id: versionId,
    target_storage_path: storagePath,
    target_original_filename: derivative.filename,
    target_mime_type: derivative.mimeType,
    target_size_bytes: file.size,
    target_checksum_sha256: checksum,
    target_clearance_id: clearanceId,
  });

  if (!versionError) return { ok: true };

  await admin.storage.from(LCX_DATA_ROOM.bucket).remove([storagePath]);
  return { ok: false, error: "The derivative did not pass the data-room integrity checks." };
}

async function managerContext(): Promise<
  | { ok: true; supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>; userId: string }
  | { ok: false; error: string; status: number }
> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured in this environment.", status: 503 };

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return { ok: false, error: "Sign in again to upload a document.", status: 401 };

  const { data: canManage, error: capabilityError } = await supabase.rpc("can_manage_data_room", {
    target_data_room_id: LCX_DATA_ROOM.id,
  });
  if (capabilityError || canManage !== true) {
    return { ok: false, error: "You are not authorized to upload data-room documents.", status: 403 };
  }

  return { ok: true, supabase, userId };
}

type UploadContext = Extract<Awaited<ReturnType<typeof managerContext>>, { ok: true }>;
type NewDocumentFields = {
  title: string;
  description: string | null;
  documentDate: string | null;
  folderId: string;
  sortOrder: number;
};

function parseNewDocument(formData: FormData): { ok: true; value: NewDocumentFields } | { ok: false; error: string } {
  const title = formValue(formData, "title").trim();
  const description = formValue(formData, "description").trim();
  const documentDate = formValue(formData, "documentDate").trim();
  const folderId = formValue(formData, "folderId");
  const sortOrderRaw = formValue(formData, "sortOrder");
  const sortOrder = Number(sortOrderRaw || "0");

  if (!title || title.length > 200) return { ok: false, error: "Document title is required and must be 200 characters or fewer." };
  if (description.length > 2_000) return { ok: false, error: "Description must be 2,000 characters or fewer." };
  if (!UUID.test(folderId)) return { ok: false, error: "A valid folder is required." };
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 100_000) {
    return { ok: false, error: "Document order is invalid." };
  }
  if (documentDate && !isIsoDate(documentDate)) return { ok: false, error: "Document date must be a calendar date." };

  return {
    ok: true,
    value: {
      title,
      description: description || null,
      documentDate: documentDate || null,
      folderId,
      sortOrder,
    },
  };
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    if (origin === new URL(request.url).origin) return true;

    // Next may canonicalize its local request URL to localhost while the
    // browser correctly uses 127.0.0.1. Trust only the exact host/protocol
    // pair the request reached, never an arbitrary Origin header.
    const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
      || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
      || new URL(request.url).protocol.replace(":", "");
    return Boolean(host && origin === `${protocol}://${host}`);
  }

  // Chromium can omit Origin for a same-origin multipart fetch. Do not turn
  // that into an unauthenticated bypass: accept the fallback only when the
  // browser's fetch metadata explicitly identifies a same-origin request.
  return request.headers.get("sec-fetch-site") === "same-origin";
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders() });
}

function noStoreHeaders() {
  return { "Cache-Control": "private, no-store, max-age=0" };
}
