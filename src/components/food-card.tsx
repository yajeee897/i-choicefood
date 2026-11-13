import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Utensils } from "lucide-react";
import { FavoriteButton } from "@/components/recipe-card";
import { FoodImage } from "@/components/food-image";
import { getCategoryName, pesoWhole, type Food } from "@/lib/recipe-service";

export function FoodCard({ food }: { food: Food }) {
  return (
    <article className="card-hover group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
      <Link to="/recipes/$recipeId" params={{ recipeId: food.id }} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1}>
        <FoodImage src={food.image} name={food.name} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute bottom-3 left-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          {getCategoryName(food.categories[0]!)}
        </span>
      </Link>
      <FavoriteButton id={food.id} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">
          <Link to="/recipes/$recipeId" params={{ recipeId: food.id }} className="hover:text-primary">{food.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{food.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Utensils className="h-3.5 w-3.5" />{food.mainIngredients.join(", ")}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{food.region}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className="text-sm">
            <span className="text-base font-bold text-primary">{pesoWhole(food.price)}</span>
            <span className="text-muted-foreground"> / serving (est.)</span>
          </p>
          <Link
            to="/recipes/$recipeId"
            params={{ recipeId: food.id }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-bold transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label={`View details for ${food.name}`}
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
