// Data access layer. Phase 1 reads from local sample data; swap these
// implementations for database calls later without touching the UI.
import { categories, recipes, type CategoryId, type Ingredient, type Recipe } from "@/data/recipes";

export function getRecipes(): Recipe[] {
  return recipes;
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getFeatured(): Recipe[] {
  return recipes.filter((r) => r.featured);
}

export function getPopular(limit = 4): Recipe[] {
  return [...recipes].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getCategories() {
  return categories;
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id);
}

export function searchRecipes(query: string, category?: CategoryId): Recipe[] {
  const q = query.trim().toLowerCase();
  return recipes.filter((r) => {
    if (category && r.category !== category) return false;
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  });
}

export function ingredientCost(i: Ingredient, scale = 1) {
  return i.quantity * scale * i.pricePerUnit;
}

export function totalCost(ingredients: Ingredient[], scale = 1) {
  return ingredients.reduce((sum, i) => sum + ingredientCost(i, scale), 0);
}

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
