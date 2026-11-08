import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import type { CategoryId } from "@/data/recipes";
import { PageHeader, RecipeCard } from "@/components/recipe-card";
import { getCategories, searchRecipes } from "@/lib/recipe-service";

const ids = ["ulam", "sabaw", "gulay", "pancit", "panghimagas"];

export const Route = createFileRoute("/recipes/")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined; category?: CategoryId | undefined } => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    category: typeof s["category"] === "string" && ids.includes(s["category"]) ? (s["category"] as CategoryId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Recipe Book — I-ChoiceFood 2.0" },
      { name: "description", content: "Browse and search Filipino recipes with costs and cooking times." },
      { property: "og:title", content: "Recipe Book — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Browse and search Filipino recipes." },
    ],
  }),
  component: RecipeBook,
});

function RecipeBook() {
  const { q = "", category } = Route.useSearch();
  const navigate = useNavigate({ from: "/recipes/" });
  const results = searchRecipes(q, category);
  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-bold transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`;

  return (
    <div>
      <PageHeader title="Recipe Book" subtitle="Classic Filipino dishes with ingredients, costs and step-by-step instructions." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-soft">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value }), replace: true })}
            placeholder="Search by dish or ingredient…"
            aria-label="Search recipes"
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={chip(!category)} onClick={() => navigate({ search: (p) => ({ ...p, category: undefined }) })}>All</button>
          {getCategories().map((c) => (
            <button key={c.id} className={chip(category === c.id)} onClick={() => navigate({ search: (p) => ({ ...p, category: c.id }) })}>
              {c.name}
            </button>
          ))}
        </div>
        {results.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">No recipes match “{q}”. Try another dish or ingredient.</p>
        )}
      </div>
    </div>
  );
}
