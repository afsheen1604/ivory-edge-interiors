import { Gem, Users, ClipboardCheck, Clock } from "lucide-react";

const REASONS = [
  {
    icon: Gem,
    title: "Personalized Design",
    description:
      "Every interior is shaped around your lifestyle and taste, never a one-size-fits-all template.",
  },
  {
    icon: ClipboardCheck,
    title: "End-to-End Execution",
    description:
      "From space planning to furniture styling, we manage the full journey under one roof.",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    description: "Clear communication and collaborative decisions at every stage of the project.",
  },
  {
    icon: Clock,
    title: "Reliable Delivery",
    description: "Realistic timelines, transparent updates, and respect for your schedule.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="container py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <p className="font-body text-xs uppercase tracking-widest2 text-gold-400">Our Promise</p>
        <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Why Choose Us</h2>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason) => (
          <div key={reason.title} className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-gold-300">
              <reason.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-display text-lg text-charcoal">{reason.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
