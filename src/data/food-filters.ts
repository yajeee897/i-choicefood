// Filter vocabularies for the Filipino food database. Every food record uses
// only these values, so filters and records always stay in sync.

export const FOOD_CATEGORIES = [
  { id: "main-dishes", name: "Main Dishes", tagalog: "Ulam", description: "Hearty viands best with rice." },
  { id: "soups", name: "Soups", tagalog: "Sabaw", description: "Comforting broths for rainy days." },
  { id: "rice-noodles", name: "Rice and Noodles", tagalog: "Kanin at Pansit", description: "Long noodles for long life, and rice for every meal." },
  { id: "street-foods", name: "Street Foods", tagalog: "Pagkaing Kalye", description: "Skewered, fried and sold on every corner." },
  { id: "snacks", name: "Snacks", tagalog: "Meryenda", description: "Afternoon bites between meals." },
  { id: "desserts", name: "Desserts", tagalog: "Panghimagas", description: "Sweet endings to every meal." },
  { id: "kakanin", name: "Kakanin", tagalog: "Kakanin", description: "Native rice and root-crop cakes." },
  { id: "breakfast", name: "Breakfast", tagalog: "Almusal", description: "Silog plates and morning favorites." },
  { id: "regional", name: "Regional Specialties", tagalog: "Pagkaing Rehiyonal", description: "Pride-of-place dishes from across the islands." },
] as const;

export type CategoryId = (typeof FOOD_CATEGORIES)[number]["id"];
export type Category = (typeof FOOD_CATEGORIES)[number];

export const MAIN_INGREDIENTS = [
  "Chicken", "Pork", "Beef", "Fish", "Seafood", "Vegetables", "Rice", "Noodles", "Egg", "Coconut Milk", "Fruits", "Flour & Bread",
] as const;
export type MainIngredient = (typeof MAIN_INGREDIENTS)[number];

export const COOKING_METHODS = [
  "Fried", "Grilled", "Boiled", "Steamed", "Roasted", "Sautéed", "Braised", "Baked", "Raw / Cured",
] as const;
export type CookingMethod = (typeof COOKING_METHODS)[number];

export const TASTES = ["Sweet", "Sour", "Salty", "Spicy", "Savory"] as const;
export type Taste = (typeof TASTES)[number];

export const REGIONS = [
  "Ilocos Region", "Cagayan Valley", "Central Luzon", "CALABARZON", "MIMAROPA", "Bicol Region",
  "Western Visayas", "Central Visayas", "Eastern Visayas", "Zamboanga Peninsula", "Northern Mindanao",
  "Davao Region", "SOCCSKSARGEN", "Caraga", "BARMM", "Metro Manila",
  // For dishes cooked the same way all over the country with no single place of origin.
  "Nationwide",
] as const;
export type Region = (typeof REGIONS)[number];

export const BUDGETS = [
  { id: "budget", label: "Budget Friendly", range: "₱1–₱100", min: 1, max: 100 },
  { id: "affordable", label: "Affordable", range: "₱101–₱200", min: 101, max: 200 },
  { id: "moderate", label: "Moderate", range: "₱201–₱350", min: 201, max: 350 },
  { id: "premium", label: "Premium", range: "₱351 and above", min: 351, max: Infinity },
] as const;
export type BudgetId = (typeof BUDGETS)[number]["id"];

export function budgetFor(price: number): BudgetId {
  const tier = BUDGETS.find((b) => price >= b.min && price <= b.max);
  return tier ? tier.id : price < 1 ? "budget" : "premium";
}
