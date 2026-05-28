"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="text-center">
        <Link
          href="/"
          className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          Ultramar
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          New password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      <div className="card card-border bg-card">
        <form onSubmit={handleForgotPassword}>
          <fieldset className="card-body fieldset gap-5">
            <div className="grid gap-2">
              <Label htmlFor="password" className="label text-xs font-medium uppercase tracking-wider text-muted-foreground">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-background"
              />
            </div>
            {error && (
              <div className="alert alert-error alert-soft text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save new password"}
            </Button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
