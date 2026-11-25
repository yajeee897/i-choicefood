// Data access layer. Phase 1 reads from local data files; swap these
// implementations for database calls later without touching the UI.
import { recipes, type Ingredient, type Recipe } from "@/data/recipes";
import { foods, type FoodRecord } from "@/data/foods";
import { FOOD_PHOTOS } from "@/data/food-photos";
import { RECIPE_STEP_VISUALS, STEP_KEYWORDS, STEP_PHOTOS, type StepVisual } from "@/data/step-visuals";
import {
  BUDGETS, COOKING_METHODS, FOOD_CATEGORIES, MAIN_INGREDIENTS, REGIONS, TASTES,
  budgetFor, type BudgetId, type CategoryId,
} from "@/data/food-filters";

// ── Full recipes (ingredients with quantities + cooking steps) ──────────
export function getRecipes(): Recipe[] {
  return recipes;
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function ingredientCost(i: Ingredient, scale = 1) {
  return i.quantity * scale * i.pricePerUnit;
}

export function totalCost(ingredients: Ingredient[], scale = 1) {
  return ingredients.reduce((sum, i) => sum + ingredientCost(i, scale), 0);
}

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);

export const pesoWhole = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);

// ── Food database ───────────────────────────────────────────────────────
export type Food = FoodRecord & {
  /** Photo URL, or undefined when no matching photo exists (UI shows a placeholder) */
  image?: string | undefined;
  /** Wikimedia Commons file name for the photo credit */
  imageFile?: string | undefined;
  budget: BudgetId;
  hasFullRecipe: boolean;
};

const catalog: Food[] = foods.map((f) => {
  const recipe = getRecipe(f.id);
  const photo = FOOD_PHOTOS[f.id];
  return {
    ...f,
    image: recipe?.image ?? photo?.url,
    ...(photo && !recipe ? { imageFile: photo.file } : {}),
    budget: budgetFor(f.price),
    hasFullRecipe: Boolean(recipe),
  };
});

export function getFoods(): Food[] {
  return catalog;
}

export function getFood(id: string): Food | undefined {
  return catalog.find((f) => f.id === id);
}

export function getFeaturedFoods(): Food[] {
  return catalog.filter((f) => f.featured);
}

