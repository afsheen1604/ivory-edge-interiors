import { NavLink } from "react-router-dom";
import { Sparkles, Building2, KeyRound, Ruler, Sofa, Wrench } from "lucide-react";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useActiveServices } from "@/features/services/hooks/useActiveServices";

// Icon fallback per known service slug — used only until the admin uploads
// a real service image; once `image_url` is set, the image takes over.
const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  "residential-interiors": Sofa,
  "commercial-interiors": Building2,
  "turnkey-solutions": KeyRound,
  "space-planning": Ruler,
  "furniture-decor-styling": Sparkles,
};

export function ServicesOverviewSection() {
  const { data: services, isLoading, isError } = useActiveServices();

  return (
    <section className="bg-ivory-50 py-20 sm:py-28">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">What We Do</p>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
            Services Overview
          </h2>
          <p className="mt-3 max-w-xl font-body text-muted-foreground">
            From a single room to a full turnkey build, every project is shaped around how you
            actually live and work.
          </p>
        </div>

        <div className="mt-12">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = SERVICE_ICONS[service.slug] ?? Sparkles;
                return (
                  <NavLink
                    key={service.id}
                    to="/services"
                    className="group rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
                  >
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt=""
                        className="mb-4 h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-gold-50 text-gold-400">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                    )}
                    <h3 className="font-display text-lg text-charcoal">{service.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
