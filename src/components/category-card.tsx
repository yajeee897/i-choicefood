import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/recipes";
import { getRecipes } from "@/lib/recipe-service";

export function CategoryCard({ category }: { category: Category }) {
  const list = getRecipes().filter((r) => r.category === category.id);
  const cover = list[0]?.image;
  return (
    <Link
      to="/recipes"
      search={{ q: "", category: category.id }}
      className="card-hover group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft"
    >
      {cover && (
        <img src={cover} alt="" loading="lazy" width={944} height={704} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa/90 via-cocoa/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{category.tagalog}</p>
        <h3 className="text-xl font-semibold">{category.name}</h3>
        <p className="mt-1 text-sm opacity-80">{list.length} recipe{list.length === 1 ? "" : "s"}</p>
      </div>
    </Link>
  );
}
