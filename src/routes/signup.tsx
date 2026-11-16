import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth-panel";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string | undefined } => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create an account — I-ChoiceFood 2.0" },
      { name: "description", content: "Create an I-ChoiceFood account to keep your own persistent cooking history." },
      { property: "og:title", content: "Create an account — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Save completed dishes in your own cooking history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { redirect } = Route.useSearch();
  return <div className="mx-auto max-w-md px-4 py-12 sm:px-6"><AuthPanel mode="signup" redirect={redirect} /></div>;
}
