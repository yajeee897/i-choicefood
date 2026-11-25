import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { BookOpen, ChefHat, Clock, History, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/recipe-card";
import { FoodImage } from "@/components/food-image";
import { clearCookingHistory, getCookingHistory } from "@/lib/history.functions";
import { cookingTimeLabel } from "@/lib/servings";

export const Route = createFileRoute("/_authenticated/cooking-history")({
  head: () => ({
    meta: [
      { title: "Cooking History — I-ChoiceFood 2.0" },
      { name: "description", content: "Review your completed Filipino dishes, recent cooking activity, and most-cooked recipes." },
      { property: "og:title", content: "Cooking History — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Your private cooking activity and completed recipes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CookingHistoryPage,
});

const dateLabel = (value: string) => new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(value));
const timeLabel = (value: string) => new Intl.DateTimeFormat("en-PH", { timeStyle: "short" }).format(new Date(value));

function CookingHistoryPage() {
  const queryClient = useQueryClient();
  const fetchHistory = useServerFn(getCookingHistory);
  const clearHistory = useServerFn(clearCookingHistory);
  const [confirmClear, setConfirmClear] = useState(false);
  const { data: history = [], isLoading, error } = useQuery({
    queryKey: ["cooking-history"],
    queryFn: () => fetchHistory(),
  });
  const clearMutation = useMutation({
    mutationFn: () => clearHistory(),
    onSuccess: async () => {
      queryClient.setQueryData(["cooking-history"], []);
      setConfirmClear(false);
      toast.success("Your cooking history has been cleared.");
    },
    onError: () => toast.error("We couldn’t clear your history. Please try again."),
  });

  const frequent = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const record of history) {
      const current = counts.get(record.recipe_id);
      counts.set(record.recipe_id, { name: record.recipe_name, count: (current?.count ?? 0) + 1 });
    }
    return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [history]);

  return (
    <div>
      <PageHeader title="Cooking History" subtitle="Your completed dishes, newest first — saved privately to your account." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {isLoading ? <div className="rounded-3xl bg-card p-8 text-center shadow-soft">Loading your cooking history…</div> : error ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-soft"><h2 className="text-2xl font-semibold">We couldn’t load your history</h2><p className="mt-2 text-muted-foreground">Please refresh and try again.</p></div>
        ) : history.length === 0 ? (
          <section className="rounded-3xl bg-card px-6 py-14 text-center shadow-soft">
            <ChefHat className="mx-auto h-14 w-14 text-secondary" />
            <h2 className="mt-4 text-3xl font-semibold">Your first dish is waiting</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Finish a recipe in the Cooking Simulator and confirm completion. It will appear here with the date, servings and estimated cooking time.</p>
            <Link to="/cooking-simulator" search={{ recipe: undefined }} className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Try your first recipe</Link>
          </section>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3" aria-label="Cooking summary">
              <div className="rounded-3xl bg-card p-6 shadow-soft"><History className="h-6 w-6 text-secondary" /><p className="mt-4 text-3xl font-bold">{history.length}</p><p className="mt-1 text-sm text-muted-foreground">Completed cooking sessions</p></div>
              <div className="rounded-3xl bg-card p-6 shadow-soft"><BookOpen className="h-6 w-6 text-secondary" /><p className="mt-4 text-3xl font-bold">{frequent.length}</p><p className="mt-1 text-sm text-muted-foreground">Different recipes cooked</p></div>
              <div className="rounded-3xl bg-card p-6 shadow-soft"><Trophy className="h-6 w-6 text-secondary" /><p className="mt-4 truncate text-2xl font-bold">{frequent[0]?.name}</p><p className="mt-1 text-sm text-muted-foreground">Most cooked · {frequent[0]?.count} {frequent[0]?.count === 1 ? "time" : "times"}</p></div>
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-semibold">Recently cooked</h2><button onClick={() => setConfirmClear(true)} className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" />Clear history</button></div>
              {confirmClear && (
                <div role="alertdialog" aria-label="Confirm clearing cooking history" className="mt-4 rounded-2xl border border-destructive/30 bg-card p-5 shadow-soft">
                  <h3 className="text-xl font-semibold">Clear all cooking history?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">This permanently deletes every completed cooking record from your account. Your recipes and favorites are not affected.</p>
                  <div className="mt-4 flex gap-3"><button disabled={clearMutation.isPending} onClick={() => clearMutation.mutate()} className="rounded-full bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground disabled:opacity-50">{clearMutation.isPending ? "Clearing…" : "Yes, clear history"}</button><button disabled={clearMutation.isPending} onClick={() => setConfirmClear(false)} className="rounded-full bg-muted px-5 py-2.5 text-sm font-bold">Cancel</button></div>
                </div>
              )}
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {history.slice(0, 3).map((record) => (
                  <article key={record.id} className="overflow-hidden rounded-3xl bg-card shadow-soft">
                    <div className="aspect-[16/9]"><FoodImage src={record.recipe_image} name={record.recipe_name} className="h-full w-full" /></div>
                    <div className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-secondary">{record.status}</p><h3 className="mt-1 text-xl font-semibold">{record.recipe_name}</h3><p className="mt-2 text-sm text-muted-foreground">{dateLabel(record.cooked_at)} · {timeLabel(record.cooked_at)}</p><p className="mt-1 text-sm text-muted-foreground">{record.servings} servings · {cookingTimeLabel({ minMinutes: record.estimated_min_minutes, maxMinutes: record.estimated_max_minutes })}
</p><div className="mt-4 flex gap-2"><Link to="/recipes/$recipeId" params={{ recipeId: record.recipe_id }} className="rounded-full bg-muted px-4 py-2 text-xs font-bold">View recipe</Link><Link to="/cooking-simulator" search={{ recipe: record.recipe_id }} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Cook again</Link></div></div>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              <section className="rounded-3xl bg-card p-6 shadow-soft lg:col-span-2">
                <h2 className="text-2xl font-semibold">Cooking activity</h2>
                <ol className="mt-4 divide-y">
                  {history.map((record) => (
                    <li key={record.id} className="flex flex-wrap items-center gap-4 py-4">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl"><FoodImage src={record.recipe_image} name={record.recipe_name} className="h-full w-full" /></div>
                      <div className="min-w-0 flex-1"><Link to="/recipes/$recipeId" params={{ recipeId: record.recipe_id }} className="font-bold hover:text-primary">{record.recipe_name}</Link><p className="mt-1 text-xs text-muted-foreground">{dateLabel(record.cooked_at)} at {timeLabel(record.cooked_at)} · {record.status}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{record.servings} servings · {cookingTimeLabel({ minMinutes: record.estimated_min_minutes, maxMinutes: record.estimated_max_minutes })}
</p></div>
                      <Link to="/cooking-simulator" search={{ recipe: record.recipe_id }} className="rounded-full bg-muted px-4 py-2 text-xs font-bold">Cook again</Link>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="h-fit rounded-3xl bg-card p-6 shadow-soft">
                <h2 className="text-2xl font-semibold">Most frequently cooked</h2>
                <ol className="mt-4 space-y-4">{frequent.map((item, index) => <li key={item.name} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{index + 1}</span><span className="flex-1 text-sm font-bold">{item.name}</span><span className="text-sm text-muted-foreground">{item.count}×</span></li>)}</ol>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
