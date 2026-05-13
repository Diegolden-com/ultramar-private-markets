import { AuthPanel } from "@/components/auth-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error",
  alternates: {
    canonical: "/auth/error",
  },
};

export default function AuthErrorPage() {
  return (
    <AuthPanel
      title="Authentication issue"
      description="The authentication link could not be completed. Return home or try signing in again."
      mode="message"
    />
  );
}