export function getPopularFoods(limit = 4, exclude: string[] = []): Food[] {
  return [...catalog]
    .filter((f) => !exclude.includes(f.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getFoodCategories() {
  return FOOD_CATEGORIES;
}

export function getCategoryName(id: CategoryId) {
  return FOOD_CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

export function getFoodsInCategory(id: CategoryId): Food[] {
  return catalog.filter((f) => f.categories.includes(id));
}

export function getSimilarFoods(food: Food, limit = 4): Food[] {
  return catalog
    .filter((f) => f.id !== food.id && f.categories.some((c) => food.categories.includes(c)))
    .sort((a, b) => {
      const score = (f: Food) =>
        f.mainIngredients.filter((i) => food.mainIngredients.includes(i)).length + (f.region === food.region ? 1 : 0);
      return score(b) - score(a) || b.popularity - a.popularity;
    })
    .slice(0, limit);
}

/** One distinct cover photo per category (no two categories share a photo). */
export function getCategoryCovers(): Record<CategoryId, string | undefined> {
  const used = new Set<string>();
  const covers = {} as Record<CategoryId, string | undefined>;
  for (const c of FOOD_CATEGORIES) {
    const pick = [...getFoodsInCategory(c.id)]
      .sort((a, b) => b.popularity - a.popularity)
      .find((f) => f.image && !used.has(f.image));
    if (pick?.image) used.add(pick.image);
    covers[c.id] = pick?.image;
  }
  return covers;
}

// ── Filtering ───────────────────────────────────────────────────────────
export interface FoodFilters {
  q: string;
  categories: CategoryId[];
  ingredients: string[];
  methods: string[];
  tastes: string[];
  regions: string[];
  budgets: BudgetId[];
}

export const FILTER_GROUPS = [
  { key: "categories", label: "Category", options: FOOD_CATEGORIES.map((c) => ({ value: c.id, label: c.name })) },
  { key: "ingredients", label: "Main ingredient", options: MAIN_INGREDIENTS.map((v) => ({ value: v, label: v })) },
  { key: "methods", label: "Cooking method", options: COOKING_METHODS.map((v) => ({ value: v, label: v })) },
  { key: "tastes", label: "Taste", options: TASTES.map((v) => ({ value: v, label: v })) },
  { key: "regions", label: "Region", options: REGIONS.map((v) => ({ value: v, label: v })) },
  { key: "budgets", label: "Budget", options: BUDGETS.map((b) => ({ value: b.id, label: `${b.label} (${b.range})` })) },
] as const;

export type FilterKey = (typeof FILTER_GROUPS)[number]["key"];

export const emptyFilters = (): FoodFilters => ({
  q: "", categories: [], ingredients: [], methods: [], tastes: [], regions: [], budgets: [],
});

function searchText(f: Food) {
  return [
    f.name, ...(f.aliases ?? []), f.description, ...f.ingredients, ...f.mainIngredients,
    ...f.categories.map(getCategoryName), ...f.categories.map((c) => FOOD_CATEGORIES.find((x) => x.id === c)?.tagalog ?? ""),
    f.region, ...f.tastes, ...f.methods,
  ].join(" ").toLowerCase();
}
const searchIndex = new Map(catalog.map((f) => [f.id, searchText(f)]));

/**
 * Options inside one filter group are combined with OR (Pork OR Chicken);
 * different groups are combined with AND (Pork AND Fried AND Budget Friendly).
 * Every word of the search text must appear somewhere in the dish.
 */
export function filterFoods(filters: FoodFilters): Food[] {
  const words = filters.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const anyOf = <T,>(selected: readonly T[], values: readonly T[]) =>
    selected.length === 0 || selected.some((s) => values.includes(s));
  return catalog.filter((f) => {
    if (!anyOf(filters.categories, f.categories)) return false;
    if (!anyOf(filters.ingredients, f.mainIngredients as readonly string[])) return false;
    if (!anyOf(filters.methods, f.methods as readonly string[])) return false;
    if (!anyOf(filters.tastes, f.tastes as readonly string[])) return false;
    if (!anyOf(filters.regions, [f.region as string])) return false;
    if (!anyOf(filters.budgets, [f.budget])) return false;
    const text = searchIndex.get(f.id) ?? "";
    return words.every((w) => text.includes(w));
  });
}

// ── Cooking Simulator steps ─────────────────────────────────────────────
export interface CookingStep {
  text: string;
  stage: string;
  /** Photo of this step's cooking action */
  image: string;
  /** Wait time mentioned in the step, in minutes (undefined when none) */
  minutes: number | undefined;
}

/** Reads the first wait time in a step, e.g. "Simmer for 35–40 minutes" → 35, "2–2½ hours" → 120. */
export function stepMinutes(text: string): number | undefined {
  const m = text.match(/(\d+(?:\.\d+)?)(?:\s*[–-]\s*[\d½.]+)?\s*(minutes?|mins?|hours?|hrs?)\b/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  return /^h/i.test(m[2]!) ? n * 60 : n;
}

/**
 * Every step gets its own photo: the hand-picked one for that step, else the
 * first unused keyword match, else the dish photo as a last resort.
 */
export function getCookingSteps(recipe: Recipe): CookingStep[] {
  const picked = RECIPE_STEP_VISUALS[recipe.id] ?? [];
  const used = new Set<string>();
  return recipe.steps.map((text, i) => {
    let visual: StepVisual | undefined = picked[i];
    if (!visual || used.has(visual.photo)) {
      const keyword = STEP_KEYWORDS.find(
  (k) => k.match.test(text) && !used.has(k.photo)
);

if (keyword) {
  visual = {
    photo: keyword.photo,
    stage: keyword.stage,
  };
}
    }
    if (visual) used.add(visual.photo);
    return {
      text,
      stage: visual?.stage ?? `Step ${i + 1}`,
      image: visual ? STEP_PHOTOS[visual.photo] : recipe.image,
      minutes: stepMinutes(text),
    };
  });
}
