import { AuthPanel } from "@/components/auth-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Requested",
  alternates: {
    canonical: "/auth/sign-up-success",
  },
};

export default function SignUpSuccessPage() {
  return (
    <AuthPanel
      title="Account requested"
      description="Check your email for the next step. Ultramar.capital access is shared across both products."
      mode="message"
    />
  );
}
