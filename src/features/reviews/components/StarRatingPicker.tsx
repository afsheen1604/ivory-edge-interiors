import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingPickerProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * Clickable 1-5 star picker for the review submission form. Distinct from
 * the read-only StarRating display component used on review cards.
 */
export function StarRatingPicker({ value, onChange, className }: StarRatingPickerProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Rating, 1 to 5 stars"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          className="p-0.5"
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              star <= displayValue ? "fill-gold-300 text-gold-300" : "fill-none text-border",
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
