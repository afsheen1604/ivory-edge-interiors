import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database.types";

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export interface SubmitReviewInput {
  reviewerName: string;
  rating: number;
  reviewText: string;
  projectId?: string | null;
}

/**
 * Submits a new review from a visitor. Reviews appear immediately.
 */
export async function submitReview(input: SubmitReviewInput): Promise<void> {
  const payload: ReviewInsert = {
    reviewer_name: input.reviewerName,
    rating: input.rating,
    review_text: input.reviewText,
    project_id: input.projectId ?? null,
  };

  const { error } = await supabase.from("reviews").insert([payload]);

  if (error) {
    throw new Error(`Failed to submit review: ${error.message}`);
  }
}

/** All reviews for public display, most recent first. */
export async function getApprovedReviews(limit?: number): Promise<Review[]> {
  let query = supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load reviews: ${error.message}`);
  }

  return data;
}

/** Reviews for a specific project, most recent first. */
export async function getApprovedReviewsForProject(projectId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load reviews for this project: ${error.message}`);
  }

  return data;
}

/** Average rating across all reviews. */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/** Admin: Add or update admin reply on a review */
export async function addAdminReply(reviewId: string, reply: string) {
  const { error } = await supabase
    .from("reviews")
    .update({
      admin_reply: reply,
      replied_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) throw error;
}

/** Admin: Delete a review */
export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
}
