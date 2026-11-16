import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { ChefHat, MailCheck } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import "@lovable.dev/cloud-auth-js/styles.css";

export type AuthPanelMode = "login" | "signup" | "forgot";

function destination(redirect?: string): "/account" | "/cooking-history" {
  return redirect?.startsWith("/account") ? "/account" : "/cooking-history";
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
    </svg>
  );
}

export function AuthPanel({ mode, redirect }: { mode: AuthPanelMode; redirect?: string | undefined }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const target = destination(redirect);

  if (loading) return <div className="rounded-3xl bg-card p-8 text-center shadow-soft">Checking your session…</div>;
  if (user && mode !== "forgot") return <Navigate to={target} replace />;

  const finish = () => navigate({ to: target, replace: true });

  const socialSignIn = async (provider: "google" | "lovable") => {
    setBusy(true);
    setError("");
    sessionStorage.setItem("i-choicefood-auth-redirect", target);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/auth/callback`,
    });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    setBusy(false);
    await finish();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    if (mode === "forgot") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) setError(resetError.message);
      else setMessage("Check your email for a secure password reset link.");
      setBusy(false);
      return;
    }
    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) setError(signUpError.message);
      else if (!data.session) setMessage("Your account is ready to confirm. Check your email, then open the confirmation link to sign in.");
      else await finish();
      setBusy(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    else await finish();
    setBusy(false);
  };

  if (message && mode === "signup") {
    return (
      <div className="rounded-3xl bg-card p-8 text-center shadow-soft">
        <MailCheck className="mx-auto h-12 w-12 text-secondary" />
        <h2 className="mt-4 text-2xl font-semibold">Check your email</h2>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <Link to="/auth" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Back to sign in</Link>
      </div>
    );
  }

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";
  const subtitle = mode === "login" ? "Sign in to see your cooking history and account." : mode === "signup" ? "Keep every completed dish in your own cooking history." : "We’ll email you a secure link to choose a new password.";

  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft sm:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><ChefHat className="h-6 w-6" /></span>
      <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <label className="block text-sm font-bold">Display name
            <input required maxLength={60} value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoComplete="name" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" placeholder="How should we greet you?" />
          </label>
        )}
        <label className="block text-sm font-bold">Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" placeholder="you@example.com" />
        </label>
        {mode !== "forgot" && (
          <label className="block text-sm font-bold">Password
            <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" placeholder="At least 8 characters" />
          </label>
        )}
        {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {message && <p className="rounded-xl bg-secondary/10 px-4 py-3 text-sm text-secondary">{message}</p>}
        <button disabled={busy} className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>

      {mode !== "forgot" && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or continue with<span className="h-px flex-1 bg-border" /></div>
          <div className="grid gap-3">
            <button type="button" disabled={busy} onClick={() => void socialSignIn("google")} className="flex w-full items-center justify-center gap-2.5 rounded-full border px-6 py-3 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: "#FFFFFF", borderColor: "#747775", color: "#1F1F1F" }}>
              <GoogleMark /> Continue with Google
            </button>
            <button type="button" disabled={busy} onClick={() => void socialSignIn("lovable")} className="lovable-auth-button">Continue with Lovable</button>
          </div>
        </>
      )}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" && <><Link to="/forgot-password" className="font-bold text-primary hover:underline">Forgot password?</Link><p className="mt-3">New here? <Link to="/signup" search={{ redirect }} className="font-bold text-primary hover:underline">Create an account</Link></p></>}
        {mode === "signup" && <p>Already have an account? <Link to="/auth" search={{ redirect }} className="font-bold text-primary hover:underline">Sign in</Link></p>}
        {mode === "forgot" && <Link to="/auth" className="font-bold text-primary hover:underline">Back to sign in</Link>}
      </div>
    </div>
  );
}
