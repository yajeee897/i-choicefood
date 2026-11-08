import { createContext, useContext, useState, type ReactNode } from "react";

// Session-only favorites (cleared on refresh). Will move to the database in a later phase.
interface FavoritesCtx {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
}

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const value: FavoritesCtx = {
    ids,
    isFavorite: (id) => ids.includes(id),
    toggle: (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFavorites must be used within FavoritesProvider");
  return c;
}
