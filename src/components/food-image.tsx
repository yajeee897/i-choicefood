import { useEffect, useRef, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

/** Dish photo with a styled fallback when the photo is missing or fails to load. */
export function FoodImage({
  src, name, className = "", eager = false,
}: { src?: string | undefined; name: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
    // Catch photos that failed before the page became interactive.
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${name} (photo coming soon)`}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted via-card to-accent/40 p-4 text-center ${className}`}
      >
        <UtensilsCrossed className="h-8 w-8 text-secondary" />
        <span className="font-display text-lg font-semibold leading-tight text-foreground/80">{name}</span>
        <span className="text-xs text-muted-foreground">Photo coming soon</span>
      </div>
    );
  }
  return (
    <img
      ref={ref}
      src={src}
      alt={name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      width={944}
      height={704}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
