import { supabase } from "@/services/supabase";
import type { Database } from "@/types/database.types";

type InquirySource = Database["public"]["Enums"]["inquiry_source"];
type InquiryInsert = Database["public"]["Tables"]["inquiries"]["Insert"];

export interface SubmitInquiryInput {
  name: string;
  email: string;
  message: string;
  phone?: string;
  source?: InquirySource;
  projectId?: string;
  serviceId?: string;
}

/**
 * Submits a new inquiry from the Contact page form, or from a project/
 * service-specific "Inquire" CTA. RLS (migration 0009) forces every new row
 * to start as status = 'new' with no admin_notes regardless of what's sent
 * here — visitors can never read inquiries back, including their own.
 */
export async function submitInquiry(input: SubmitInquiryInput): Promise<void> {
  const payload: InquiryInsert = {
    name: input.name,
    email: input.email,
    message: input.message,
    phone: input.phone || null,
    source: input.source ?? "contact_page",
    project_id: input.projectId ?? null,
    service_id: input.serviceId ?? null,
  };

  const { error } = await supabase.from("inquiries").insert([payload]);

  if (error) {
    throw new Error(`Failed to submit inquiry: ${error.message}`);
  }
}
