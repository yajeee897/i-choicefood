import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChefHat } from "lucide-react";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipe Book" },
  { to: "/categories", label: "Categories" },
  { to: "/cost-calculator", label: "Cost Calculator" },
  { to: "/cooking-simulator", label: "Cooking Simulator" },
  { to: "/my-recipes", label: "My Recipes" },
  { to: "/favorites", label: "Favorites" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <ChefHat className="h-5 w-5" />
      </span>
      <span className="font-display text-xl font-semibold leading-none">
        I-ChoiceFood <span className="text-secondary">2.0</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const linkCls =
    "rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground";
  const activeCls = "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground";
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          className="rounded-full p-2 hover:bg-muted xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="fade-up grid gap-1 border-t px-4 py-3 xl:hidden">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={linkCls}
              activeProps={{ className: activeCls }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-cocoa text-cream">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2">
        <div>
          <p className="font-display text-xl">I-ChoiceFood 2.0</p>
          <p className="mt-2 max-w-sm text-sm opacity-80">
            A Filipino recipe book and food costing companion — cook with heart, budget with confidence.
          </p>
        </div>
        <p className="text-sm opacity-70 sm:text-right">Sample prices in PHP for planning only. © 2026</p>
      </div>
    </footer>
  );
}
