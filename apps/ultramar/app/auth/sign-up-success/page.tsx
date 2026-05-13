import { AuthPanel } from "@/components/auth-panel";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Account Requested",
  description: "Ultramar.capital account request confirmation.",
  path: "/auth/sign-up-success",
  noIndex: true,
});

export default function SignUpSuccessPage() {
  return (
    <AuthPanel
      title="Account requested"
      description="Check your email for the next step. Ultramar.capital access is shared across both products."
      mode="message"
    />
  );
}
