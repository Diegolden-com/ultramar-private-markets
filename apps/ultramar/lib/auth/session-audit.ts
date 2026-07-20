import { resolveAuthReturnTo, targetsLcxDataRoom } from "@/lib/auth/redirects";
import { LCX_DATA_ROOM } from "@/lib/data-room/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseServerClient } from "@/lib/supabase/server";

type SessionAuditResult =
  | { ok: true; audited: boolean }
  | { ok: false; error: string };

const auditUnavailableMessage =
  "Secure account auditing is not configured in this environment.";
const auditFailureMessage = "Sign-in could not be recorded. Please try again.";

export async function ensureLcxSessionAudit(
  supabase: SupabaseServerClient,
  destination: string,
): Promise<SessionAuditResult> {
  if (!targetsLcxDataRoom(destination)) return { ok: true, audited: false };

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const sessionId = claimsData?.claims?.session_id;

  if (
    claimsError ||
    typeof userId !== "string" ||
    typeof sessionId !== "string" ||
    !sessionId
  ) {
    return { ok: false, error: auditFailureMessage };
  }

  const eventId = await sessionAuditEventId(sessionId);
  const { data: existingEvent, error: lookupError } = await supabase
    .from("data_room_activity_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  if (lookupError) return { ok: false, error: auditFailureMessage };
  if (existingEvent) return { ok: true, audited: true };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: auditUnavailableMessage };

  const { error: auditError } = await admin.from("data_room_activity_events").upsert(
    {
      id: eventId,
      data_room_id: LCX_DATA_ROOM.id,
      actor_user_id: userId,
      event_type: "login",
      metadata: { destination: resolveAuthReturnTo(destination) },
    },
    { onConflict: "id", ignoreDuplicates: true },
  );

  if (auditError) return { ok: false, error: auditFailureMessage };
  return { ok: true, audited: true };
}

async function sessionAuditEventId(sessionId: string) {
  const namespace = uuidBytes(LCX_DATA_ROOM.id);
  const name = new TextEncoder().encode(sessionId);
  const input = new Uint8Array(namespace.length + name.length);
  input.set(namespace);
  input.set(name, namespace.length);

  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", input));
  const bytes = digest.slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidBytes(value: string) {
  const hex = value.replaceAll("-", "");
  return Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
}
