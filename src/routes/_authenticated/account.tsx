import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { LogOut, Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/recipe-card";
import { useAuth } from "@/lib/auth";
import { updateDisplayName } from "@/lib/history.functions";
import { supabase } from "@/integrations/supabase/client";
import { useSignOut } from "@/hooks/use-sign-out";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — I-ChoiceFood 2.0" },
      { name: "description", content: "Manage your I-ChoiceFood display name, password, and account session." },
      { property: "og:title", content: "My Account — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Manage your account and security settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, displayName, refreshProfile } = useAuth();
  const updateName = useServerFn(updateDisplayName);
  const signOut = useSignOut();
  const [name, setName] = useState(displayName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => setName(displayName), [displayName]);

  const saveName = async (event: FormEvent) => {
    event.preventDefault();
    setSavingName(true);
    try {
      await updateName({ data: { displayName: name } });
      await refreshProfile();
      toast.success("Your display name has been updated.");
    } catch {
      toast.error("We couldn’t update your display name.");
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword, current_password: currentPassword });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    toast.success("Your password has been changed.");
  };

  return (
    <div>
      <PageHeader title="My Account" subtitle="Manage your profile, password and sign-in session." />
      <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:px-6">
        <section className="rounded-3xl bg-card p-6 shadow-soft sm:p-8">
          <UserRound className="h-7 w-7 text-secondary" />
          <h2 className="mt-3 text-2xl font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as <strong className="text-foreground">{user?.email}</strong></p>
          <form onSubmit={saveName} className="mt-6">
            <label className="block text-sm font-bold">Display name
              <input required maxLength={60} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" />
            </label>
            <button disabled={savingName} className="mt-4 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" />{savingName ? "Saving…" : "Save profile"}</button>
          </form>
        </section>

        <section className="rounded-3xl bg-card p-6 shadow-soft sm:p-8">
          <ShieldCheck className="h-7 w-7 text-secondary" />
          <h2 className="mt-3 text-2xl font-semibold">Change password</h2>
          <p className="mt-2 text-sm text-muted-foreground">Enter your current password to choose a new one. Passwords are handled securely by your account service.</p>
          <form onSubmit={changePassword} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold">Current password
              <input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" />
            </label>
            <label className="block text-sm font-bold">New password
              <input required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 font-normal" placeholder="At least 8 characters" />
            </label>
            <div className="sm:col-span-2"><button disabled={savingPassword} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">{savingPassword ? "Changing…" : "Change password"}</button></div>
          </form>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-card p-6 shadow-soft">
          <div><h2 className="text-xl font-semibold">Sign out</h2><p className="mt-1 text-sm text-muted-foreground">Your cooking history stays saved for the next time you sign in.</p></div>
          <button onClick={() => void signOut().catch(() => toast.error("We couldn’t sign you out. Please try again."))} className="flex items-center gap-2 rounded-full bg-muted px-5 py-2.5 text-sm font-bold"><LogOut className="h-4 w-4" />Sign out</button>
        </section>
      </div>
    </div>
  );
}
