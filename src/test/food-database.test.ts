import { describe, expect, it } from "vitest";
import { REGIONS, budgetFor } from "@/data/food-filters";
import { emptyFilters, filterFoods, getCookingSteps, getFood, getFoods, getRecipes, stepMinutes } from "@/lib/recipe-service";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

describe("Food database", () => {
  it("has at least 100 dishes", () => {
    expect(getFoods().length).toBeGreaterThanOrEqual(100);
  });

  it("has no duplicate dishes (by id or name)", () => {
    const ids = getFoods().map((f) => f.id);
    const names = getFoods().map((f) => norm(f.name));
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every dish complete filter information", () => {
    for (const f of getFoods()) {
      expect(f.categories.length, f.id).toBeGreaterThan(0);
      expect(REGIONS as readonly string[], f.id).toContain(f.region);
      expect(f.mainIngredients.length, f.id).toBeGreaterThan(0);
      expect(f.methods.length, f.id).toBeGreaterThan(0);
      expect(f.tastes.length, f.id).toBeGreaterThan(0);
      expect(f.price, f.id).toBeGreaterThan(0);
      expect(f.description.length, f.id).toBeGreaterThan(10);
    }
  });

  it("never shows the same photo for two different dishes", () => {
    const photos = getFoods().map((f) => f.image).filter(Boolean);
    expect(new Set(photos).size).toBe(photos.length);
  });
});

describe("Budget tiers", () => {
  it("puts ₱100 in Budget Friendly and ₱101 in Affordable", () => {
    expect(budgetFor(100)).toBe("budget");
    expect(budgetFor(101)).toBe("affordable");
  });
  it("puts ₱350 in Moderate and ₱351 in Premium", () => {
    expect(budgetFor(350)).toBe("moderate");
    expect(budgetFor(351)).toBe("premium");
  });
});

describe("Filters", () => {
  it("combines choices inside one filter with OR (Pork or Chicken)", () => {
    const res = filterFoods({ ...emptyFilters(), ingredients: ["Pork", "Chicken"] });
    expect(res.every((f) => f.mainIngredients.some((i) => i === "Pork" || i === "Chicken"))).toBe(true);
    expect(res.some((f) => f.mainIngredients.includes("Pork"))).toBe(true);
    expect(res.some((f) => f.mainIngredients.includes("Chicken"))).toBe(true);
  });

  it("combines different filters with AND (Pork and Fried and Budget Friendly)", () => {
    const res = filterFoods({ ...emptyFilters(), ingredients: ["Pork"], methods: ["Fried"], budgets: ["budget"] });
    expect(res.length).toBeGreaterThan(0);
    for (const f of res) {
      expect(f.mainIngredients).toContain("Pork");
      expect(f.methods).toContain("Fried");
      expect(f.price).toBeLessThanOrEqual(100);
    }
  });

  it("searches by name, ingredient and region together with filters", () => {
    expect(filterFoods({ ...emptyFilters(), q: "sisig" }).map((f) => f.id)).toContain("sisig");
    expect(filterFoods({ ...emptyFilters(), q: "tamarind" }).map((f) => f.id)).toContain("sinigang");
    const bicol = filterFoods({ ...emptyFilters(), q: "bicol", tastes: ["Spicy"] });
    expect(bicol.map((f) => f.id)).toContain("bicol-express");
    expect(bicol.every((f) => f.tastes.includes("Spicy"))).toBe(true);
  });

  it("returns nothing for a combination no dish matches", () => {
    expect(filterFoods({ ...emptyFilters(), q: "zzzz-no-such-dish" })).toHaveLength(0);
  });

  it("returns every dish when no filters are set", () => {
    expect(filterFoods(emptyFilters())).toHaveLength(getFoods().length);
  });
});

describe("Dish pages", () => {
  it("can open every dish in the database", () => {
    for (const f of getFoods()) expect(getFood(f.id)?.name).toBe(f.name);
  });
});

describe("Cooking Simulator", () => {
  it("shows a different photo for every step of every recipe", () => {
    for (const r of getRecipes()) {
      const steps = getCookingSteps(r);
      expect(steps).toHaveLength(r.steps.length);
      expect(new Set(steps.map((s) => s.image)).size, r.id).toBe(r.steps.length);
    }
  });

  it("reads step wait times for the timer", () => {
    expect(stepMinutes("Marinate for at least 30 minutes.")).toBe(30);
    expect(stepMinutes("Simmer covered for 35–40 minutes")).toBe(35);
    expect(stepMinutes("Boil oxtail for 2–2½ hours")).toBe(120);
    expect(stepMinutes("Serve with steamed rice.")).toBeUndefined();
  });
});
