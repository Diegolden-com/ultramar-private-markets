import { ensureLcxSessionAudit } from "@/lib/auth/session-audit";
import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function signedDocumentResponse(
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

  // RLS is the primary boundary for document metadata. Recheck the selected
  // version through a controlled database predicate before issuing a signed
  // object URL: it proves that this exact version is the consumed target of an
  // active, complete clearance. This also fails closed for legacy rows that
  // predate the clearance workflow.
  const { data: canViewVersion, error: canViewVersionError } = await supabase.rpc(
    "can_view_data_room_document_version",
    {
      target_document_id: document.id,
      target_version_id: version.id,
    },
  );
  if (canViewVersionError || canViewVersion !== true) return privateNotFound();

  const admin = createAdminClient();
  if (!admin) return privateNotFound();

  const signedResult = disposition === "download"
    ? await admin.storage
        .from(LCX_DATA_ROOM.bucket)
        .createSignedUrl(version.storage_path, LCX_DATA_ROOM.signedUrlLifetimeSeconds, {
          download: version.original_filename,
        })
    : await admin.storage
        .from(LCX_DATA_ROOM.bucket)
        .createSignedUrl(version.storage_path, LCX_DATA_ROOM.signedUrlLifetimeSeconds);

  if (signedResult.error || !signedResult.data?.signedUrl) return privateNotFound();

  const { error: auditError } = await admin.from("data_room_activity_events").insert({
    data_room_id: LCX_DATA_ROOM.id,
    actor_user_id: userId,
    document_id: documentId,
    document_version_id: version.id,
    event_type: disposition,
    metadata: { mime_type: version.mime_type },
  });

  if (auditError) return privateNotFound();

  const response = NextResponse.redirect(signedResult.data.signedUrl);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function privateNotFound() {
  return NextResponse.json({ error: "Document not found" }, { status: 404, headers: { "Cache-Control": "private, no-store" } });
}
