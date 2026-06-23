import { z } from "zod";

export const reviewSubmissionSchema = z.object({
  reviewerName: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5),
  reviewText: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(2000, "Review is too long"),
  projectId: z.string().optional(),
});

export type ReviewSubmissionValues = z.infer<typeof reviewSubmissionSchema>;
