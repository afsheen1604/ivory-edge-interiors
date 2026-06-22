import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingPicker } from "@/features/reviews/components/StarRatingPicker";
import {
  reviewSubmissionSchema,
  type ReviewSubmissionValues,
} from "@/features/reviews/types/reviewSubmissionSchema";
import { submitReview } from "@/features/reviews/services/reviewsService";

interface NavigationState {
  projectId?: string;
  projectTitle?: string;
}

/**
 * Review submission form, per the brief: Name, Rating, Review, Project
 * (optional). If the visitor arrived via a "Leave a Review" link from a
 * specific Project Details page, that project is pre-filled and shown as
 * read-only context rather than a picker — submitting a general review vs.
 * a project-scoped review from the Project Details page covers the
 * "Project (optional)" field without needing a full project dropdown here.
 */
export function ReviewSubmissionForm() {
  const location = useLocation();
  const navState = location.state as NavigationState | null;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewSubmissionValues>({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      reviewerName: "",
      rating: 0,
      reviewText: "",
      projectId: navState?.projectId,
    },
  });

  async function onSubmit(values: ReviewSubmissionValues) {
    try {
      await submitReview({
        reviewerName: values.reviewerName,
        rating: values.rating,
        reviewText: values.reviewText,
        projectId: values.projectId,
      });
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-gold-200 bg-gold-50 px-6 py-8 text-center">
        <p className="font-display text-lg text-charcoal">Thank you for your review</p>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          Your review has been submitted and will appear once approved by our team.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setIsSubmitted(false)}>
          Submit another review
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="rounded-lg border border-border bg-card p-7"
      noValidate
    >
      <h2 className="font-display text-xl text-charcoal">Share Your Experience</h2>

      {navState?.projectTitle && (
        <p className="mt-1.5 font-body text-sm text-muted-foreground">
          Reviewing: <span className="text-charcoal">{navState.projectTitle}</span>
        </p>
      )}

      <div className="mt-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="reviewerName">Name</Label>
          <Input
            id="reviewerName"
            placeholder="Your name"
            aria-invalid={Boolean(errors.reviewerName)}
            {...register("reviewerName")}
          />
          {errors.reviewerName && (
            <p className="text-xs text-destructive" role="alert">
              {errors.reviewerName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Rating</Label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRatingPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && (
            <p className="text-xs text-destructive" role="alert">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reviewText">Review</Label>
          <Textarea
            id="reviewText"
            placeholder="Tell us about your experience working with Ivory Edge Interiors…"
            aria-invalid={Boolean(errors.reviewText)}
            {...register("reviewText")}
          />
          {errors.reviewText && (
            <p className="text-xs text-destructive" role="alert">
              {errors.reviewText.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
}
