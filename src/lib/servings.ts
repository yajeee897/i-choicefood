import type { Ingredient, Recipe } from "@/data/recipes";

/** Return new ingredient rows; the recipe's original quantities are never mutated. */
export function scaleIngredients(ingredients: Ingredient[], baseServings: number, servings: number): Ingredient[] {
  const scale = servings / baseServings;
  return ingredients.map((ingredient) => ({ ...ingredient, quantity: ingredient.quantity * scale }));
}

const FRACTIONS: Record<string, string> = {
  "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾",
  "1/8": "⅛", "3/8": "⅜", "5/8": "⅝", "7/8": "⅞",
};

function mixedFraction(value: number): string {
  if (value >= 20) return String(Math.round(value));
  let whole = Math.floor(value);
  const fraction = value - whole;
  const denominators = [2, 3, 4, 8];
  let best = { numerator: 0, denominator: 1, difference: fraction };
  for (const denominator of denominators) {
    const numerator = Math.round(fraction * denominator);
    const difference = Math.abs(fraction - numerator / denominator);
    if (difference < best.difference) best = { numerator, denominator, difference };
  }
  if (best.numerator === best.denominator) {
    whole += 1;
    best = { numerator: 0, denominator: 1, difference: 0 };
  }
  if (best.numerator === 0) return String(whole);
  const divisor = (a: number, b: number): number => b === 0 ? a : divisor(b, a % b);
  const common = divisor(best.numerator, best.denominator);
  const numerator = best.numerator / common;
  const denominator = best.denominator / common;
  const reduced = FRACTIONS[`${numerator}/${denominator}`] ?? `${numerator}/${denominator}`;
  return whole > 0 ? `${whole}${reduced}` : reduced;
}

/** Readable kitchen measurements, including grams for small kg amounts and useful fractions. */
export function formatQuantity(quantity: number, unit: string): string {
  let value = quantity;
  let normalized = unit.toLowerCase();
  if (normalized === "kg" && value < 1) {
    const grams = value * 1000;
    return `${grams >= 10 ? Math.round(grams) : +grams.toFixed(1)} g`;
  }
  if (normalized === "cup" && value < 0.25) {
    value *= 16;
    normalized = "tbsp";
  }
  if (normalized === "tbsp" && value < 1) {
    value *= 3;
    normalized = "tsp";
  }
  if (value > 0 && value < 0.0625) return `${+value.toFixed(3)} ${normalized}`;
  return `${mixedFraction(value)} ${normalized}`;
}

export interface CookingTimeEstimate {
  minMinutes: number;
  maxMinutes: number;
  note: string;
  safetyNote: string;
}

interface TimeBand {
  through: number;
  min: number;
  max: number;
}

interface TimeProfile {
  bands: TimeBand[];
  note: string;
  safetyNote: string;
}

