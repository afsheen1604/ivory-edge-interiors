import type { Database } from "@/types/database.types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectImage = Database["public"]["Tables"]["project_images"]["Row"];
export type ProjectVideo = Database["public"]["Tables"]["project_videos"]["Row"];

export type ProjectWithCover = Pick<
  Project,
  "id" | "title" | "slug" | "category" | "cover_image_url" | "location" | "is_featured"
>;

export const PROJECT_CATEGORY_LABELS: Record<Project["category"], string> = {
  residential_interiors: "Residential Interiors",
  commercial_interiors: "Commercial Interiors",
  turnkey_solutions: "Turnkey Solutions",
  space_planning: "Space Planning",
  furniture_decor_styling: "Furniture & Decor Styling",
};
