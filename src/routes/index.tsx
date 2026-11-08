import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Calculator, BookOpen, Flame, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { RecipeCard } from "@/components/recipe-card";
import { CategoryCard } from "@/components/category-card";
import { getCategories, getFeatured, getPopular } from "@/lib/recipe-service";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "I-ChoiceFood 2.0 — Filipino Recipe Book & Food Costing" },
      { name: "description", content: "Discover Filipino recipes like Adobo and Sinigang, compute ingredient costs, and scale servings." },
      { property: "og:title", content: "I-ChoiceFood 2.0 — Filipino Recipe Book & Food Costing" },
      { property: "og:description", content: "Discover Filipino recipes, compute ingredient costs, and scale servings." },
    ],
  }),
  component: Index,
});

function SectionTitle({ eyebrow, title, to }: { eyebrow: string; title: string; to?: "/recipes" | "/categories" }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Index() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const featured = getFeatured();
  const popular = getPopular(4);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
          <img src={hero} alt="A Filipino family feast with adobo, sinigang and pancit" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa/90 via-cocoa/60 to-transparent" />
          <div className="fade-up relative max-w-2xl px-6 py-16 text-cream sm:px-12 sm:py-24">
            <p className="text-sm font-bold uppercase tracking-widest opacity-90">Kain na! · Let's eat</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">Cook Filipino favorites, budget every bite.</h1>
            <p className="mt-4 max-w-lg text-base opacity-90 sm:text-lg">
              Explore classic recipes, compute ingredient costs, and adjust servings for any table.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/recipes", search: { q, category: undefined } });
              }}
              className="mt-8 flex items-center gap-2 rounded-full bg-card p-2 shadow-lift"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search adobo, sinigang, kalabasa…"
                aria-label="Search recipes"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <SectionTitle eyebrow="Featured" title="Filipino dishes to try" to="/recipes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <SectionTitle eyebrow="Browse" title="Food categories" to="/categories" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {getCategories().map((c) => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <SectionTitle eyebrow="Trending" title="Popular recipes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-8 rounded-[2rem] bg-secondary p-8 text-secondary-foreground sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">About the system</p>
            <h2 className="mt-2 text-3xl font-semibold">Your Filipino kitchen, organized.</h2>
            <p className="mt-4 opacity-90">
              I-ChoiceFood 2.0 brings together a recipe book and a food costing tool. Learn how to prepare
              beloved dishes, know how much each ingredient costs, and scale portions for family or events.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: BookOpen, t: "Recipe Book", d: "Step-by-step Filipino classics." },
              { icon: Calculator, t: "Cost Calculator", d: "Ingredient expenses per serving." },
              { icon: Flame, t: "Cooking Simulator", d: "Practice each cooking step." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3 rounded-2xl bg-card/10 p-4">
                <Icon className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-bold">{t}</p>
                  <p className="text-sm opacity-85">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
