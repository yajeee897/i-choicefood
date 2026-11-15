import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, ChefHat, Clock, Flame, MapPin, Minus, Plus, Tag, Utensils, Wallet } from "lucide-react";
import { FavoriteButton } from "@/components/recipe-card";
import { FoodCard } from "@/components/food-card";
import { FoodImage } from "@/components/food-image";
import { BUDGETS } from "@/data/food-filters";
import {
  getCategoryName, getFood, getRecipe, getSimilarFoods, ingredientCost, peso, pesoWhole, totalCost, type Food,
} from "@/lib/recipe-service";
import type { Recipe } from "@/data/recipes";

export const Route = createFileRoute("/recipes/$recipeId")({
  loader: ({ params }) => {
    const food = getFood(params.recipeId);
    if (!food) throw notFound();
    return { id: food.id, name: food.name, description: food.description, image: food.image };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Dish unavailable — I-ChoiceFood 2.0" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} — I-ChoiceFood 2.0`;
    const remote = loaderData.image?.startsWith("https://") ? loaderData.image : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(remote ? [{ property: "og:image", content: remote }, { name: "twitter:image", content: remote }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-semibold">Dish not found</h1>
      <Link to="/recipes" className="mt-4 inline-block font-bold text-primary">Back to Recipe Book</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong loading this dish</h1>
      <Link to="/recipes" className="mt-4 inline-block font-bold text-primary">Back to Recipe Book</Link>
    </div>
  ),
  component: DishDetail,
});

function Chip({ children, to }: { children: React.ReactNode; to?: { key: "category" | "ingredient" | "method" | "taste" | "region" | "budget"; value: string } }) {
  const cls = "rounded-full bg-card px-3 py-1.5 text-sm shadow-soft";
  return to ? (
    <Link to="/recipes" search={{ [to.key]: to.value }} className={`${cls} transition-colors hover:bg-primary hover:text-primary-foreground`}>{children}</Link>
  ) : <span className={cls}>{children}</span>;
}

function DishDetail() {
  const { id } = Route.useLoaderData();
  const food = getFood(id)!;
  const recipe = getRecipe(id);
  const budget = BUDGETS.find((b) => b.id === food.budget)!;

  return (
    <article className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <div className="fade-up grid gap-8 lg:grid-cols-2">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft">
            <FoodImage src={food.image} name={food.name} eager className="h-full w-full" />
            <FavoriteButton id={food.id} className="absolute right-4 top-4" />
          </div>
          {food.imageFile && (
            <figcaption className="mt-2 px-2 text-xs text-muted-foreground">
              Photo:{" "}
              <a href={`https://commons.wikimedia.org/wiki/${encodeURIComponent(food.imageFile)}`} target="_blank" rel="noreferrer" className="underline hover:text-primary">
                Wikimedia Commons
              </a>{" "}(free license)
            </figcaption>
          )}
        </figure>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            {food.categories.map((c) => (
              <Link key={c} to="/recipes" search={{ category: c }} className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground hover:opacity-90">
                {getCategoryName(c)}
              </Link>
            ))}
          </div>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{food.name}</h1>
          {food.aliases?.length ? <p className="mt-1 text-sm text-muted-foreground">Also known as {food.aliases.join(", ")}</p> : null}
          <p className="mt-4 text-muted-foreground">{food.description}</p>
          <p className="mt-6 text-sm">
            <span className="text-2xl font-bold text-primary">{pesoWhole(food.price)}</span>
            <span className="text-muted-foreground"> per serving (estimate) · {budget.label}</span>
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2"><dt className="flex w-32 items-center gap-1.5 font-bold"><MapPin className="h-4 w-4" />Region</dt>
              <dd><Chip to={{ key: "region", value: food.region }}>{food.region}</Chip></dd></div>
            <div className="flex flex-wrap items-center gap-2"><dt className="flex w-32 items-center gap-1.5 font-bold"><Utensils className="h-4 w-4" />Main ingredient</dt>
              <dd className="flex flex-wrap gap-2">{food.mainIngredients.map((v) => <Chip key={v} to={{ key: "ingredient", value: v }}>{v}</Chip>)}</dd></div>
            <div className="flex flex-wrap items-center gap-2"><dt className="flex w-32 items-center gap-1.5 font-bold"><ChefHat className="h-4 w-4" />Cooking method</dt>
              <dd className="flex flex-wrap gap-2">{food.methods.map((v) => <Chip key={v} to={{ key: "method", value: v }}>{v}</Chip>)}</dd></div>
            <div className="flex flex-wrap items-center gap-2"><dt className="flex w-32 items-center gap-1.5 font-bold"><Tag className="h-4 w-4" />Taste</dt>
              <dd className="flex flex-wrap gap-2">{food.tastes.map((v) => <Chip key={v} to={{ key: "taste", value: v }}>{v}</Chip>)}</dd></div>
            <div className="flex flex-wrap items-center gap-2"><dt className="flex w-32 items-center gap-1.5 font-bold"><Wallet className="h-4 w-4" />Budget</dt>
              <dd><Chip to={{ key: "budget", value: budget.id }}>{budget.label} ({budget.range})</Chip></dd></div>
          </dl>
        </div>
      </div>

      {recipe ? <FullRecipe recipe={recipe} /> : <KeyIngredients food={food} />}

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Similar dishes</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getSimilarFoods(food).map((f) => <FoodCard key={f.id} food={f} />)}
        </div>
      </section>
    </article>
  );
}

function KeyIngredients({ food }: { food: Food }) {
  return (
    <section className="mt-12 grid gap-8 lg:grid-cols-5">
      <div className="rounded-3xl bg-card p-6 shadow-soft lg:col-span-2">
        <h2 className="text-2xl font-semibold">Key ingredients</h2>
        <ul className="mt-4 divide-y">
          {food.ingredients.map((i) => <li key={i} className="py-2.5 text-sm first-letter:uppercase">{i}</li>)}
        </ul>
      </div>
      <div className="rounded-3xl border border-dashed p-6 lg:col-span-3">
        <h2 className="text-2xl font-semibold">Full recipe coming soon</h2>
        <p className="mt-3 text-muted-foreground">
          Step-by-step instructions, exact quantities and an itemized cost breakdown for {food.name} will be added in a later phase.
          The price shown above is an estimate per serving.
        </p>
        <Link to="/recipes" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">
          Explore more dishes
        </Link>
      </div>
    </section>
  );
}

function FullRecipe({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings);
  const scale = servings / recipe.servings;
  const total = totalCost(recipe.ingredients, scale);

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5"><Clock className="h-4 w-4" />Prep {recipe.prepMinutes}m · Cook {recipe.cookMinutes}m</span>
        <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5"><Flame className="h-4 w-4" />{recipe.difficulty}</span>
        <div className="flex items-center gap-2 rounded-full bg-card p-1 shadow-soft">
          <button aria-label="Fewer servings" onClick={() => setServings((s) => Math.max(1, s - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Minus className="h-4 w-4" /></button>
          <span className="w-24 text-center text-sm font-bold">{servings} servings</span>
          <button aria-label="More servings" onClick={() => setServings((s) => Math.min(50, s + 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Plus className="h-4 w-4" /></button>
        </div>
        <p>Ingredient total <span className="text-xl font-bold text-primary">{peso(total)}</span> · {peso(total / servings)}/serving</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
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
    </>
  );
}
