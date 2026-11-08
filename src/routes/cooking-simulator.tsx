import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/recipe-card";
import { getRecipe, getRecipes } from "@/lib/recipe-service";

export const Route = createFileRoute("/cooking-simulator")({
  validateSearch: (s: Record<string, unknown>): { recipe?: string | undefined } => ({
    recipe: typeof s["recipe"] === "string" ? s["recipe"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cooking Simulator — I-ChoiceFood 2.0" },
      { name: "description", content: "Walk through Filipino recipes one cooking step at a time." },
      { property: "og:title", content: "Cooking Simulator — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Practice Filipino recipes step by step." },
    ],
  }),
  component: Simulator,
});

function Simulator() {
  const { recipe: rid } = Route.useSearch();
  const navigate = useNavigate({ from: "/cooking-simulator" });
  const recipe = getRecipe(rid ?? "") ?? getRecipes()[0]!;
  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [recipe.id]);
  const done = step >= recipe.steps.length;
  const pct = Math.round((Math.min(step, recipe.steps.length) / recipe.steps.length) * 100);

  return (
    <div>
      <PageHeader title="Cooking Simulator" subtitle="A guided, step-by-step walkthrough. A fuller interactive simulator is coming in a later phase." />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <select
          value={recipe.id}
          onChange={(e) => navigate({ search: { recipe: e.target.value } })}
          aria-label="Choose recipe"
          className="rounded-full border bg-card px-4 py-2 font-semibold"
        >
          {getRecipes().map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-soft">
          <img src={recipe.image} alt={recipe.name} width={944} height={704} className="h-48 w-full object-cover sm:h-64" />
          <div className="h-2 bg-muted"><div className="h-full bg-secondary transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          <div className="p-6 sm:p-8">
            {done ? (
              <div className="fade-up text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
                <h2 className="mt-3 text-2xl font-semibold">Luto na! Your {recipe.name} is ready.</h2>
                <button onClick={() => setStep(0)} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Cook again</button>
              </div>
            ) : (
              <div key={step} className="fade-up">
                <p className="text-sm font-bold text-secondary">Step {step + 1} of {recipe.steps.length}</p>
                <p className="mt-3 text-xl">{recipe.steps[step]}</p>
                <div className="mt-8 flex justify-between">
                  <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="rounded-full bg-muted px-5 py-2.5 text-sm font-bold disabled:opacity-40">Back</button>
                  <button onClick={() => setStep((s) => s + 1)} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                    {step === recipe.steps.length - 1 ? "Finish" : "Next step"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
