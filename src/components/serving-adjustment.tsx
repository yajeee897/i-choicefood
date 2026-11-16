import { Clock, Minus, Plus, ShieldCheck } from "lucide-react";
import type { Recipe } from "@/data/recipes";
import { cookingTimeLabel, estimateCookingTime } from "@/lib/servings";

export function ServingAdjuster({ servings, onChange, max = 100 }: { servings: number; onChange: (servings: number) => void; max?: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-card p-1 shadow-soft">
      <button type="button" aria-label="Fewer servings" onClick={() => onChange(Math.max(1, servings - 1))} disabled={servings <= 1} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted disabled:opacity-40">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-24 text-center text-sm font-bold" aria-live="polite">{servings} {servings === 1 ? "serving" : "servings"}</span>
      <button type="button" aria-label="More servings" onClick={() => onChange(Math.min(max, servings + 1))} disabled={servings >= max} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted disabled:opacity-40">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CookingTimeGuidance({ recipe, servings, compact = false }: { recipe: Recipe; servings: number; compact?: boolean }) {
  const estimate = estimateCookingTime(recipe, servings);
  return (
    <div className={`rounded-2xl bg-card shadow-soft ${compact ? "p-4" : "p-5"}`}>
      <p className="flex items-center gap-2 text-sm font-bold text-secondary">
        <Clock className="h-4 w-4" /> Estimated cooking time: {cookingTimeLabel(estimate)}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{estimate.note}</p>
      <p className="mt-3 flex gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-secondary" />
        <span>{estimate.safetyNote} Times are estimates, not guaranteed completion times.</span>
      </p>
    </div>
  );
}
