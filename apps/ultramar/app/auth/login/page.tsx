import { AuthPanel } from "@/components/auth-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  alternates: {
    canonical: "/auth/login",
  },
};

export default function LoginPage() {
  return (
    <AuthPanel
      title="Sign in"
      description="Access Ultramar.capital investor workflows across both product lines."
      mode="login"
    />
  );
}
