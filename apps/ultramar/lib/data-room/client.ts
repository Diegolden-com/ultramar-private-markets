"use client";

import { cleanupDataRoomObjectAction } from "@/app/private-equities/assets/lcx/dataroom/actions";
import {
  DATA_ROOM_ALLOWED_MIME_TYPES,
  LCX_DATA_ROOM,
} from "@/lib/data-room/constants";
import { slugifyDataRoomLabel } from "@/lib/data-room/slug";
import { createClient } from "@/lib/supabase/client";

export type NewDocumentInput = {
  title: string;
  description: string;
  documentDate: string;
  folderId: string;
  sortOrder: number;
  file: File;
};

export async function uploadNewDocument(input: NewDocumentInput) {
  const context = await browserContext();
  validateFile(input.file);

  const documentId = crypto.randomUUID();
  const versionId = crypto.randomUUID();
  const mimeType = resolveMimeType(input.file);
  const storagePath = objectPath(documentId, versionId, input.file.name);
  const checksum = await sha256(input.file);
  const slug = `${slugifyDataRoomLabel(input.title)}-${documentId.slice(0, 8)}`;

  const { error: documentError } = await context.supabase.from("data_room_documents").insert({
    id: documentId,
    data_room_id: LCX_DATA_ROOM.id,
    folder_id: input.folderId,
    slug,
    title: input.title.trim(),
    description: input.description.trim() || null,
    document_date: input.documentDate || null,
    sort_order: input.sortOrder,
    created_by: context.userId,
  });

  if (documentError) throw new Error(documentError.message);

  const { error: uploadError } = await context.supabase.storage
    .from(LCX_DATA_ROOM.bucket)
    .upload(storagePath, input.file, { cacheControl: "0", contentType: mimeType, upsert: false });

  if (uploadError) {
    await archiveFailedDocument(context.supabase, documentId);
    throw new Error(uploadError.message);
  }

  const { error: versionError } = await context.supabase.rpc("append_data_room_document_version", {
    target_document_id: documentId,
    target_version_id: versionId,
    target_storage_path: storagePath,
    target_original_filename: input.file.name,
    target_mime_type: mimeType,
    target_size_bytes: input.file.size,
    target_checksum_sha256: checksum,
  });

  if (versionError) {
    await Promise.all([
      cleanupDataRoomObjectAction(storagePath),
      archiveFailedDocument(context.supabase, documentId),
    ]);
    throw new Error(versionError.message);
  }
}

export async function uploadDocumentVersion(documentId: string, file: File) {
  const context = await browserContext();
  validateFile(file);

  const { data: document, error: documentError } = await context.supabase
    .from("data_room_documents")
    .select("id")
    .eq("id", documentId)
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .single();

  if (documentError || !document) throw new Error(documentError?.message ?? "Document not found.");

  const versionId = crypto.randomUUID();
  const mimeType = resolveMimeType(file);
  const storagePath = objectPath(documentId, versionId, file.name);
  const checksum = await sha256(file);

  const { error: uploadError } = await context.supabase.storage
    .from(LCX_DATA_ROOM.bucket)
    .upload(storagePath, file, { cacheControl: "0", contentType: mimeType, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { error: versionError } = await context.supabase.rpc("append_data_room_document_version", {
    target_document_id: documentId,
    target_version_id: versionId,
    target_storage_path: storagePath,
    target_original_filename: file.name,
    target_mime_type: mimeType,
    target_size_bytes: file.size,
    target_checksum_sha256: checksum,
  });

  if (versionError) {
    await cleanupDataRoomObjectAction(storagePath);
    throw new Error(versionError.message);
  }
}

async function browserContext() {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase is not configured in this environment.");

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) throw new Error("Your session has expired. Sign in again.");

  return { supabase, userId };
}

function validateFile(file: File) {
  const mimeType = resolveMimeType(file);
  if (file.size <= 0) throw new Error("Choose a non-empty file.");
  if (file.size > LCX_DATA_ROOM.maxFileSizeBytes) throw new Error("Files must be 25 MB or smaller.");
  if (!DATA_ROOM_ALLOWED_MIME_TYPES.includes(mimeType as (typeof DATA_ROOM_ALLOWED_MIME_TYPES)[number])) {
    throw new Error("Use PDF, CSV, DOCX, XLSX, JPEG, or PNG files.");
  }
}

function resolveMimeType(file: File) {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeByExtension: Record<string, string> = {
    pdf: "application/pdf",
    csv: "text/csv",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  return extension ? (mimeByExtension[extension] ?? "application/octet-stream") : "application/octet-stream";
}

function objectPath(documentId: string, versionId: string, filename: string) {
  const safeFilename = filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(-120) || "document";
  return `${LCX_DATA_ROOM.id}/${documentId}/${versionId}-${safeFilename}`;
}

async function sha256(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function archiveFailedDocument(
  supabase: NonNullable<ReturnType<typeof createClient>>,
  documentId: string,
) {
  return supabase.rpc("archive_data_room_document", {
    target_document_id: documentId,
  });
}
