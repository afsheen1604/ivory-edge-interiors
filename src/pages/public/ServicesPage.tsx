import { NavLink } from "react-router-dom";
import { Wrench, ImageOff } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { useActiveServices } from "@/features/services/hooks/useActiveServices";

/**
 * Services page — full detail view of every active service, per the brief:
 * image, title, description, and an inquiry CTA for each. Distinct from the
 * Home page's "Services Overview" section, which shows a lighter-weight
 * preview grid linking back here.
 */
export function ServicesPage() {
  const { data: services, isLoading, isError } = useActiveServices();

  return (
    <>
      <SeoHead
        title="Services"
        description="Residential Interiors, Commercial Interiors, Turnkey Solutions, Space Planning, and Furniture & Decor Styling by Ivory Edge Interiors."
      />

      <div className="bg-ivory-50 py-16 sm:py-20">
        <div className="container text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">What We Do</p>
          <h1 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Our Services</h1>
          <p className="mx-auto mt-3 max-w-xl font-body text-muted-foreground">
            From a single room to a full turnkey build, every service is shaped around how you
            actually live and work.
          </p>
        </div>
      </div>

      <div className="container py-12 sm:py-16">
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <EmptyState
            icon={Wrench}
            title="Couldn't load services right now"
            description="Please refresh the page, or check back shortly."
          />
        )}

        {!isLoading && !isError && services && services.length === 0 && (
          <EmptyState
            icon={Wrench}
            title="Services coming soon"
            description="Our service offerings will appear here once published by the admin."
          />
        )}

        {!isLoading && !isError && services && services.length > 0 && (
          <div className="grid gap-10 sm:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="aspect-[16/10] overflow-hidden bg-ivory-200">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gold-300">
                      <ImageOff className="h-9 w-9" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="font-display text-xl text-charcoal">{service.title}</h2>
                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <Button variant="outline" size="default" asChild className="mt-6 w-fit">
                    <NavLink
                      to="/contact"
                      state={{ serviceId: service.id, serviceTitle: service.title }}
                    >
                      Inquire About This Service
                    </NavLink>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
