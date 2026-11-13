import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { PageHeader } from "@/components/recipe-card";
import { FoodCard } from "@/components/food-card";
import { FILTER_GROUPS, filterFoods, getFoods, type FilterKey, type FoodFilters } from "@/lib/recipe-service";

// Each filter is stored in the address bar as a comma-separated list, e.g. ?ingredient=Pork,Chicken
const PARAM: Record<FilterKey, "category" | "ingredient" | "method" | "taste" | "region" | "budget"> = {
  categories: "category", ingredients: "ingredient", methods: "method", tastes: "taste", regions: "region", budgets: "budget",
};

type RecipeSearch = { q?: string | undefined; category?: string | undefined; ingredient?: string | undefined; method?: string | undefined; taste?: string | undefined; region?: string | undefined; budget?: string | undefined };

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
  component: RecipeBook,
});

function parseFilters(search: RecipeSearch): FoodFilters {
  const pick = (key: FilterKey) => {
    const allowed = FILTER_GROUPS.find((g) => g.key === key)!.options.map((o) => o.value as string);
    const raw = search[PARAM[key]];
    return raw ? raw.split(",").map((v) => v.trim()).filter((v) => allowed.includes(v)) : [];
  };
  return {
    q: search.q ?? "",
    categories: pick("categories") as FoodFilters["categories"],
    ingredients: pick("ingredients"),
    methods: pick("methods"),
    tastes: pick("tastes"),
    regions: pick("regions"),
    budgets: pick("budgets") as FoodFilters["budgets"],
  };
}

function RecipeBook() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/recipes/" });
  const filters = parseFilters(search);
  const results = filterFoods(filters);
  const total = getFoods().length;
  const [panelOpen, setPanelOpen] = useState(false);

  const active = FILTER_GROUPS.flatMap((g) =>
    (filters[g.key] as string[]).map((value) => ({
      key: g.key, value, label: g.options.find((o) => o.value === value)?.label ?? value,
    })),
  );
  const activeCount = active.length;

  const setGroup = (key: FilterKey, values: string[]) =>
    navigate({ search: (p) => ({ ...p, [PARAM[key]]: values.length ? values.join(",") : undefined }), replace: true, resetScroll: false });
  const toggle = (key: FilterKey, value: string) => {
    const cur = filters[key] as string[];
    setGroup(key, cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]);
  };
  const clearAll = () => navigate({ search: {}, replace: true, resetScroll: false });

  const panel = (
    <div className="space-y-2">
      {FILTER_GROUPS.map((g) => (
        <FilterGroup
          key={g.key}
          label={g.label}
          selected={filters[g.key] as string[]}
          options={g.options as readonly { value: string; label: string }[]}
          defaultOpen={g.key === "categories" || g.key === "ingredients" || g.key === "budgets"}
          onToggle={(v) => toggle(g.key, v)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader title="Recipe Book" subtitle="Explore Filipino dishes from every region. Search, then combine filters to find exactly what you crave." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-soft">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={filters.q}
            onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value || undefined }), replace: true, resetScroll: false })}
            placeholder="Search dish, ingredient, category, region or taste…"
            aria-label="Search dishes"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
          {filters.q && (
            <button aria-label="Clear search" onClick={() => navigate({ search: (p) => ({ ...p, q: undefined }), replace: true, resetScroll: false })} className="rounded-full p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[17rem_1fr] lg:gap-8">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-1">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeCount > 0 && <button onClick={clearAll} className="text-sm font-bold text-primary hover:underline">Clear all</button>}
              </div>
              {panel}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing <b className="text-foreground">{results.length}</b> of {total} dishes
              </p>
              <button
                onClick={() => setPanelOpen((o) => !o)}
                aria-expanded={panelOpen}
                className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold shadow-soft lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>}
              </button>
            </div>

            {panelOpen && (
              <div className="fade-up mt-4 rounded-3xl bg-card p-4 shadow-soft lg:hidden">
                {panel}
                <div className="mt-4 flex gap-2">
                  {activeCount > 0 && <button onClick={clearAll} className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm font-bold">Clear all</button>}
                  <button onClick={() => setPanelOpen(false)} className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
                    Show {results.length} dish{results.length === 1 ? "" : "es"}
                  </button>
                </div>
              </div>
            )}

            {activeCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {active.map((a) => (
                  <button
                    key={`${a.key}-${a.value}`}
                    onClick={() => toggle(a.key, a.value)}
                    aria-label={`Remove filter ${a.label}`}
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground transition-opacity hover:opacity-85"
                  >
                    {a.label} <X className="h-3.5 w-3.5" />
                  </button>
                ))}
                <button onClick={clearAll} className="px-2 py-1.5 text-xs font-bold text-primary hover:underline">Clear All Filters</button>
              </div>
            )}

            {results.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((f) => <FoodCard key={f.id} food={f} />)}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed p-10 text-center">
                <p className="text-lg font-semibold">No dishes match your search.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try a different word, or remove a filter or two.</p>
                <button onClick={clearAll} className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label, options, selected, onToggle, defaultOpen,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen || selected.length > 0);
  return (
    <section className="rounded-2xl bg-background/60 p-3">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-left text-sm font-bold">
        <span>
          {label}
          {selected.length > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{selected.length}</span>}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                onClick={() => onToggle(o.value)}
                aria-pressed={on}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
