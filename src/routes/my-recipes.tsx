import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/recipe-card";
import { getFoodCategories as getCategories } from "@/lib/recipe-service";

export const Route = createFileRoute("/my-recipes")({
  head: () => ({
    meta: [
      { title: "My Recipes — I-ChoiceFood 2.0" },
      { name: "description", content: "Draft your own Filipino recipes." },
      { property: "og:title", content: "My Recipes — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Draft your own Filipino recipes." },
    ],
  }),
  component: MyRecipes,
});

interface Draft { id: number; name: string; category: string; notes: string }

function MyRecipes() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [form, setForm] = useState({ name: "", category: "main-dishes", notes: "" });
  const field = "w-full rounded-xl border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <PageHeader title="My Recipes" subtitle="Sketch out your own family recipes. Drafts live only in this browser tab for now — saving to an account arrives in a later phase." />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            setDrafts((d) => [{ id: Date.now(), ...form }, ...d]);
            setForm({ name: "", category: "main-dishes", notes: "" });
          }}
          className="space-y-4 rounded-3xl bg-card p-6 shadow-soft"
        >
          <label className="block text-sm font-bold">Recipe name
            <input className={`${field} mt-1 font-normal`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lola's Bicol Express" />
          </label>
          <label className="block text-sm font-bold">Category
            <select className={`${field} mt-1 font-normal`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {getCategories().map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold">Ingredients & steps
            <textarea rows={5} className={`${field} mt-1 font-normal`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Add draft</button>
        </form>
        <div className="space-y-3">
          {drafts.length === 0 && <p className="rounded-3xl border border-dashed p-8 text-center text-muted-foreground">No drafts yet.</p>}
          {drafts.map((d) => (
            <div key={d.id} className="fade-up flex items-start justify-between gap-3 rounded-2xl bg-card p-5 shadow-soft">
              <div>
                <p className="font-display text-lg font-semibold">{d.name}</p>
                <p className="text-xs font-bold uppercase text-secondary">{getCategories().find((c) => c.id === d.category)?.name}</p>
                {d.notes && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{d.notes}</p>}
              </div>
              <button aria-label={`Delete ${d.name}`} onClick={() => setDrafts((x) => x.filter((y) => y.id !== d.id))} className="rounded-full p-2 hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
