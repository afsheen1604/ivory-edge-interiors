import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { SeoHead } from "@/components/common/SeoHead";
import { ContactForm } from "@/features/inquiries/components/ContactForm";

const CONTACT = {
  phone: import.meta.env.VITE_CONTACT_PHONE,
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP,
  email: import.meta.env.VITE_CONTACT_EMAIL,
};

export function ContactPage() {
  return (
    <>
      <SeoHead
        title="Contact"
        description="Get in touch with Ivory Edge Interiors for a free consultation on your residential or commercial interior design project."
      />

      <div className="bg-ivory-50 py-16 sm:py-20">
        <div className="container text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">Get In Touch</p>
          <h1 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-xl font-body text-muted-foreground">
            Tell us about your project and we'll get back to you with a free consultation.
          </p>
        </div>
      </div>

      <div className="container py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <ContactForm />

          <div className="space-y-6">
            <a
              href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-gold-300">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-base text-charcoal">Call Us</p>
                <p className="mt-0.5 font-body text-sm text-muted-foreground">{CONTACT.phone}</p>
              </div>
            </a>

            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-gold-300">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-base text-charcoal">WhatsApp</p>
                <p className="mt-0.5 font-body text-sm text-muted-foreground">{CONTACT.whatsapp}</p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-gold-300">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-base text-charcoal">Email</p>
                <p className="mt-0.5 font-body text-sm text-muted-foreground">{CONTACT.email}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-gold-300">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-base text-charcoal">Studio</p>
                <p className="mt-0.5 font-body text-sm text-muted-foreground">
                  Hyderabad, Telangana, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
