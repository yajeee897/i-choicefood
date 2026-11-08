import { Link } from "@tanstack/react-router";
import { Clock, Heart, Users } from "lucide-react";
import type { Recipe } from "@/data/recipes";
import { useFavorites } from "@/lib/favorites";
import { peso, totalCost } from "@/lib/recipe-service";

export function FavoriteButton({ id, className = "" }: { id: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(id);
      }}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      className={`grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-soft transition-transform hover:scale-110 ${className}`}
    >
      <Heart className={`h-5 w-5 ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
    </button>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="card-hover group block overflow-hidden rounded-3xl bg-card shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          width={944}
          height={704}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <FavoriteButton id={recipe.id} className="absolute right-3 top-3" />
        <span className="absolute bottom-3 left-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          {recipe.difficulty}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{recipe.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{recipe.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{recipe.prepMinutes + recipe.cookMinutes} min</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{recipe.servings}</span>
          <span className="font-bold text-primary">{peso(totalCost(recipe.ingredients))}</span>
        </div>
      </div>
    </Link>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="fade-up mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6">
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
