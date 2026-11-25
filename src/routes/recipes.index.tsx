import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { PageHeader } from "@/components/recipe-card";
import { FoodCard } from "@/components/food-card";
import { FILTER_GROUPS, filterFoods, getFoods, type FilterKey, type FoodFilters } from "@/lib/recipe-service";

const PARAM: Record<FilterKey, "category" | "ingredient" | "method" | "taste" | "region" | "budget"> = {
  categories: "category",
  ingredients: "ingredient",
  methods: "method",
  tastes: "taste",
  regions: "region",
  budgets: "budget",
};

type RecipeSearch = {
  q?: string | undefined;
  category?: string | undefined;
  ingredient?: string | undefined;
  method?: string | undefined;
  taste?: string | undefined;
  region?: string | undefined;
  budget?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);

export const Route = createFileRoute("/recipes/")({
  validateSearch: (s: Record<string, unknown>): RecipeSearch => {
    const out: RecipeSearch = {};
    for (const k of ["q", "category", "ingredient", "method", "taste", "region", "budget"] as const) {
      const v = str(s[k]);
      if (v) out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "Recipe Book — I-ChoiceFood 2.0" },
      { name: "description", content: "Search and filter 116 Filipino dishes by category, ingredient, cooking method, taste, region and budget." },
      { property: "og:title", content: "Recipe Book — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Search and filter 116 Filipino dishes by category, ingredient, taste, region and budget." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecipesPage,
});

function parseList(val: string | undefined): string[] {
  if (!val) return [];
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

function RecipesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const q = search.q ?? "";
  const filters: FoodFilters = {
    categories: parseList(search.category),
    ingredients: parseList(search.ingredient),
    methods: parseList(search.method),
    tastes: parseList(search.taste),
    regions: parseList(search.region),
    budgets: parseList(search.budget),
  };

  const setGroup = (key: FilterKey, values: string[]) => {
    navigate({
      search: (p) => ({
        ...p,
        [PARAM[key]]: values.length ? values.join(",") : undefined,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const clearAll = () => navigate({ search: {}, replace: true, resetScroll: false });

  const activeFilterCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);
  const matchingFoods = filterFoods(filters, q);
  const totalCount = getFoods().length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Filipino Recipe Book"
        subtitle={`Explore our complete collection of ${totalCount} authentic Filipino dishes, soups, regional specialties, and treats.`}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) =>
              navigate({
                search: (p) => ({ ...p, q: e.target.value || undefined }),
                replace: true,
                resetScroll: false,
              })
            }
            placeholder="Search by dish name, ingredient, region, taste, or cooking style…"
            className="w-full rounded-full border bg-card py-3.5 pl-12 pr-10 text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {q && (
            <button
              aria-label="Clear search"
              onClick={() => navigate({ search: (p) => ({ ...p, q: undefined }), replace: true, resetScroll: false })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileFilterOpen((o) => !o)}
          className="inline-flex items-center justify-center gap-2 rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-soft hover:bg-muted lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {(activeFilterCount > 0 || q) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-card/60 p-3 text-sm">
          <span className="font-semibold text-muted-foreground">Active filters:</span>
          {q && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              "{q}"
              <button onClick={() => navigate({ search: (p) => ({ ...p, q: undefined }), replace: true })} aria-label="Remove search">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {FILTER_GROUPS.flatMap((g) =>
            (filters[g.key] ?? []).map((val) => (
              <span
                key={`${g.key}-${val}`}
                className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary"
              >
                {val}
                <button
                  onClick={() => setGroup(g.key, (filters[g.key] ?? []).filter((x) => x !== val))}
                  aria-label={`Remove ${val}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
          <button
            onClick={clearAll}
            className="ml-auto text-xs font-semibold text-primary hover:underline"
          >
            Clear all ({activeFilterCount + (q ? 1 : 0)})
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden space-y-4 lg:block">
          <div className="rounded-3xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-display text-lg font-bold">Filter Dishes</h2>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-xs font-semibold text-primary hover:underline">
                  Reset
                </button>
              )}
            </div>
            <div className="mt-4 space-y-4">
              {FILTER_GROUPS.map((g) => (
                <FilterAccordion
                  key={g.key}
                  title={g.title}
                  options={g.options}
                  selected={filters[g.key] ?? []}
                  onChange={(next) => setGroup(g.key, next)}
                />
              ))}
            </div>
          </div>
        </aside>

        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex bg-cocoa/40 backdrop-blur-sm lg:hidden">
            <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-background p-6 shadow-card overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="font-display text-lg font-bold">Filters ({activeFilterCount})</h2>
                <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex-1 space-y-4">
                {FILTER_GROUPS.map((g) => (
                  <FilterAccordion
                    key={g.key}
                    title={g.title}
                    options={g.options}
                    selected={filters[g.key] ?? []}
                    onChange={(next) => setGroup(g.key, next)}
                  />
                ))}
              </div>
              <div className="mt-6 flex gap-2 border-t pt-4">
                <button onClick={clearAll} className="flex-1 rounded-full border py-2.5 text-sm font-semibold hover:bg-muted">
                  Clear
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Show Results ({matchingFoods.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <section aria-label="Recipes list">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{matchingFoods.length}</span> of {totalCount} dishes
            </p>
          </div>

          {matchingFoods.length === 0 ? (
            <div className="rounded-3xl border bg-card p-12 text-center shadow-soft">
              <p className="font-display text-xl font-bold">Walang natagpuang pagkain</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Walang tumutugma sa iyong search o piniling filters.
              </p>
              <button
                onClick={clearAll}
                className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {matchingFoods.map((f) => (
                <FoodCard key={f.id} food={f} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterAccordion({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(true);

  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((x) => x !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="border-b pb-3 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1 text-left text-sm font-semibold text-foreground hover:text-primary"
      >
        <span>
          {title}
          {selected.length > 0 && <span className="ml-1 text-xs text-primary">({selected.length})</span>}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-2 space-y-1.5 pl-1 max-h-48 overflow-y-auto">
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-xs text-foreground/85 hover:text-foreground">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  className="rounded border-input text-primary focus:ring-primary/40"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
