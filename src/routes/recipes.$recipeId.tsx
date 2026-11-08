import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Flame, MapPin, Minus, Plus, Calculator } from "lucide-react";
import { FavoriteButton } from "@/components/recipe-card";
import { getRecipe, ingredientCost, peso, totalCost } from "@/lib/recipe-service";

export const Route = createFileRoute("/recipes/$recipeId")({
  loader: ({ params }) => {
    const recipe = getRecipe(params.recipeId);
    if (!recipe) throw notFound();
    return { id: recipe.id, name: recipe.name, description: recipe.description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — I-ChoiceFood 2.0` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — I-ChoiceFood 2.0` },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Recipe unavailable" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-semibold">Recipe not found</h1>
      <Link to="/recipes" search={{ q: "", category: undefined }} className="mt-4 inline-block font-bold text-primary">Back to Recipe Book</Link>
    </div>
  ),
  component: RecipeDetail,
});

function RecipeDetail() {
  const { id } = Route.useLoaderData();
  const recipe = getRecipe(id)!;
  const [servings, setServings] = useState(recipe.servings);
  const scale = servings / recipe.servings;
  const total = totalCost(recipe.ingredients, scale);

  return (
    <article className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <div className="fade-up grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
          <img src={recipe.image} alt={recipe.name} width={944} height={704} className="h-full w-full object-cover" />
          <FavoriteButton id={recipe.id} className="absolute right-4 top-4" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">{recipe.tagline}</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{recipe.name}</h1>
          <p className="mt-4 text-muted-foreground">{recipe.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5"><Clock className="h-4 w-4" />Prep {recipe.prepMinutes}m · Cook {recipe.cookMinutes}m</span>
            <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5"><Flame className="h-4 w-4" />{recipe.difficulty}</span>
            <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5"><MapPin className="h-4 w-4" />{recipe.region}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-card p-1 shadow-soft">
              <button aria-label="Fewer servings" onClick={() => setServings((s) => Math.max(1, s - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Minus className="h-4 w-4" /></button>
              <span className="w-24 text-center text-sm font-bold">{servings} servings</span>
              <button aria-label="More servings" onClick={() => setServings((s) => Math.min(50, s + 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Plus className="h-4 w-4" /></button>
            </div>
            <p className="text-sm">Total <span className="text-xl font-bold text-primary">{peso(total)}</span> · {peso(total / servings)}/serving</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <section className="rounded-3xl bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="text-2xl font-semibold">Ingredients</h2>
          <ul className="mt-4 divide-y">
            {recipe.ingredients.map((i) => (
              <li key={i.name} className="flex justify-between gap-3 py-2.5 text-sm">
                <span><b>{+(i.quantity * scale).toFixed(2)} {i.unit}</b> {i.name}</span>
                <span className="text-muted-foreground">{peso(ingredientCost(i, scale))}</span>
              </li>
            ))}
          </ul>
          <Link to="/cost-calculator" search={{ recipe: recipe.id }} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <Calculator className="h-4 w-4" /> Open in Cost Calculator
          </Link>
        </section>
        <section className="lg:col-span-3">
          <h2 className="text-2xl font-semibold">How to cook</h2>
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((s, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">{idx + 1}</span>
                <p className="pt-1.5">{s}</p>
              </li>
            ))}
          </ol>
          <Link to="/cooking-simulator" search={{ recipe: recipe.id }} className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">
            Practice in Cooking Simulator
          </Link>
        </section>
      </div>
    </article>
  );
}
