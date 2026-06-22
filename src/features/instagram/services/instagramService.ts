import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database.types";

export type InstagramPost = Database["public"]["Tables"]["instagram_posts"]["Row"];

/** Active Instagram posts/reels, in admin-controlled display order. */
export async function getActiveInstagramPosts(limit?: number): Promise<InstagramPost[]> {
  let query = supabase
    .from("instagram_posts")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load Instagram posts: ${error.message}`);
  }

  return data;
}
