import { AuthPanel } from "@/components/auth-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password",
  alternates: {
    canonical: "/auth/update-password",
  },
};

export default function UpdatePasswordPage() {
  return (
    <AuthPanel
      title="Update password"
      description="Set a new password for your Ultramar.capital account."
      mode="update"
    />
  );
}
