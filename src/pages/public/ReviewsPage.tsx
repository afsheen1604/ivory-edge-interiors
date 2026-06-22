import { MessageSquareQuote } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import { StarRating } from "@/features/reviews/components/StarRating";
import { ReviewSubmissionForm } from "@/features/reviews/components/ReviewSubmissionForm";
import { useApprovedReviews } from "@/features/reviews/hooks/useApprovedReviews";
import { calculateAverageRating } from "@/features/reviews/services/reviewsService";

export function ReviewsPage() {
  const { data: reviews, isLoading, isError } = useApprovedReviews();
  const averageRating = reviews ? calculateAverageRating(reviews) : 0;

  return (
    <>
      <SeoHead
        title="Reviews"
        description="Read what clients say about working with Ivory Edge Interiors, and share your own experience."
      />

      <div className="bg-ivory-50 py-16 sm:py-20">
        <div className="container text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">
            Client Reviews
          </p>
          <h1 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
            What Our Clients Say
          </h1>

          {!isLoading && reviews && reviews.length > 0 && (
            <div className="mt-5 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="font-display text-2xl text-charcoal">{averageRating}</span>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full" />
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <EmptyState
                icon={MessageSquareQuote}
                title="Couldn't load reviews right now"
                description="Please refresh the page, or check back shortly."
              />
            )}

            {!isLoading && !isError && reviews && reviews.length === 0 && (
              <EmptyState
                icon={MessageSquareQuote}
                title="Be the first to leave a review"
                description="Client reviews will appear here once submitted and approved."
              />
            )}

            {!isLoading && !isError && reviews && reviews.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          <div>
            <ReviewSubmissionForm />
          </div>
        </div>
      </div>
    </>
  );
}
