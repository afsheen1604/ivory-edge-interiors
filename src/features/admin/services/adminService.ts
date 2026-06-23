import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database.types";

export type DashboardCounts = {
  projects: number;
  reviews: number;
  inquiries: number;
  instagramPosts: number;
};

export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type InquiryRow = Database['public']['Tables']['inquiries']['Row'];

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const [pRes, rRes, iRes, igRes] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('instagram_posts').select('*', { count: 'exact', head: true }),
  ]);

  return {
    projects: pRes.count ?? 0,
    reviews: rRes.count ?? 0,
    inquiries: iRes.count ?? 0,
    instagramPosts: igRes.count ?? 0,
  };
}

export async function getRecentReviews(limit = 6) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ReviewRow[];
}

export async function getRecentInquiries(limit = 6) {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as InquiryRow[];
}

/** Admin: Fetch all reviews for management */
export async function getAllReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ReviewRow[];
}

/** Admin: Add or update admin reply on a review */
export async function addAdminReply(reviewId: string, reply: string) {
  const { error } = await supabase
    .from('reviews')
    .update({
      admin_reply: reply,
      replied_at: new Date().toISOString(),
    })
    .eq('id', reviewId);

  if (error) throw error;
}

/** Admin: Delete a review */
export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
}
