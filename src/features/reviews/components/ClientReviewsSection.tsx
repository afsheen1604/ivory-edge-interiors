import { NavLink } from "react-router-dom";
import { MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import { StarRating } from "@/features/reviews/components/StarRating";
import { useApprovedReviews } from "@/features/reviews/hooks/useApprovedReviews";
import { calculateAverageRating } from "@/features/reviews/services/reviewsService";

export function ClientReviewsSection() {
  const { data: reviews, isLoading, isError } = useApprovedReviews(3);
  const averageRating = reviews ? calculateAverageRating(reviews) : 0;

  return (
    <section className="bg-charcoal py-20 sm:py-28">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-300">
            Client Reviews
          </p>
          <h2 className="mt-3 font-display text-3xl text-ivory-100 sm:text-4xl">
            What Our Clients Say
          </h2>
          {!isLoading && reviews && reviews.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <StarRating rating={averageRating} />
              <span className="font-body text-sm text-ivory-300">
                {averageRating} average rating
              </span>
            </div>
          )}
        </div>

        <div className="mt-12">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full bg-ivory-200/10" />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <EmptyState
              icon={MessageSquareQuote}
              title="Couldn't load reviews right now"
              description="Please refresh the page, or check back shortly."
              className="border-ivory-200/20 bg-transparent"
            />
          )}

          {!isLoading && !isError && reviews && reviews.length === 0 && (
            <EmptyState
              icon={MessageSquareQuote}
              title="Be the first to leave a review"
              description="Client reviews will appear here once submitted and approved."
              className="border-ivory-200/20 bg-transparent"
            />
          )}

          {!isLoading && !isError && reviews && reviews.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-ivory-200/40 text-ivory-100 hover:bg-ivory-100/10"
          >
            <NavLink to="/reviews">Read All Reviews</NavLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
