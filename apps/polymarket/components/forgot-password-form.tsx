"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
        {success ? (
          <>
            <div className="avatar placeholder mx-auto mt-6">
              <div className="w-12 rounded-full border border-border bg-secondary text-primary">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              If you registered with this email, you&apos;ll receive a password
              reset link.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Reset password
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </>
        )}
      </div>

      {!success && (
        <div className="card card-border bg-card">
          <form onSubmit={handleForgotPassword}>
            <fieldset className="card-body fieldset gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="label text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full bg-background"
                />
              </div>
              {error && (
                <div className="alert alert-error alert-soft text-sm">
                  {error}
                </div>
              )}
              <Button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </fieldset>
          </form>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
