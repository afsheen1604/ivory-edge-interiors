import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  category: z.enum([
    "residential_interiors",
    "commercial_interiors",
    "turnkey_solutions",
    "space_planning",
    "furniture_decor_styling",
  ]),
  location: z.string().optional().nullable(),
  completion_date: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
