import { useState } from "react";
import { Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAllReviews, useAddAdminReply, useDeleteReview } from "@/features/admin/hooks/usePendingReviews";
import type { ReviewRow } from "@/features/admin/services/adminService";

export function ReviewsPage() {
  const { data: reviews, isLoading, isError } = useAllReviews();
  const addReply = useAddAdminReply();
  const deleteReview = useDeleteReview();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview.mutateAsync(reviewId);
      toast.success("Review deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete review");
    }
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    try {
      await addReply.mutateAsync({
        reviewId,
        reply: replyText,
      });
      toast.success("Reply added");
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add reply");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl text-charcoal">Reviews</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl text-charcoal">Reviews</h1>
        <EmptyState icon={AlertCircle} title="Error" description="Failed to load reviews. Please try again." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Reviews</h1>
        <p className="mt-1 font-body text-sm text-muted-foreground">
          {reviews && reviews.length > 0
            ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}`
            : "No reviews"}
        </p>
      </div>

      {!reviews || reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No reviews yet" description="Reviews will appear here as they are submitted." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={() => handleDelete(review.id)}
              onReply={() => setReplyingTo(review.id)}
              isReplying={replyingTo === review.id}
              replyText={replyText}
              onReplyTextChange={setReplyText}
              onSubmitReply={() => handleSubmitReply(review.id)}
              isLoadingReply={addReply.isPending}
              isLoadingDelete={deleteReview.isPending}
              onCancelReply={() => {
                setReplyingTo(null);
                setReplyText("");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewRow;
  onDelete: () => void;
  onReply: () => void;
  isReplying: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isLoadingReply: boolean;
  isLoadingDelete: boolean;
}

function ReviewCard({
  review,
  onDelete,
  onReply,
  isReplying,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
  isLoadingReply,
  isLoadingDelete,
}: ReviewCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg text-charcoal">{review.reviewer_name}</h3>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "bg-gold-400" : "bg-gray-300"
                  } rounded-sm`}
                />
              ))}
            </div>
          </div>
          {review.project_id && (
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Project-specific review
            </p>
          )}
          <p className="mt-1 font-body text-sm text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="mb-4 font-body text-charcoal">{review.review_text}</p>

      {review.admin_reply && (
        <div className="mb-4 border-l-4 border-gold-400 bg-gold-50 p-3">
          <p className="font-body text-sm font-semibold text-charcoal">Your Reply</p>
          <p className="mt-1 font-body text-sm text-charcoal">{review.admin_reply}</p>
        </div>
      )}

      {isReplying && (
        <div className="mb-4 space-y-2">
          <Textarea
            placeholder="Add a response to this review…"
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            className="min-h-24"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="gold"
              onClick={onSubmitReply}
              disabled={isLoadingReply || !replyText.trim()}
            >
              Post Reply
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelReply}
              disabled={isLoadingReply}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onReply}
          disabled={isReplying}
        >
          <MessageSquare className="h-4 w-4" />
          Reply
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          disabled={isLoadingDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
