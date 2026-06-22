import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inquirySchema, type InquiryFormValues } from "@/features/inquiries/types/inquirySchema";
import { submitInquiry } from "@/features/inquiries/services/inquiriesService";

interface NavigationState {
  projectId?: string;
  projectTitle?: string;
  serviceId?: string;
  serviceTitle?: string;
}

/**
 * Contact form, per the brief: Name, Phone, Email, Message. If the visitor
 * arrived via a project's "Inquire About This Project" or a service's
 * "Inquire About This Service" CTA, that context is shown and the
 * submission is tagged accordingly (source + project_id/service_id) so the
 * admin's Inquiry Management page can see what prompted the inquiry.
 */
export function ContactForm() {
  const location = useLocation();
  const navState = location.state as NavigationState | null;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  async function onSubmit(values: InquiryFormValues) {
    try {
      await submitInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        source: navState?.projectId ? "project_cta" : navState?.serviceId ? "service_cta" : "contact_page",
        projectId: navState?.projectId,
        serviceId: navState?.serviceId,
      });
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit your message");
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-gold-200 bg-gold-50 px-6 py-10 text-center">
        <p className="font-display text-xl text-charcoal">Thank you for reaching out</p>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          We've received your message and will get back to you shortly.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setIsSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  const contextLabel = navState?.projectTitle ?? navState?.serviceTitle;

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="rounded-lg border border-border bg-card p-7"
      noValidate
    >
      <h2 className="font-display text-xl text-charcoal">Get Free Consultation</h2>
      {contextLabel && (
        <p className="mt-1.5 font-body text-sm text-muted-foreground">
          Regarding: <span className="text-charcoal">{contextLabel}</span>
        </p>
      )}

      <div className="mt-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 00000 00000"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Tell us about your space and what you're looking for…"
            aria-invalid={Boolean(errors.message)}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-xs text-destructive" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
}
