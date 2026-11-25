import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChefHat, History, UserCheck, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

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
  const { user, displayName, loading } = useAuth();

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

        {/* User Auth controls */}
        <div className="hidden items-center gap-2 xl:flex">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/cooking-history"
                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                <History className="h-3.5 w-3.5" /> History
              </Link>
              <Link
                to="/account"
                className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <UserCheck className="h-3.5 w-3.5" /> {displayName}
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </Link>
          )}
        </div>

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
          <div className="mt-2 border-t pt-2">
            {user ? (
              <div className="grid gap-1">
                <Link
                  to="/cooking-history"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
                >
                  <History className="h-4 w-4" /> Cooking History
                </Link>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
                >
                  <UserCheck className="h-4 w-4" /> Account ({displayName})
                </Link>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
              >
                <LogIn className="h-4 w-4" /> Sign In / Sign Up
              </Link>
            )}
          </div>
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
