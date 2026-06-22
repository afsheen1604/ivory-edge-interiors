import { NavLink as RouterNavLink } from "react-router-dom";
import { Phone, Mail, MessageCircle, Instagram } from "lucide-react";
import { PUBLIC_NAV_LINKS } from "@/constants/navigation";

const SERVICES = [
  "Residential Interiors",
  "Commercial Interiors",
  "Turnkey Solutions",
  "Space Planning",
  "Furniture & Decor Styling",
];

const CONTACT = {
  phone: import.meta.env.VITE_CONTACT_PHONE,
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP,
  email: import.meta.env.VITE_CONTACT_EMAIL,
};

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-gold-300/20 bg-charcoal text-ivory-200">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Brand + statement */}
        <div>
          <p className="font-display text-base uppercase tracking-widest2 text-ivory-100">
            Ivory Edge Interiors
          </p>
          <p className="mt-1 font-body text-xs uppercase tracking-widest2 text-gold-300">
            Art of Living Stylish
          </p>
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ivory-300">
            Where elegance meets comfort, and every space tells a story.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-body text-sm text-ivory-200 transition-colors hover:text-gold-300"
            aria-label="Ivory Edge Interiors on Instagram"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Follow on Instagram
          </a>
        </div>

        {/* Quick links */}
        <div>
          <p className="font-display text-sm uppercase tracking-widest2 text-gold-300">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2.5">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.path}>
                <RouterNavLink
                  to={link.path}
                  className="font-body text-sm text-ivory-300 transition-colors hover:text-gold-300"
                >
                  {link.label}
                </RouterNavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <p className="font-display text-sm uppercase tracking-widest2 text-gold-300">
            Services
          </p>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((service) => (
              <li key={service} className="font-body text-sm text-ivory-300">
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-display text-sm uppercase tracking-widest2 text-gold-300">
            Get In Touch
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 font-body text-sm text-ivory-300 transition-colors hover:text-gold-300"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-body text-sm text-ivory-300 transition-colors hover:text-gold-300"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2.5 font-body text-sm text-ivory-300 transition-colors hover:text-gold-300"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-300/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="font-body text-xs text-ivory-300">
            © {currentYear} Ivory Edge Interiors. All rights reserved.
          </p>
          <p className="font-body text-xs text-ivory-300">
            Founder & Principal Interior Designer — Shaik Riyaz Ahmed
          </p>
        </div>
      </div>
    </footer>
  );
}
