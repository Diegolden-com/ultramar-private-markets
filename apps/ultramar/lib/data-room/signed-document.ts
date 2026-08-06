import { ensureLcxSessionAudit } from "@/lib/auth/session-audit";
import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxiedDocumentResponse(
  _request: NextRequest,
  documentId: string,
  disposition: "open" | "download",
) {
  const supabase = await createClient();
  if (!supabase) return privateNotFound();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return privateNotFound();

  const auditResult = await ensureLcxSessionAudit(supabase, LCX_DATA_ROOM.path);
  if (!auditResult.ok) return privateNotFound();

  const { data: document, error: documentError } = await supabase
    .from("data_room_documents")
    .select("id,data_room_id,published_version_id")
    .eq("id", documentId)
    .eq("data_room_id", LCX_DATA_ROOM.id)
    .maybeSingle();

  if (documentError || !document) return privateNotFound();

  // Managers can see the unpublished current version through RLS. Investors
  // cannot, so they fall back to the explicitly published version instead.
  const { data: currentVersion, error: currentVersionError } = await supabase
    .from("data_room_document_versions")
    .select("id,storage_path,original_filename,mime_type")
    .eq("document_id", documentId)
    .eq("is_current", true)
    .is("archived_at", null)
    .maybeSingle();

  if (currentVersionError) return privateNotFound();

  let version = currentVersion;

  if (!version && document.published_version_id) {
    const { data: publishedVersion, error: publishedVersionError } = await supabase
      .from("data_room_document_versions")
      .select("id,storage_path,original_filename,mime_type")
      .eq("id", document.published_version_id)
      .eq("document_id", documentId)
      .is("archived_at", null)
      .maybeSingle();

    if (publishedVersionError) return privateNotFound();
    version = publishedVersion;
  }

  if (!version) return privateNotFound();

  const admin = createAdminClient();
  if (!admin) return privateNotFound();

  // RLS is the primary boundary for document metadata. Recheck the selected
  // version immediately before the privileged storage fetch: it proves this
  // exact version is the consumed target of an active clearance and that the
  // LCX release gate is still open for an investor. The application returns
  // the bytes directly; it never redirects to a reusable Storage signed URL.
  // This also fails closed for legacy rows that predate the clearance flow.
  const { data: canViewVersion, error: canViewVersionError } = await supabase.rpc(
    "can_view_data_room_document_version",
    {
      target_document_id: document.id,
      target_version_id: version.id,
    },
  );
  if (canViewVersionError || canViewVersion !== true) return privateNotFound();

  const { data: file, error: fileError } = await admin.storage
    .from(LCX_DATA_ROOM.bucket)
    .download(version.storage_path);
  if (fileError || !file) return privateNotFound();

  const { error: auditError } = await admin.from("data_room_activity_events").insert({
    data_room_id: LCX_DATA_ROOM.id,
    actor_user_id: userId,
    document_id: documentId,
    document_version_id: version.id,
    event_type: disposition,
    metadata: { mime_type: version.mime_type },
  });

  if (auditError) return privateNotFound();

  // Stream the private object through the application instead of buffering a
  // Blob in a serverless response. The controlled bucket permits 25 MiB
  // derivatives, which is larger than Vercel's non-streaming response limit.
  return new NextResponse(file.stream(), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `${disposition === "download" ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(version.original_filename)}`,
      "Content-Length": String(file.size),
      "Content-Type": version.mime_type,
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function privateNotFound() {
  return NextResponse.json({ error: "Document not found" }, { status: 404, headers: { "Cache-Control": "private, no-store" } });
}
