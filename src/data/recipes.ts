import adobo from "@/assets/adobo.jpg";
import sinigang from "@/assets/sinigang.jpg";
import tinola from "@/assets/tinola.jpg";
import kareKare from "@/assets/kare-kare.jpg";
import pinakbet from "@/assets/pinakbet.jpg";
import pancit from "@/assets/pancit.jpg";
import lecheFlan from "@/assets/leche-flan.jpg";

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  /** Price in PHP per one unit */
  pricePerUnit: number;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  description: string;
  region: string;
  image: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  featured?: boolean;
  popularity: number;
  ingredients: Ingredient[];
  steps: string[];
  notes?: string[];
}

export const recipes: Recipe[] = [
  {
    id: "adobo",
    name: "Chicken Pork Adobo",
    tagline: "The unofficial national dish",
    description: "Chicken and pork braised in soy sauce, vinegar, garlic, bay leaves and peppercorns until tender and glossy.",
    region: "Nationwide",
    image: adobo,
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 45,
    difficulty: "Easy",
    featured: true,
    popularity: 98,
    ingredients: [
      { name: "Chicken thighs", quantity: 0.5, unit: "kg", pricePerUnit: 220 },
      { name: "Pork belly", quantity: 0.5, unit: "kg", pricePerUnit: 340 },
      { name: "Soy sauce", quantity: 0.5, unit: "cup", pricePerUnit: 20 },
      { name: "Cane vinegar", quantity: 0.33, unit: "cup", pricePerUnit: 15 },
      { name: "Garlic", quantity: 1, unit: "head", pricePerUnit: 12 },
      { name: "Onion", quantity: 1, unit: "pc", pricePerUnit: 10 },
      { name: "Bay leaves", quantity: 3, unit: "pc", pricePerUnit: 1 },
      { name: "Black peppercorns", quantity: 1, unit: "tsp", pricePerUnit: 3 },
      { name: "Water", quantity: 1, unit: "cup", pricePerUnit: 0 },
      { name: "Brown or white sugar", quantity: 1, unit: "tbsp", pricePerUnit: 2 },
    ],
    steps: [
      "Prepare and clean the chicken and pork, then cut into similar-sized pieces.",
      "Combine chicken, pork, soy sauce, vinegar, garlic, onion, bay leaves and black pepper.",
      "Allow the meat to absorb the marinade for at least 30 minutes.",
      "Cook the chicken and pork, adding water as needed.",
      "Simmer until the chicken is thoroughly cooked and the meat is tender, about 30 minutes for a standard batch.",
      "Add brown sugar or white sugar according to taste.",
      "Adjust the flavor with a little soy sauce or vinegar if necessary.",
      "Continue simmering until the sauce reaches your desired consistency.",
      "Serve with steamed rice.",
    ],
    notes: ["Sugar helps balance the salty soy sauce and sour vinegar in Chicken Adobo. Add it gradually and adjust to taste."],
  },
  {
    id: "sinigang",
    name: "Sinigang na Baboy",
    tagline: "Sour tamarind comfort soup",
    description: "Pork simmered in a tangy tamarind broth with kangkong, radish, tomatoes and long green chili.",
    region: "Luzon",
    image: sinigang,
    servings: 5,
    prepMinutes: 15,
    cookMinutes: 60,
    difficulty: "Easy",
    featured: true,
    popularity: 95,
    ingredients: [
      { name: "Pork ribs", quantity: 0.75, unit: "kg", pricePerUnit: 320 },
      { name: "Tamarind (sampalok)", quantity: 0.25, unit: "kg", pricePerUnit: 80 },
      { name: "Kangkong", quantity: 1, unit: "bundle", pricePerUnit: 20 },
      { name: "Labanos (radish)", quantity: 1, unit: "pc", pricePerUnit: 25 },
      { name: "Tomatoes", quantity: 2, unit: "pc", pricePerUnit: 8 },
      { name: "Onion", quantity: 1, unit: "pc", pricePerUnit: 10 },
      { name: "Siling haba", quantity: 3, unit: "pc", pricePerUnit: 3 },
      { name: "Fish sauce", quantity: 2, unit: "tbsp", pricePerUnit: 2 },
    ],
    steps: [
      "Boil tamarind until soft, mash, and strain to extract the sour juice.",
      "Simmer pork with onion and tomatoes for 45 minutes until tender.",
      "Add the tamarind juice and radish; cook for 5 minutes.",
      "Add siling haba and season with fish sauce.",
      "Turn off heat, add kangkong, and let it wilt before serving.",
    ],
  },
  {
    id: "tinola",
    name: "Chicken Tinola",
    tagline: "Gingery soup for the soul",
    description: "Chicken in a clear ginger broth with green papaya and malunggay or chili leaves.",
    region: "Luzon",
    image: tinola,
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 40,
    difficulty: "Easy",
    popularity: 88,
    ingredients: [
      { name: "Chicken (cut)", quantity: 1, unit: "kg", pricePerUnit: 210 },
      { name: "Ginger", quantity: 0.05, unit: "kg", pricePerUnit: 160 },
      { name: "Green papaya", quantity: 1, unit: "pc", pricePerUnit: 35 },
      { name: "Chili leaves", quantity: 1, unit: "bundle", pricePerUnit: 15 },
      { name: "Onion", quantity: 1, unit: "pc", pricePerUnit: 10 },
      { name: "Garlic", quantity: 0.5, unit: "head", pricePerUnit: 12 },
      { name: "Fish sauce", quantity: 2, unit: "tbsp", pricePerUnit: 2 },
    ],
    steps: [
      "Sauté garlic, onion and julienned ginger until fragrant.",
      "Add chicken and cook until lightly browned; season with fish sauce.",
      "Pour in water and simmer for 25 minutes.",
      "Add green papaya and cook until tender.",
      "Stir in chili leaves, turn off the heat and serve hot.",
    ],
  },
  {
    id: "kare-kare",
    name: "Kare-Kare",
    tagline: "Rich peanut oxtail stew",
    description: "Oxtail and vegetables in a thick, savory peanut sauce, served with bagoong alamang.",
    region: "Pampanga",
    image: kareKare,
    servings: 6,
    prepMinutes: 20,
    cookMinutes: 150,
    difficulty: "Hard",
    featured: true,
    popularity: 91,
    ingredients: [
      { name: "Oxtail", quantity: 1, unit: "kg", pricePerUnit: 520 },
      { name: "Peanut butter", quantity: 0.5, unit: "cup", pricePerUnit: 60 },
      { name: "Toasted rice flour", quantity: 0.25, unit: "cup", pricePerUnit: 20 },
      { name: "Eggplant", quantity: 2, unit: "pc", pricePerUnit: 15 },
      { name: "Pechay", quantity: 1, unit: "bundle", pricePerUnit: 25 },
      { name: "String beans", quantity: 1, unit: "bundle", pricePerUnit: 25 },
      { name: "Annatto seeds", quantity: 1, unit: "tbsp", pricePerUnit: 5 },
      { name: "Bagoong alamang", quantity: 0.25, unit: "cup", pricePerUnit: 40 },
    ],
    steps: [
      "Boil oxtail for 2–2½ hours until fork-tender. Reserve the broth.",
      "Extract annatto color by soaking seeds in warm oil.",
      "Sauté garlic and onion in annatto oil, add oxtail and broth.",
      "Stir in peanut butter and toasted rice flour until thick.",
      "Blanch vegetables separately and arrange on top. Serve with bagoong.",
    ],
  },
  {
    id: "pinakbet",
    name: "Pinakbet",
    tagline: "Ilocano vegetable medley",
    description: "Squash, eggplant, okra, ampalaya and string beans stewed with shrimp paste.",
    region: "Ilocos",
    image: pinakbet,
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 25,
    difficulty: "Medium",
    featured: true,
    popularity: 84,
    ingredients: [
      { name: "Kalabasa (squash)", quantity: 0.5, unit: "kg", pricePerUnit: 50 },
      { name: "Eggplant", quantity: 2, unit: "pc", pricePerUnit: 15 },
      { name: "Okra", quantity: 8, unit: "pc", pricePerUnit: 3 },
      { name: "Ampalaya", quantity: 1, unit: "pc", pricePerUnit: 30 },
      { name: "String beans", quantity: 1, unit: "bundle", pricePerUnit: 25 },
      { name: "Pork belly", quantity: 0.25, unit: "kg", pricePerUnit: 340 },
      { name: "Bagoong", quantity: 3, unit: "tbsp", pricePerUnit: 5 },
      { name: "Tomatoes", quantity: 2, unit: "pc", pricePerUnit: 8 },
    ],
    steps: [
      "Render pork belly until crispy and golden.",
      "Sauté garlic, onion and tomatoes in the pork fat.",
      "Add bagoong and a little water; bring to a simmer.",
      "Add squash first, then the remaining vegetables.",
      "Cover and cook until just tender—avoid over-stirring.",
    ],
  },
  {
    id: "pancit-canton",
    name: "Pancit Canton",
    tagline: "Birthday noodles for long life",
    description: "Stir-fried egg noodles with shrimp, pork and colorful vegetables, finished with calamansi.",
    region: "Nationwide",
    image: pancit,
    servings: 6,
    prepMinutes: 20,
    cookMinutes: 20,
    difficulty: "Medium",
    popularity: 90,
    ingredients: [
      { name: "Canton noodles", quantity: 0.5, unit: "kg", pricePerUnit: 120 },
      { name: "Shrimp", quantity: 0.25, unit: "kg", pricePerUnit: 400 },
      { name: "Pork strips", quantity: 0.25, unit: "kg", pricePerUnit: 320 },
      { name: "Cabbage", quantity: 0.5, unit: "pc", pricePerUnit: 50 },
      { name: "Carrots", quantity: 1, unit: "pc", pricePerUnit: 15 },
      { name: "Soy sauce", quantity: 0.25, unit: "cup", pricePerUnit: 20 },
      { name: "Calamansi", quantity: 6, unit: "pc", pricePerUnit: 2 },
    ],
    steps: [
      "Sauté garlic and onion, then cook pork until browned.",
      "Add shrimp and cook until pink; set aside half for topping.",
      "Add vegetables and stir-fry briefly.",
      "Pour broth and soy sauce, then add noodles and toss until absorbed.",
      "Top with reserved shrimp and serve with calamansi.",
    ],
  },
  {
    id: "leche-flan",
    name: "Leche Flan",
    tagline: "Silky caramel custard",
    description: "A rich, smooth custard of egg yolks and milk under a layer of amber caramel.",
    region: "Nationwide",
    image: lecheFlan,
    servings: 8,
    prepMinutes: 15,
    cookMinutes: 50,
    difficulty: "Medium",
    popularity: 86,
    ingredients: [
      { name: "Egg yolks", quantity: 10, unit: "pc", pricePerUnit: 9 },
      { name: "Condensed milk", quantity: 1, unit: "can", pricePerUnit: 65 },
      { name: "Evaporated milk", quantity: 1, unit: "can", pricePerUnit: 45 },
      { name: "White sugar", quantity: 0.5, unit: "cup", pricePerUnit: 25 },
      { name: "Vanilla extract", quantity: 1, unit: "tsp", pricePerUnit: 5 },
    ],
    steps: [
      "Caramelize sugar in the llanera until amber; let it set.",
      "Gently mix egg yolks, condensed milk, evaporated milk and vanilla.",
      "Strain the mixture twice into the llanera.",
      "Cover with foil and steam on low heat for 40–50 minutes.",
      "Chill, then invert onto a plate to serve.",
    ],
  },
];
