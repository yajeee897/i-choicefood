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
import addSugar from "@/assets/steps/add-sugar.jpg";
import prepareChicken from "@/assets/steps/prepare-chicken.jpg";
import reduceSauce from "@/assets/steps/reduce-sauce.jpg";
import restMarinade from "@/assets/steps/rest-marinade.jpg";

export const STEP_PHOTOS = {
  marinate, sear, pourLiquid, simmer, serve, strain, addVegetables, season, saute, boilMeat,
  caramelize, mixCustard, steam, unmoldFlan, tossNoodles, renderPork, annattoOil, peanutSauce,
  wiltGreens, cookShrimp, garnishCalamansi, arrangeVegetables,
  addSugar, prepareChicken, reduceSauce, restMarinade,
} as const;
export type StepPhoto = keyof typeof STEP_PHOTOS;

export interface StepVisual { photo: StepPhoto; stage: string }

const ADOBO_9_STEPS: StepVisual[] = [
  { photo: "prepareChicken", stage: "Prepare meat" },
  { photo: "marinate", stage: "Marinate" },
  { photo: "restMarinade", stage: "Rest marinade" },
  { photo: "sear", stage: "Sear & brown" },
  { photo: "simmer", stage: "Simmer tender" },
  { photo: "addSugar", stage: "Add sugar" },
  { photo: "season", stage: "Adjust flavor" },
  { photo: "reduceSauce", stage: "Reduce sauce" },
  { photo: "serve", stage: "Serve hot" },
];

/** One entry per step, in order, for every recipe in the simulator. */
export const RECIPE_STEP_VISUALS: Record<string, StepVisual[]> = {
  adobo: ADOBO_9_STEPS,
  "chicken-adobo": ADOBO_9_STEPS,
  "pork-adobo": ADOBO_9_STEPS,
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
    { photo: "arrangeVegetables", stage: "Arrange & serve" },
  ],
  pinakbet: [
    { photo: "renderPork", stage: "Render pork" },
    { photo: "saute", stage: "Sauté bagoong" },
    { photo: "pourLiquid", stage: "Simmer base" },
    { photo: "addVegetables", stage: "Add squash" },
    { photo: "serve", stage: "Serve" },
  ],
  "pancit-canton": [
    { photo: "saute", stage: "Sauté meat" },
    { photo: "cookShrimp", stage: "Cook shrimp" },
    { photo: "addVegetables", stage: "Stir-fry veg" },
    { photo: "tossNoodles", stage: "Toss noodles" },
    { photo: "garnishCalamansi", stage: "Calamansi & serve" },
  ],
  "leche-flan": [
    { photo: "caramelize", stage: "Caramelize sugar" },
    { photo: "mixCustard", stage: "Mix custard" },
    { photo: "strain", stage: "Strain into mold" },
    { photo: "steam", stage: "Gentle steam" },
    { photo: "unmoldFlan", stage: "Chill & unmold" },
  ],
};

export const STEP_KEYWORDS: Array<{ match: RegExp; photo: StepPhoto; stage: string }> = [
  { match: /marinat/i, photo: "marinate", stage: "Marinate" },
  { match: /brown|sear/i, photo: "sear", stage: "Sear" },
  { match: /simmer|boil/i, photo: "simmer", stage: "Simmer" },
  { match: /saut[eé]|gisa/i, photo: "saute", stage: "Sauté" },
  { match: /serve/i, photo: "serve", stage: "Serve" },
  { match: /steam/i, photo: "steam", stage: "Steam" },
  { match: /strain/i, photo: "strain", stage: "Strain" },
  { match: /vegetable|kangkong|papaya|squash/i, photo: "addVegetables", stage: "Add vegetables" },
];
