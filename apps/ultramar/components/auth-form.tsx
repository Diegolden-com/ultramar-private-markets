"use client";

import { initialAuthActionState, type AuthActionState } from "@/app/auth/action-state";
import { loginAction, resetPasswordAction, signUpAction, updatePasswordAction } from "@/app/auth/actions";
import { withReturnTo } from "@/lib/auth/redirects";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export type AuthFormMode = "login" | "signup" | "reset" | "update";

const formActions = {
  login: loginAction,
  signup: signUpAction,
  reset: resetPasswordAction,
  update: updatePasswordAction,
};

const submitLabels: Record<AuthFormMode, [string, string]> = {
  login: ["Sign in", "Signing in"],
  signup: ["Create account", "Creating account"],
  reset: ["Send reset link", "Sending link"],
  update: ["Update password", "Updating password"],
};

export function AuthForm({ mode, returnTo }: { mode: AuthFormMode; returnTo: string }) {
  const [state, action] = useActionState<AuthActionState, FormData>(
    formActions[mode],
    initialAuthActionState,
  );
  const showEmail = mode !== "update";
  const showPassword = mode === "login" || mode === "signup" || mode === "update";
  const showConfirmation = mode === "signup" || mode === "update";

  return (
    <>
      <form action={action} className="grid gap-5">
        <input type="hidden" name="returnTo" value={returnTo} />

        {mode === "signup" ? (
          <AuthField label="Full name" htmlFor="signup-full-name">
            <input
              id="signup-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="input input-primary h-12 w-full bg-surface-ink text-sm text-on-surface"
              placeholder="Your name"
            />
          </AuthField>
        ) : null}

        {showEmail ? (
          <AuthField label="Email address" htmlFor={`${mode}-email`}>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input input-primary h-12 w-full bg-surface-ink text-sm text-on-surface"
              placeholder="investor@example.com"
            />
          </AuthField>
        ) : null}

        {showPassword ? (
          <AuthField label={mode === "update" ? "New password" : "Password"} htmlFor={`${mode}-password`}>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              minLength={mode === "login" ? undefined : 10}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              className="input input-primary h-12 w-full bg-surface-ink text-sm text-on-surface"
            />
          </AuthField>
        ) : null}

        {showConfirmation ? (
          <AuthField label="Confirm password" htmlFor={`${mode}-password-confirmation`}>
            <input
              id={`${mode}-password-confirmation`}
              name="passwordConfirmation"
              type="password"
              minLength={10}
              autoComplete="new-password"
              required
              className="input input-primary h-12 w-full bg-surface-ink text-sm text-on-surface"
            />
          </AuthField>
        ) : null}

        {state.status !== "idle" ? (
          <div
            className={`alert ${state.status === "error" ? "alert-error" : "alert-success"} rounded-none text-sm`}
            role={state.status === "error" ? "alert" : "status"}
          >
            <span>{state.message}</span>
          </div>
        ) : null}

        <SubmitButton labels={submitLabels[mode]} />
      </form>

      <AuthLinks mode={mode} returnTo={returnTo} />
    </>
  );
}

function AuthField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-3" htmlFor={htmlFor}>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}

function SubmitButton({ labels }: { labels: [string, string] }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary group mt-1 h-12 w-full font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
    >
      {pending ? labels[1] : labels[0]}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
    </button>
  );
}

function AuthLinks({ mode, returnTo }: { mode: AuthFormMode; returnTo: string }) {
  const links =
    mode === "login"
      ? [
          { href: withReturnTo("/auth/sign-up", returnTo), label: "Create account" },
          { href: withReturnTo("/auth/forgot-password", returnTo), label: "Reset password" },
        ]
      : mode === "signup"
        ? [{ href: withReturnTo("/auth/login", returnTo), label: "Already have access? Sign in" }]
        : [{ href: withReturnTo("/auth/login", returnTo), label: "Back to sign in" }];

  return (
    <div className="mt-6 grid gap-3 border-t border-border-muted pt-5 text-sm sm:grid-cols-2">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="link link-hover font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
