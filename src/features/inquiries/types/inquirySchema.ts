import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  message: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(2000, "Message is too long"),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
