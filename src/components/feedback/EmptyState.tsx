import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Shown wherever a section has no content yet (no published projects, no
 * approved reviews, etc.) so the public site never looks broken before the
 * admin has added real content — it reads as "nothing here yet" rather
 * than a rendering error.
 */
export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-ivory-50 px-6 py-14 text-center",
        className,
      )}
    >
      <Icon className="h-8 w-8 text-gold-300" aria-hidden="true" />
      <p className="mt-4 font-display text-lg text-charcoal">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm font-body text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
