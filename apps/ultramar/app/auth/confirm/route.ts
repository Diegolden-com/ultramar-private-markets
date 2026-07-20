import { resolveAuthReturnTo, safeReturnTo } from "@/lib/auth/redirects";
import { ensureLcxSessionAudit } from "@/lib/auth/session-audit";
import { clearLocalSupabaseSession, createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const next = safeReturnTo(request.nextUrl.searchParams.get("next"));
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");

  if (!supabase) return authErrorRedirect(request, "configuration_missing", next);

  const result = tokenHash && type
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("Missing authentication code") };

  if (!result.error) {
    const auditResult = await ensureLcxSessionAudit(supabase, next);
    if (!auditResult.ok) {
      await clearLocalSupabaseSession(supabase);
      return authErrorRedirect(request, "audit_failed", next);
    }

    return noStoreRedirect(new URL(next, request.url));
  }

  return authErrorRedirect(request, "confirmation_failed", next);
}

function authErrorRedirect(request: NextRequest, reason: string, next: string) {
  const errorUrl = new URL("/auth/error", request.url);
  errorUrl.searchParams.set("reason", reason);
  errorUrl.searchParams.set("returnTo", resolveAuthReturnTo(next));
  return noStoreRedirect(errorUrl);
}

function noStoreRedirect(location: URL) {
  const response = NextResponse.redirect(location);
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0",
  );
  response.headers.set("Expires", "0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
