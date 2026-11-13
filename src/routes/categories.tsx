import { createFileRoute } from "@tanstack/react-router";
import { CategoryCard } from "@/components/category-card";
import { PageHeader } from "@/components/recipe-card";
import { getCategoryCovers, getFoodCategories } from "@/lib/recipe-service";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — I-ChoiceFood 2.0" },
      { name: "description", content: "Filipino recipes by category: main dishes, soups, noodles, street food, kakanin, desserts, breakfast and regional specialties." },
      { property: "og:title", content: "Categories — I-ChoiceFood 2.0" },
      { property: "og:description", content: "Browse Filipino recipes by category." },
    ],
  }),
  component: () => {
    const covers = getCategoryCovers();
    return (
    <div>
      <PageHeader title="Categories" subtitle="From hearty ulam to sweet panghimagas — pick a craving." />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-3">
        {getFoodCategories().map((c) => (
          <div key={c.id}>
            <CategoryCard category={c} cover={covers[c.id]} />
            <p className="mt-2 px-1 text-sm text-muted-foreground">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
    );
  },
});
