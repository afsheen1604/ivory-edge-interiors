import { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-300/50 bg-charcoal-400 shadow-[0_1px_0_0_rgba(0,0,0,0.4)]">
      <div className="container flex h-16 items-center justify-between sm:h-20">
        <RouterNavLink to="/" className="flex flex-col leading-none" onClick={() => setIsMenuOpen(false)}>
          <span className="font-display text-base uppercase tracking-widest2 text-ivory-100 sm:text-lg">
            Ivory Edge Interiors
          </span>
          <span className="mt-1 hidden font-body text-[10px] uppercase tracking-widest2 text-gold-300 sm:block">
            Art of Living Stylish
          </span>
        </RouterNavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {PUBLIC_NAV_LINKS.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "font-body text-sm text-ivory-200 transition-colors hover:text-gold-300",
                  isActive && "text-gold-300",
                )
              }
            >
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="gold" size="sm" asChild>
            <RouterNavLink to="/contact">Get Free Consultation</RouterNavLink>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-ivory-100 lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile nav panel */}
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-gold-300/20 bg-charcoal px-6 py-5 lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.path}>
                <RouterNavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block font-body text-base text-ivory-200 transition-colors hover:text-gold-300",
                      isActive && "text-gold-300",
                    )
                  }
                >
                  {link.label}
                </RouterNavLink>
              </li>
            ))}
          </ul>
          <Button variant="gold" size="default" asChild className="mt-5 w-full">
            <RouterNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
              Get Free Consultation
            </RouterNavLink>
          </Button>
        </nav>
      )}
    </header>
  );
}
