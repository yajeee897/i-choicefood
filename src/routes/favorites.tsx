import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/recipe-card";
import { FoodCard } from "@/components/food-card";
import { useFavorites } from "@/lib/favorites";
import { getFoods } from "@/lib/recipe-service";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — I-ChoiceFood 2.0" },
      { name: "description", content: "Your favorite Filipino recipes in one place." },
      { property: "og:title", content: "Favorites — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Your favorite Filipino recipes." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { ids } = useFavorites();
  const list = getFoods().filter((f) => ids.includes(f.id));
  return (
    <div>
      <PageHeader title="Favorites" subtitle="Tap the heart on any recipe to add it here. Favorites last for this visit only." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((f) => <FoodCard key={f.id} food={f} />)}</div>
        ) : (
          <div className="rounded-3xl border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No favorites yet.</p>
            <Link to="/recipes" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Browse recipes</Link>
          </div>
        )}
      </div>
    </div>
  );
}
