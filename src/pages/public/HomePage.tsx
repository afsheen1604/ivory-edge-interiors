import { SeoHead } from "@/components/common/SeoHead";
import { HeroSection } from "@/features/content/components/HeroSection";
import { FeaturedProjectsSection } from "@/features/projects/components/FeaturedProjectsSection";
import { ServicesOverviewSection } from "@/features/services/components/ServicesOverviewSection";
import { WhyChooseUsSection } from "@/features/content/components/WhyChooseUsSection";
import { ClientReviewsSection } from "@/features/reviews/components/ClientReviewsSection";
import { InstagramShowcaseSection } from "@/features/instagram/components/InstagramShowcaseSection";
import { ContactCtaSection } from "@/features/content/components/ContactCtaSection";

/**
 * Home page — assembles the 7 sections specified in the brief, in order:
 * Hero, Featured Projects, Services Overview, Why Choose Us, Client
 * Reviews, Instagram Showcase, Contact CTA. (Header/Footer come from
 * PublicLayout, the 8th/9th items in the brief's section list.)
 *
 * Every data-driven section (Featured Projects, Services, Reviews,
 * Instagram) independently handles its own loading/error/empty states —
 * see each component for details — so the page renders correctly even
 * before any content has been published by the admin.
 */
export function HomePage() {
  return (
    <>
      <SeoHead
        title="Home"
        description="Ivory Edge Interiors creates elegant, functional, and personalized residential and commercial interiors. Where elegance meets comfort, and every space tells a story."
      />
      <HeroSection />
      <FeaturedProjectsSection />
      <ServicesOverviewSection />
      <WhyChooseUsSection />
      <ClientReviewsSection />
      <InstagramShowcaseSection />
      <ContactCtaSection />
    </>
  );
}
