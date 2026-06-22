import { useParams, NavLink } from "react-router-dom";
import { MapPin, Calendar, ImageOff, Frame, MessageSquareQuote } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { PROJECT_CATEGORY_LABELS } from "@/features/projects/types/project";
import { useProjectDetail, useRelatedProjects } from "@/features/projects/hooks/useProjectDetail";
import { ImageGallery } from "@/features/projects/components/ImageGallery";
import { BeforeAfterGallery } from "@/features/projects/components/BeforeAfterGallery";
import { VideoGallery } from "@/features/projects/components/VideoGallery";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import { StarRating } from "@/features/reviews/components/StarRating";
import { useProjectReviews } from "@/features/reviews/hooks/useProjectReviews";
import { calculateAverageRating } from "@/features/reviews/services/reviewsService";

function ProjectDetailsSkeleton() {
  return (
    <div className="container py-12">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-4 h-10 w-2/3" />
      <Skeleton className="mt-8 aspect-[16/9] w-full" />
    </div>
  );
}

export function ProjectDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProjectDetail(slug);
  const { data: relatedProjects } = useRelatedProjects(project?.category, project?.id);
  const { data: reviews, isLoading: reviewsLoading } = useProjectReviews(project?.id);

  const averageRating = reviews ? calculateAverageRating(reviews) : 0;

  const galleryImages = project?.project_images.filter((img) => img.image_type === "gallery") ?? [];
  const beforeAfterImages =
    project?.project_images.filter((img) => img.image_type !== "gallery") ?? [];

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="container py-20">
        <EmptyState
          icon={Frame}
          title="Couldn't load this project"
          description="Please refresh the page, or check back shortly."
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-20">
        <EmptyState
          icon={Frame}
          title="Project not found"
          description="This project may have been moved, unpublished, or the link is incorrect."
        />
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <NavLink to="/projects">Browse All Projects</NavLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={project.title}
        description={project.description.slice(0, 155)}
      />

      {/* Cover image */}
      <div className="aspect-[16/7] w-full overflow-hidden bg-charcoal sm:aspect-[16/6]">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold-300">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="container py-10 sm:py-14">
        {/* Project info */}
        <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
          {PROJECT_CATEGORY_LABELS[project.category]}
        </p>
        <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">{project.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-5 font-body text-sm text-muted-foreground">
          {project.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {project.location}
            </span>
          )}
          {project.completion_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Completed{" "}
              {new Date(project.completion_date).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <p className="mt-6 max-w-2xl font-body leading-relaxed text-body">{project.description}</p>

        <div className="mt-8">
          <Button variant="gold" size="lg" asChild>
            <NavLink to="/contact" state={{ projectId: project.id, projectTitle: project.title }}>
              Inquire About This Project
            </NavLink>
          </Button>
        </div>

        {/* Full image gallery */}
        {galleryImages.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl text-charcoal">Gallery</h2>
            <div className="mt-6">
              <ImageGallery images={galleryImages} />
            </div>
          </section>
        )}

        {/* Before & after */}
        {beforeAfterImages.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl text-charcoal">Before &amp; After</h2>
            <div className="mt-6">
              <BeforeAfterGallery images={beforeAfterImages} />
            </div>
          </section>
        )}

        {/* Video gallery */}
        {project.project_videos.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl text-charcoal">Videos</h2>
            <div className="mt-6">
              <VideoGallery videos={project.project_videos} />
            </div>
          </section>
        )}

        {/* Reviews for this project */}
        <section className="mt-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-charcoal">Reviews</h2>
            {!reviewsLoading && reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="font-body text-sm text-muted-foreground">
                  {averageRating} average
                </span>
              </div>
            )}
          </div>

          <div className="mt-6">
            {reviewsLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            )}

            {!reviewsLoading && reviews && reviews.length === 0 && (
              <EmptyState
                icon={MessageSquareQuote}
                title="No reviews for this project yet"
                description="Be the first to share your experience."
              />
            )}

            {!reviewsLoading && reviews && reviews.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild>
              <NavLink to="/reviews" state={{ projectId: project.id, projectTitle: project.title }}>
                Leave a Review
              </NavLink>
            </Button>
          </div>
        </section>

        {/* Related projects */}
        {relatedProjects && relatedProjects.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-2xl text-charcoal">Related Projects</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((related) => (
                <ProjectCard key={related.id} project={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
