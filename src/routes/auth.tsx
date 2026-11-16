import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth-panel";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string | undefined } => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — I-ChoiceFood 2.0" },
      { name: "description", content: "Sign in to your I-ChoiceFood account and your private cooking history." },
      { property: "og:title", content: "Sign in — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Access your account and cooking history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  return <div className="mx-auto max-w-md px-4 py-12 sm:px-6"><AuthPanel mode="login" redirect={redirect} /></div>;
}
