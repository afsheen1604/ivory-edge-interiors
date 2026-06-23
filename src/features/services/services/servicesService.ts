import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database.types";

export type Service = Database["public"]["Tables"]["services"]["Row"];

/** Active services, in admin-controlled display order, for public display. */
export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load services: ${error.message}`);
  }

  return data;
}
