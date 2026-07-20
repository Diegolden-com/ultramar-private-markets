"use server";

import { safeReturnTo, withReturnTo } from "@/lib/auth/redirects";
import { ensureLcxSessionAudit } from "@/lib/auth/session-audit";
import { getSiteUrl } from "@/lib/supabase/config";
import { clearLocalSupabaseSession, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AuthActionState } from "./action-state";

const missingConfigMessage =
  "Account access is not configured in this environment. Add the Supabase public variables to continue.";

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    returnTo: safeReturnTo(formData.get("returnTo")),
  };
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { email, password, returnTo } = credentials(formData);
  if (!email || !password) return failure("Enter your email address and password.");

  const supabase = await createClient();
  if (!supabase) return failure(missingConfigMessage);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return failure(error?.message ?? "The account could not be signed in.");

  const auditResult = await ensureLcxSessionAudit(supabase, returnTo);
  if (!auditResult.ok) {
    await clearLocalSupabaseSession(supabase);
    return failure(auditResult.error);
  }

  redirect(returnTo);
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { email, password, returnTo } = credentials(formData);
  const fullName = String(formData.get("fullName") ?? "").trim();
  const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

  if (!fullName || !email || !password) return failure("Complete every account field.");
  if (password.length < 10) return failure("Use a password with at least 10 characters.");
  if (password !== passwordConfirmation) return failure("The passwords do not match.");

  const supabase = await createClient();
  if (!supabase) return failure(missingConfigMessage);

  const confirmationUrl = new URL("/auth/confirm", getSiteUrl());
  confirmationUrl.searchParams.set("next", returnTo);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: confirmationUrl.toString(),
    },
  });

  if (error) return failure(error.message);
  if (data.session) {
    const auditResult = await ensureLcxSessionAudit(supabase, returnTo);
    if (!auditResult.ok) {
      await clearLocalSupabaseSession(supabase);
      return failure(auditResult.error);
    }
    redirect(returnTo);
  }

  redirect(`/auth/sign-up-success?returnTo=${encodeURIComponent(returnTo)}`);
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const returnTo = safeReturnTo(formData.get("returnTo"));
  if (!email) return failure("Enter the email tied to your account.");

  const supabase = await createClient();
  if (!supabase) return failure(missingConfigMessage);

  const recoveryUrl = new URL("/auth/confirm", getSiteUrl());
  recoveryUrl.searchParams.set("next", withReturnTo("/auth/update-password", returnTo));

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: recoveryUrl.toString(),
  });

  if (error) return failure(error.message);

  return {
    status: "success",
    message: "If that account exists, a password reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

  if (password.length < 10) return failure("Use a password with at least 10 characters.");
  if (password !== passwordConfirmation) return failure("The passwords do not match.");

  const supabase = await createClient();
  if (!supabase) return failure(missingConfigMessage);

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return failure(error.message);

  return { status: "success", message: "Password updated. You can return to sign in." };
}

export async function logoutAction() {
  const supabase = await createClient();
  await clearLocalSupabaseSession(supabase);
  redirect("/auth/login");
}

function failure(message: string): AuthActionState {
  return { status: "error", message };
}
