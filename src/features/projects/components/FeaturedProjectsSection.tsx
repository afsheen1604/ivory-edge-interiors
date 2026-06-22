import { NavLink } from "react-router-dom";
import { Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { useFeaturedProjects } from "@/features/projects/hooks/useFeaturedProjects";

export function FeaturedProjectsSection() {
  const { data: projects, isLoading, isError } = useFeaturedProjects(6);

  return (
    <section className="container py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">Our Work</p>
        <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Featured Projects</h2>
        <p className="mt-3 max-w-xl font-body text-muted-foreground">
          A selection of interiors where thoughtful design meets everyday living.
        </p>
      </div>

      <div className="mt-12">
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <EmptyState
            icon={Frame}
            title="Couldn't load projects right now"
            description="Please refresh the page, or check back shortly."
          />
        )}

        {!isLoading && !isError && projects && projects.length === 0 && (
          <EmptyState
            icon={Frame}
            title="Featured projects coming soon"
            description="Our latest interior design work will appear here once published."
          />
        )}

        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
          <NavLink to="/projects">View All Projects</NavLink>
        </Button>
      </div>
    </section>
  );
}
