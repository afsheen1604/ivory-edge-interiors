import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ContactCtaSection() {
  return (
    <section className="bg-gold-300 py-16 sm:py-20">
      <div className="container flex flex-col items-center text-center">
        <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
          Ready to Transform Your Space?
        </h2>
        <p className="mt-3 max-w-xl font-body text-charcoal-200">
          Tell us about your project and we'll get back to you with a free consultation.
        </p>
        <Button variant="default" size="lg" asChild className="mt-8">
          <NavLink to="/contact">Get Free Consultation</NavLink>
        </Button>
      </div>
    </section>
  );
}
