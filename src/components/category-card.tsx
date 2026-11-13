import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/food-filters";
import { FoodImage } from "@/components/food-image";
import { getFoodsInCategory } from "@/lib/recipe-service";

export function CategoryCard({ category, cover, className = "aspect-[4/5]" }: { category: Category; cover?: string | undefined; className?: string }) {
  const count = getFoodsInCategory(category.id).length;
  return (
    <Link
      to="/recipes"
      search={{ category: category.id }}
      className={`card-hover group relative block overflow-hidden rounded-3xl shadow-soft ${className}`}
    >
      <FoodImage src={cover} name="" className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa/90 via-cocoa/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{category.tagalog}</p>
        <h3 className="text-xl font-semibold leading-tight">{category.name}</h3>
        <p className="mt-1 text-sm opacity-80">{count} dish{count === 1 ? "" : "es"}</p>
      </div>
    </Link>
  );
}
