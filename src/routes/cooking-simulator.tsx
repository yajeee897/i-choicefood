import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, CheckCircle2, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { PageHeader } from "@/components/recipe-card";
import { FoodImage } from "@/components/food-image";
import { getCookingSteps, getRecipe, getRecipes } from "@/lib/recipe-service";

export const Route = createFileRoute("/cooking-simulator")({
  validateSearch: (s: Record<string, unknown>): { recipe?: string | undefined } => ({
    recipe: typeof s["recipe"] === "string" ? s["recipe"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cooking Simulator — I-ChoiceFood 2.0" },
      { name: "description", content: "Walk through Filipino recipes one cooking step at a time, with a photo and timer for every step." },
      { property: "og:title", content: "Cooking Simulator — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Practice Filipino recipes step by step." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulator,
});

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

/** Countdown for one step, preset from the wait time written in the step. */
function StepTimer({ minutes }: { minutes: number | undefined }) {
  const [remaining, setRemaining] = useState((minutes ?? 0) * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const finished = remaining === 0 && (minutes ?? 0) > 0 && !running;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-muted/60 p-4">
      <Timer className="h-5 w-5 text-secondary" />
      <span className="font-display text-2xl font-semibold tabular-nums" aria-live="polite" aria-label="Step timer">{clock(remaining)}</span>
      <span className="text-sm text-muted-foreground">
        {finished ? "Time's up!" : minutes ? `Suggested: ${minutes >= 60 ? `${minutes / 60} hr` : `${minutes} min`}` : "No wait time in this step"}
      </span>
      <div className="ml-auto flex gap-2">
        <button onClick={() => setRemaining((r) => r + 60)} className="rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow-soft">+1 min</button>
        <button
          onClick={() => setRunning((r) => !r)}
          disabled={remaining === 0}
          className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground disabled:opacity-40"
        >
          {running ? <><Pause className="h-3.5 w-3.5" />Pause</> : <><Play className="h-3.5 w-3.5" />Start</>}
        </button>
        <button aria-label="Reset timer" onClick={() => { setRunning(false); setRemaining((minutes ?? 0) * 60); }} className="grid h-8 w-8 place-items-center rounded-full bg-card shadow-soft">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Simulator() {
  const { recipe: rid } = Route.useSearch();
  const navigate = useNavigate({ from: "/cooking-simulator" });
  const recipe = getRecipe(rid ?? "") ?? getRecipes()[0]!;
  const steps = getCookingSteps(recipe);
  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [recipe.id]);
  const done = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)]!;
  const pct = Math.round((Math.min(step, steps.length) / steps.length) * 100);

  return (
    <div>
      <PageHeader title="Cooking Simulator" subtitle="A guided, step-by-step walkthrough with a photo and timer for every step." />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <select
          value={recipe.id}
          onChange={(e) => navigate({ search: { recipe: e.target.value } })}
          aria-label="Choose recipe"
          className="rounded-full border bg-card px-4 py-2 font-semibold"
        >
          {getRecipes().map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        {/* Stage indicator */}
        <ol className="mt-6 flex gap-1.5 sm:gap-2" aria-label="Cooking stages">
          {steps.map((s, i) => {
            const state = i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li key={i} className="min-w-0 flex-1">
                <button
                  onClick={() => setStep(i)}
                  aria-current={state === "current" ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${s.stage}`}
                  className="group flex w-full flex-col items-center gap-1.5"
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                      state === "done" ? "bg-secondary text-secondary-foreground"
                        : state === "current" ? "bg-primary text-primary-foreground ring-4 ring-primary/25"
                        : "bg-muted text-muted-foreground group-hover:bg-accent"
                    }`}
                  >
                    {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`hidden w-full truncate text-center text-xs sm:block ${state === "current" ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {s.stage}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 overflow-hidden rounded-3xl bg-card shadow-soft">
          <div className="relative h-56 sm:h-80">
            <FoodImage
              key={done ? "done" : step}
              src={done ? recipe.image : current.image}
              name={done ? recipe.name : `${recipe.name} — ${current.stage}`}
              eager
              className="fade-in absolute inset-0 h-full w-full"
            />
            {!done && (
              <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-xs font-bold text-foreground shadow-soft">
                {current.stage}
              </span>
            )}
          </div>
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
                <p className="text-sm font-bold text-secondary">Step {step + 1} of {steps.length} · {current.stage}</p>
                <p className="mt-3 text-xl">{current.text}</p>
                <StepTimer key={`${recipe.id}-${step}`} minutes={current.minutes} />
                <div className="mt-8 flex justify-between">
                  <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="rounded-full bg-muted px-5 py-2.5 text-sm font-bold disabled:opacity-40">Back</button>
                  <button onClick={() => setStep((s) => s + 1)} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                    {step === steps.length - 1 ? "Finish" : "Next step"}
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
