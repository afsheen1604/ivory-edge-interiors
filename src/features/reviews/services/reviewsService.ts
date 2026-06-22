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
 * Submits a new review from a visitor. RLS (migration 0008) forces every
 * new row to start as status = 'pending' regardless of what's sent here —
 * the review only becomes publicly visible once an admin approves it.
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

/** Approved reviews, most recent first, for public display. */
export async function getApprovedReviews(limit?: number): Promise<Review[]> {
  let query = supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
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

/** Approved reviews for one specific project, for the Project Details page. */
export async function getApprovedReviewsForProject(projectId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load reviews for this project: ${error.message}`);
  }

  return data;
}

/** Average rating across all approved reviews, for the overall rating display. */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
