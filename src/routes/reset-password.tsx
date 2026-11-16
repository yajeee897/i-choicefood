import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password — I-ChoiceFood 2.0" },
      { name: "description", content: "Choose a new password for your I-ChoiceFood account." },
      { property: "og:title", content: "Choose a new password — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Securely reset your account password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [validRecovery, setValidRecovery] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const type = new URLSearchParams(window.location.hash.slice(1)).get("type");
    setValidRecovery(type === "recovery");
    setChecking(false);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }
    toast.success("Your password has been updated. You can sign in now.");
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">Choose a new password</h1>
        {checking ? <p className="mt-4 text-muted-foreground">Checking your reset link…</p> : !validRecovery ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">This password reset link is invalid or has expired. Request a new one to continue.</p>
            <Link to="/forgot-password" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Request a new link</Link>
          </>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold">New password
              <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" placeholder="At least 8 characters" />
            </label>
            {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
            <button disabled={busy} className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">{busy ? "Updating…" : "Update password"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
