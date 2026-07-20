import { getSupabaseAdminConfig } from "@/lib/supabase/config";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a privileged client for narrowly scoped server-side operations.
 *
 * This deliberately does not use the SSR client: attaching a user session to
 * a secret-key client would replace its Authorization header. The environment
 * variables read here have no NEXT_PUBLIC prefix and must never be exposed to
 * browser code.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("The Supabase admin client is server-only.");
  }

  const config = getSupabaseAdminConfig();
  if (!config) return null;

  return createClient(config.url, config.secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
