import { NavLink } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { Button } from "@/components/ui/button";
import { WhyChooseUsSection } from "@/features/content/components/WhyChooseUsSection";

/**
 * About Us page — per the brief: Company Story, Mission, Vision, Founder
 * Section, Why Choose Us. The founder details and company description
 * here are placeholder copy reflecting the brief's brand statement; an
 * admin Content Management page (Phase 6+) will make this editable rather
 * than hardcoded.
 */
export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Us"
        description="Ivory Edge Interiors is a modern interior design company founded by Shaik Riyaz Ahmed, specializing in residential and commercial spaces."
      />

      <div className="bg-ivory-50 py-16 sm:py-20">
        <div className="container text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
            Our Story
          </p>
          <h1 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
            About Ivory Edge Interiors
          </h1>
        </div>
      </div>

      {/* Company story */}
      <section className="container py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl leading-snug text-charcoal">
            Where elegance meets comfort, and every space tells a story.
          </p>
          <p className="mt-6 font-body leading-relaxed text-body">
            Ivory Edge Interiors is a modern interior design company specializing in residential
            and commercial spaces. We create elegant, functional, and personalized interiors
            tailored to our clients&rsquo; lifestyles and business needs — believing that good
            design should feel like it was always meant to be there.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ivory-50 py-16 sm:py-20">
        <div className="container grid gap-10 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-gold-300">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-xl text-charcoal">Our Mission</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
              To craft interiors that balance beauty and everyday function — designing spaces our
              clients genuinely live well in, not just photograph well.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-gold-300">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-xl text-charcoal">Our Vision</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
              To be Hyderabad&rsquo;s most trusted name in personalized interior design — known
              for thoughtful execution as much as elegant style.
            </p>
          </div>
        </div>
      </section>

      {/* Founder section */}
      <section className="container py-16 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-3xl text-gold-300">
            SR
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
              Founder &amp; Principal Interior Designer
            </p>
            <h2 className="mt-2 font-display text-2xl text-charcoal">Shaik Riyaz Ahmed</h2>
            <p className="mt-4 font-body leading-relaxed text-muted-foreground">
              With a hands-on approach to every project, Shaik leads Ivory Edge Interiors with a
              belief that great design starts with truly listening to how a client lives or works.
              That philosophy shapes every residential and commercial interior the studio
              delivers — elegant, considered, and built around the people who'll actually use the
              space.
            </p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <WhyChooseUsSection />

      {/* Closing CTA */}
      <section className="bg-gold-300 py-16 sm:py-20">
        <div className="container flex flex-col items-center text-center">
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">
            Let's Design Your Next Space
          </h2>
          <Button variant="default" size="lg" asChild className="mt-8">
            <NavLink to="/contact">Get Free Consultation</NavLink>
          </Button>
        </div>
      </section>
    </>
  );
}
