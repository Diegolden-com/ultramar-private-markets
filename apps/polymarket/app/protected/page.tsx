import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Shield } from "lucide-react";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-10">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          This is a protected page visible only to authenticated users
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Your session details</h2>
        <pre className="overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-xs text-muted-foreground">
          <Suspense
            fallback={
              <span className="text-muted-foreground">Loading...</span>
            }
          >
            <UserDetails />
          </Suspense>
        </pre>
      </div>
    </div>
  );
}
