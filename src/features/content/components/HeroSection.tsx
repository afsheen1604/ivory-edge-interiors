import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory-100">
      {/* Soft warm gold wash + a thin rule, signature touch — restrained,
          single use. Sits on the light body background rather than
          charcoal, so the Hero reads as distinct from the (dark) Header
          above it instead of fusing into one block. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(circle at 85% 10%, rgba(198,161,91,0.18), transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
            <p className="font-body text-xs uppercase tracking-widest2 text-gold-500">
              Residential &amp; Commercial Interior Design
            </p>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Where Elegance Meets Comfort
          </h1>
          <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-body sm:text-lg">
            Creating timeless residential and commercial interiors that blend style,
            functionality, and personalized design.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button variant="gold" size="lg" asChild>
              <NavLink to="/projects">View Projects</NavLink>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-charcoal/30 text-charcoal hover:bg-charcoal/5">
              <NavLink to="/contact">Get Free Consultation</NavLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
