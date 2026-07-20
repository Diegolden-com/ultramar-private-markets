import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. proxy.ts refreshes them
          // before the component tree reads the authenticated session.
        }
      },
    },
  });
}

export type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export async function clearLocalSupabaseSession(supabase: SupabaseServerClient | null) {
  let signOutError: unknown = null;

  if (supabase) {
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      signOutError = error;
    } catch (error) {
      signOutError = error;
    }
  }

  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")) {
      cookieStore.delete(cookie.name);
    }
  }

  return { error: signOutError };
}
