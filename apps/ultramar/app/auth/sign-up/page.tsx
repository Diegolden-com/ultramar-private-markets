import { AuthPanel } from "@/components/auth-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  alternates: {
    canonical: "/auth/sign-up",
  },
};

export default function SignUpPage() {
  return (
    <AuthPanel
      title="Create account"
      description="Request access to Private Equities or Arbitrage Hedge Fund workflows."
      mode="signup"
    />
  );
}
