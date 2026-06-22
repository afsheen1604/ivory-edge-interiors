import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Frame } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { CategoryFilter, type CategoryFilterValue } from "@/features/projects/components/CategoryFilter";
import { ProjectSearchInput } from "@/features/projects/components/ProjectSearchInput";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

/**
 * Projects page — grid of published projects with category filters and
 * search, per the brief. Category and search are both reflected in the URL
 * (?category=...&search=...) so a filtered view can be shared/bookmarked
 * and survives a page refresh.
 */
export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = (searchParams.get("category") as CategoryFilterValue) || "all";
  const searchParam = searchParams.get("search") ?? "";

  // Local state for the search input so it can update on every keystroke
  // without re-rendering the URL (and re-querying) until debounced.
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const { data: projects, isLoading, isError } = useProjects({
    category: categoryParam,
    search: debouncedSearch,
  });

  const activeFilterSummary = useMemo(() => {
    const parts: string[] = [];
    if (categoryParam !== "all") parts.push(categoryParam.replace(/_/g, " "));
    if (debouncedSearch) parts.push(`"${debouncedSearch}"`);
    return parts.join(" · ");
  }, [categoryParam, debouncedSearch]);

  function handleCategoryChange(category: CategoryFilterValue) {
    const next = new URLSearchParams(searchParams);
    if (category === "all") {
      next.delete("category");
    } else {
      next.set("category", category);
    }
    setSearchParams(next, { replace: true });
  }

  function handleSearchChange(search: string) {
    setSearchInput(search);
    const next = new URLSearchParams(searchParams);
    if (search.trim().length === 0) {
      next.delete("search");
    } else {
      next.set("search", search);
    }
    setSearchParams(next, { replace: true });
  }

  return (
    <>
      <SeoHead
        title="Projects"
        description="Browse residential and commercial interior design projects by Ivory Edge Interiors, filterable by category."
      />

      <div className="bg-ivory-50 py-16 sm:py-20">
        <div className="container text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">Our Work</p>
          <h1 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Projects</h1>
          <p className="mx-auto mt-3 max-w-xl font-body text-muted-foreground">
            Explore our portfolio of residential and commercial interiors, each shaped around how
            our clients actually live and work.
          </p>
        </div>
      </div>

      <div className="container py-12 sm:py-16">
        <div className="flex flex-col items-center gap-6">
          <CategoryFilter value={categoryParam} onChange={handleCategoryChange} />
          <ProjectSearchInput value={searchInput} onChange={handleSearchChange} />
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
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
              title={
                activeFilterSummary ? `No projects match ${activeFilterSummary}` : "No projects yet"
              }
              description={
                activeFilterSummary
                  ? "Try a different category or search term."
                  : "Our portfolio will appear here once projects are published."
              }
            />
          )}

          {!isLoading && !isError && projects && projects.length > 0 && (
            <>
              <p className="mb-6 font-body text-sm text-muted-foreground">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
                {activeFilterSummary && <> matching {activeFilterSummary}</>}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
