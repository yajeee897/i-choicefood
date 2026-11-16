import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Finishing sign in — I-ChoiceFood 2.0" },
      { name: "description", content: "Finish signing in to your I-ChoiceFood account." },
      { property: "og:title", content: "Finishing sign in — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Finish signing in to your I-ChoiceFood account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    void supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        setFailed(true);
        return;
      }
      const stored = sessionStorage.getItem("i-choicefood-auth-redirect");
      sessionStorage.removeItem("i-choicefood-auth-redirect");
      const destination = stored === "/account" ? "/account" : "/cooking-history";
      void navigate({ to: destination, replace: true });
    });
  }, [navigate]);
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold">{failed ? "We couldn’t finish signing you in" : "Finishing your sign in…"}</h1>
      {failed && <Link to="/auth" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Return to sign in</Link>}
    </div>
  );
}
