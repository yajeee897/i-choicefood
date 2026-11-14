// Step photos for the Cooking Simulator. Each recipe step gets its own photo of
// that cooking action; steps without an entry fall back to a keyword match.
import marinate from "@/assets/steps/marinate.jpg";
import sear from "@/assets/steps/sear.jpg";
import pourLiquid from "@/assets/steps/pour-liquid.jpg";
import simmer from "@/assets/steps/simmer.jpg";
import serve from "@/assets/steps/serve.jpg";
import strain from "@/assets/steps/strain.jpg";
import addVegetables from "@/assets/steps/add-vegetables.jpg";
import season from "@/assets/steps/season.jpg";
import saute from "@/assets/steps/saute.jpg";
import boilMeat from "@/assets/steps/boil-meat.jpg";
import caramelize from "@/assets/steps/caramelize.jpg";
import mixCustard from "@/assets/steps/mix-custard.jpg";
import steam from "@/assets/steps/steam.jpg";
import unmoldFlan from "@/assets/steps/unmold-flan.jpg";
import tossNoodles from "@/assets/steps/toss-noodles.jpg";
import renderPork from "@/assets/steps/render-pork.jpg";
import annattoOil from "@/assets/steps/annatto-oil.jpg";
import peanutSauce from "@/assets/steps/peanut-sauce.jpg";
import wiltGreens from "@/assets/steps/wilt-greens.jpg";
import cookShrimp from "@/assets/steps/cook-shrimp.jpg";
import garnishCalamansi from "@/assets/steps/garnish-calamansi.jpg";
import arrangeVegetables from "@/assets/steps/arrange-vegetables.jpg";

export const STEP_PHOTOS = {
  marinate, sear, pourLiquid, simmer, serve, strain, addVegetables, season, saute, boilMeat,
  caramelize, mixCustard, steam, unmoldFlan, tossNoodles, renderPork, annattoOil, peanutSauce,
  wiltGreens, cookShrimp, garnishCalamansi, arrangeVegetables,
} as const;
export type StepPhoto = keyof typeof STEP_PHOTOS;

export interface StepVisual { photo: StepPhoto; stage: string }

/** One entry per step, in order, for every recipe in the simulator. */
export const RECIPE_STEP_VISUALS: Record<string, StepVisual[]> = {
  adobo: [
    { photo: "marinate", stage: "Marinate" },
    { photo: "sear", stage: "Sear" },
    { photo: "pourLiquid", stage: "Add the sauce" },
    { photo: "simmer", stage: "Simmer" },
    { photo: "serve", stage: "Reduce & serve" },
  ],
  sinigang: [
    { photo: "strain", stage: "Sour base" },
    { photo: "simmer", stage: "Simmer pork" },
    { photo: "pourLiquid", stage: "Add tamarind" },
    { photo: "season", stage: "Season" },
    { photo: "wiltGreens", stage: "Add kangkong" },
  ],
  tinola: [
    { photo: "saute", stage: "Sauté aromatics" },
    { photo: "sear", stage: "Brown chicken" },
    { photo: "simmer", stage: "Simmer" },
    { photo: "addVegetables", stage: "Add papaya" },
    { photo: "wiltGreens", stage: "Add leaves" },
  ],
  "kare-kare": [
    { photo: "boilMeat", stage: "Boil oxtail" },
    { photo: "annattoOil", stage: "Annatto oil" },
    { photo: "saute", stage: "Sauté & combine" },
    { photo: "peanutSauce", stage: "Peanut sauce" },
    { photo: "arrangeVegetables", stage: "Vegetables & serve" },
  ],
  pinakbet: [
    { photo: "renderPork", stage: "Render pork" },
    { photo: "saute", stage: "Sauté aromatics" },
    { photo: "pourLiquid", stage: "Bagoong & water" },
    { photo: "addVegetables", stage: "Add vegetables" },
    { photo: "simmer", stage: "Cover & cook" },
  ],
  "pancit-canton": [
    { photo: "saute", stage: "Sauté & brown" },
    { photo: "cookShrimp", stage: "Cook shrimp" },
    { photo: "addVegetables", stage: "Vegetables" },
    { photo: "tossNoodles", stage: "Toss noodles" },
    { photo: "garnishCalamansi", stage: "Top & serve" },
  ],
  "leche-flan": [
    { photo: "caramelize", stage: "Caramelize" },
    { photo: "mixCustard", stage: "Mix custard" },
    { photo: "strain", stage: "Strain" },
    { photo: "steam", stage: "Steam" },
    { photo: "unmoldFlan", stage: "Chill & unmold" },
  ],
};

/** Keyword fallback for steps that have no hand-picked photo, checked in order. */
export const STEP_KEYWORDS: { pattern: RegExp; visual: StepVisual }[] = [
  { pattern: /marinat/i, visual: { photo: "marinate", stage: "Marinate" } },
  { pattern: /caramel/i, visual: { photo: "caramelize", stage: "Caramelize" } },
  { pattern: /strain|sieve/i, visual: { photo: "strain", stage: "Strain" } },
  { pattern: /steam/i, visual: { photo: "steam", stage: "Steam" } },
  { pattern: /render|crisp/i, visual: { photo: "renderPork", stage: "Render" } },
  { pattern: /shrimp|prawn/i, visual: { photo: "cookShrimp", stage: "Cook shrimp" } },
  { pattern: /noodle/i, visual: { photo: "tossNoodles", stage: "Toss noodles" } },
  { pattern: /peanut/i, visual: { photo: "peanutSauce", stage: "Thicken sauce" } },
  { pattern: /annatto|achuete/i, visual: { photo: "annattoOil", stage: "Annatto oil" } },
  { pattern: /sear|brown/i, visual: { photo: "sear", stage: "Sear" } },
  { pattern: /sauté|saute|stir-fry/i, visual: { photo: "saute", stage: "Sauté" } },
  { pattern: /egg|whisk|mix/i, visual: { photo: "mixCustard", stage: "Mix" } },
  { pattern: /kangkong|leaves|wilt|greens/i, visual: { photo: "wiltGreens", stage: "Add greens" } },
  { pattern: /vegetable|squash|papaya|eggplant/i, visual: { photo: "addVegetables", stage: "Add vegetables" } },
  { pattern: /boil/i, visual: { photo: "boilMeat", stage: "Boil" } },
  { pattern: /pour|broth|water/i, visual: { photo: "pourLiquid", stage: "Add liquid" } },
  { pattern: /season|fish sauce|salt/i, visual: { photo: "season", stage: "Season" } },
  { pattern: /simmer|cover/i, visual: { photo: "simmer", stage: "Simmer" } },
  { pattern: /invert|unmold/i, visual: { photo: "unmoldFlan", stage: "Unmold" } },
  { pattern: /serve|plate/i, visual: { photo: "serve", stage: "Serve" } },
];
