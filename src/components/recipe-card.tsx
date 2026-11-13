import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";

export function FavoriteButton({ id, className = "" }: { id: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
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

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="fade-up mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6">
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
