import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Reset Password",
  description: "Reset an Ultramar.capital account password.",
  path: "/auth/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthPanel
      title="Reset password"
      description="Enter the email tied to your Ultramar.capital account."
      mode="reset"
    />
  );
}
