import { format } from "date-fns";
import type { Review } from "@/features/reviews/services/reviewsService";
import { StarRating } from "@/features/reviews/components/StarRating";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
      <StarRating rating={review.rating} />
      <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-charcoal">
        “{review.review_text}”
      </p>
      <div className="mt-5 flex items-center justify-between">
        <p className="font-display text-sm text-charcoal">{review.reviewer_name}</p>
        <p className="font-body text-xs text-muted-foreground">
          {format(new Date(review.created_at), "MMM yyyy")}
        </p>
      </div>
      {review.admin_reply && (
        <div className="mt-4 rounded-md bg-ivory-100 px-4 py-3">
          <p className="font-body text-xs font-medium text-gold-400">
            Response from Ivory Edge Interiors
          </p>
          <p className="mt-1 font-body text-sm text-muted-foreground">{review.admin_reply}</p>
        </div>
      )}
    </div>
  );
}
