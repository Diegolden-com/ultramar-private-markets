import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Update Password",
  description: "Update an Ultramar.capital account password.",
  path: "/auth/update-password",
  noIndex: true,
});

export default function UpdatePasswordPage() {
  return (
    <AuthPanel
      title="Update password"
      description="Set a new password for your Ultramar.capital account."
      mode="update"
    />
  );
}
