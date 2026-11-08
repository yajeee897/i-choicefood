import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Ingredient } from "@/data/recipes";
import { PageHeader } from "@/components/recipe-card";
import { getRecipe, getRecipes, ingredientCost, peso, totalCost } from "@/lib/recipe-service";

export const Route = createFileRoute("/cost-calculator")({
  validateSearch: (s: Record<string, unknown>): { recipe?: string | undefined } => ({
    recipe: typeof s["recipe"] === "string" ? s["recipe"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cost Calculator — I-ChoiceFood 2.0" },
      { name: "description", content: "Calculate ingredient expenses and cost per serving for Filipino recipes." },
      { property: "og:title", content: "Cost Calculator — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Calculate ingredient expenses per serving." },
    ],
  }),
  component: CostCalculator,
});

function CostCalculator() {
  const { recipe: rid } = Route.useSearch();
  const navigate = useNavigate({ from: "/cost-calculator" });
  const recipe = getRecipe(rid ?? "") ?? getRecipes()[0]!;
  const [servings, setServings] = useState(recipe.servings);
  const [items, setItems] = useState<Ingredient[]>(recipe.ingredients);

  useEffect(() => {
    setServings(recipe.servings);
    setItems(recipe.ingredients);
  }, [recipe]);

  const scale = servings / recipe.servings;
  const total = totalCost(items, scale);
  const setPrice = (idx: number, v: number) =>
    setItems((p) => p.map((it, i) => (i === idx ? { ...it, pricePerUnit: Math.max(0, v) } : it)));

  return (
    <div>
      <PageHeader title="Cost Calculator" subtitle="Pick a recipe, adjust servings, and edit market prices to see your total budget." />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={recipe.id}
              onChange={(e) => navigate({ search: { recipe: e.target.value } })}
              aria-label="Choose recipe"
              className="rounded-full border bg-background px-4 py-2 font-semibold"
            >
              {getRecipes().map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="flex items-center gap-2 rounded-full bg-muted p-1">
              <button aria-label="Fewer servings" onClick={() => setServings((s) => Math.max(1, s - 1))} className="grid h-8 w-8 place-items-center rounded-full hover:bg-card"><Minus className="h-4 w-4" /></button>
              <span className="w-24 text-center text-sm font-bold">{servings} servings</span>
              <button aria-label="More servings" onClick={() => setServings((s) => Math.min(100, s + 1))} className="grid h-8 w-8 place-items-center rounded-full hover:bg-card"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-muted-foreground">
                <tr><th className="py-2">Ingredient</th><th>Qty</th><th>Price / unit (₱)</th><th className="text-right">Cost</th></tr>
              </thead>
              <tbody className="divide-y">
                {items.map((it, idx) => (
                  <tr key={it.name}>
                    <td className="py-2.5 font-semibold">{it.name}</td>
                    <td>{+(it.quantity * scale).toFixed(2)} {it.unit}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={it.pricePerUnit}
                        onChange={(e) => setPrice(idx, Number(e.target.value))}
                        aria-label={`Price per ${it.unit} of ${it.name}`}
                        className="w-24 rounded-lg border bg-background px-2 py-1"
                      />
                    </td>
                    <td className="text-right">{peso(ingredientCost(it, scale))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="h-fit rounded-3xl bg-primary p-6 text-primary-foreground shadow-lift">
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">Total budget</p>
          <p className="mt-2 font-display text-4xl font-semibold">{peso(total)}</p>
          <p className="mt-4 text-sm opacity-90">Cost per serving</p>
          <p className="text-2xl font-bold">{peso(total / servings)}</p>
          <p className="mt-6 text-xs opacity-80">Prices are sample market estimates. Edits are not saved.</p>
        </aside>
      </div>
    </div>
  );
}