/** Hand-tuned bands, not serving multipliers: tenderness, thickness and heat still govern doneness. */
const TIME_PROFILES: Record<string, TimeProfile> = {
  adobo: {
    bands: [
      { through: 1, min: 20, max: 30 },
      { through: 2, min: 25, max: 30 },
      { through: 4, min: 30, max: 30 },
      { through: 6, min: 35, max: 45 },
      { through: 100, min: 40, max: 50 },
    ],
    note: "Keep similar-sized meat pieces and a gentle simmer. Larger batches need room in the pot and more time for the sauce to reduce.",
    safetyNote: "Cook chicken thoroughly to 74°C (165°F) in the thickest piece. Smaller portions do not make undercooked chicken safe.",
  },
  sinigang: {
    bands: [
      { through: 2, min: 50, max: 60 },
      { through: 5, min: 60, max: 60 },
      { through: 8, min: 65, max: 75 },
      { through: 100, min: 70, max: 85 },
    ],
    note: "Pork ribs still need enough simmering to become tender. Add the vegetables near the end regardless of batch size.",
    safetyNote: "Check that the pork is fully cooked and tender; do not shorten the simmer solely because the batch is smaller.",
  },
  tinola: {
    bands: [
      { through: 2, min: 30, max: 40 },
      { through: 4, min: 40, max: 40 },
      { through: 6, min: 45, max: 50 },
      { through: 100, min: 45, max: 55 },
    ],
    note: "Bone-in chicken pieces and papaya thickness matter more than serving count. Simmer gently rather than increasing the heat.",
    safetyNote: "Chicken must reach 74°C (165°F) in the thickest piece, away from the bone.",
  },
  "kare-kare": {
    bands: [
      { through: 3, min: 120, max: 150 },
      { through: 6, min: 150, max: 150 },
      { through: 9, min: 150, max: 180 },
      { through: 100, min: 165, max: 195 },
    ],
    note: "Oxtail tenderizes with moist heat over time. A smaller pot does not remove that process; avoid crowding a large batch.",
    safetyNote: "Continue until the oxtail is fully cooked and fork-tender. Blanch vegetables separately so they do not overcook.",
  },
  pinakbet: {
    bands: [
      { through: 2, min: 20, max: 25 },
      { through: 4, min: 25, max: 25 },
      { through: 7, min: 25, max: 30 },
      { through: 100, min: 30, max: 35 },
    ],
    note: "Cut vegetables to similar sizes and add firm pieces first. Crowded pans can take a little longer to cook evenly.",
    safetyNote: "Cook the pork completely and the vegetables until just tender; avoid extending the time only to soften them further.",
  },
  "pancit-canton": {
    bands: [
      { through: 3, min: 15, max: 20 },
      { through: 6, min: 20, max: 20 },
      { through: 9, min: 20, max: 25 },
      { through: 100, min: 25, max: 30 },
    ],
    note: "Use a wide pan and avoid crowding. Noodles should absorb the broth without becoming mushy; large batches may be easier in two pans.",
    safetyNote: "Pork must be fully cooked and shrimp opaque throughout before they are mixed back into the noodles.",
  },
  "leche-flan": {
    bands: [
      { through: 4, min: 40, max: 50 },
      { through: 8, min: 50, max: 50 },
      { through: 12, min: 50, max: 60 },
      { through: 100, min: 55, max: 65 },
    ],
    note: "This assumes the same custard depth and gentle steam. A deeper mold needs more time; multiple shallow molds may cook more evenly.",
    safetyNote: "Steam until the custard is set with a slight wobble in the center, then chill promptly. Do not judge doneness by servings alone.",
  },
};

export function estimateCookingTime(recipe: Recipe, servings: number): CookingTimeEstimate {
  const profile = TIME_PROFILES[recipe.id];
  if (!profile) {
    return {
      minMinutes: recipe.cookMinutes,
      maxMinutes: recipe.cookMinutes,
      note: "Use the original method and check doneness before serving.",
      safetyNote: "Cooking time is an estimate; ingredient size and actual heat can change it.",
    };
  }
  const band = profile.bands.find((candidate) => servings <= candidate.through) ?? profile.bands.at(-1)!;
  return {
    minMinutes: band.min,
    maxMinutes: band.max,
    note: `${profile.note}${servings > recipe.servings * 2 ? " For very large batches, cook in batches rather than crowding the pan." : ""}`,
    safetyNote: profile.safetyNote,
  };
}

function minutesLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} hr${rest ? ` ${rest} min` : ""}`;
}

export function cookingTimeLabel(estimate: Pick<CookingTimeEstimate, "minMinutes" | "maxMinutes">): string {
  if (estimate.minMinutes === estimate.maxMinutes) return minutesLabel(estimate.minMinutes);
  if (estimate.minMinutes < 60 && estimate.maxMinutes < 60) return `${estimate.minMinutes}–${estimate.maxMinutes} minutes`;
  return `${minutesLabel(estimate.minMinutes)}–${minutesLabel(estimate.maxMinutes)}`;
}
