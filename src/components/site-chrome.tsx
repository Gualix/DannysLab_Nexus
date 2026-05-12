import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Beaker } from "lucide-react";

export function SiteHeader() {
  const { user, isStaff } = useAuth();
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground elevation-1 group-hover:elevation-2 transition-shadow">
            <Beaker className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Danny's Lab</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">Makerspace Hub</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {isStaff ? (
            <Link to="/admin" className="rounded-full px-4 py-2 text-foreground/80 hover:bg-muted state-layer">
              Admin
            </Link>
          ) : user ? (
            <Link to="/admin" className="rounded-full px-4 py-2 text-foreground/80 hover:bg-muted state-layer">
              Account
            </Link>
          ) : (
            <Link to="/login" className="rounded-full px-4 py-2 text-foreground/80 hover:bg-muted state-layer">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-mirage text-wildsand mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold">Danny's Lab</p>
          <p className="mt-2 text-sm text-wildsand/70">
            A high-tech makerspace for builders, students, and educators.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-wildsand/60">Contact</p>
          <p className="mt-2 text-sm">stem-costarica@akamai.com</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-wildsand/60">Notice</p>
          <p className="mt-2 text-sm text-wildsand/80">
            Requests are reviewed every Wednesday. Submit at least 15 days in advance.
          </p>
        </div>
      </div>
    </footer>
  );
}
