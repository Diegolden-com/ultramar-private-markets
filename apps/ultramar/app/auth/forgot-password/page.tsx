import { AuthPanel } from "@/components/auth-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  alternates: {
    canonical: "/auth/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPanel
      title="Reset password"
      description="Enter the email tied to your Ultramar.capital account."
      mode="reset"
    />
  );
}
