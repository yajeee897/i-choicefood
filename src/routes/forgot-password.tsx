import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth-panel";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — I-ChoiceFood 2.0" },
      { name: "description", content: "Request a secure password reset link for your I-ChoiceFood account." },
      { property: "og:title", content: "Forgot password — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Request a secure account password reset link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return <div className="mx-auto max-w-md px-4 py-12 sm:px-6"><AuthPanel mode="forgot" /></div>;
}
