import { cn } from "@/lib/utils";
import { PROJECT_CATEGORY_LABELS } from "@/features/projects/types/project";
import type { Project } from "@/features/projects/types/project";

export type CategoryFilterValue = Project["category"] | "all";

const CATEGORY_OPTIONS: { value: CategoryFilterValue; label: string }[] = [
  { value: "all", label: "All Projects" },
  ...(Object.entries(PROJECT_CATEGORY_LABELS) as [Project["category"], string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-2.5"
      role="group"
      aria-label="Filter projects by category"
    >
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full border px-4 py-2 font-body text-sm transition-colors",
              isActive
                ? "border-charcoal bg-charcoal text-ivory-100"
                : "border-border bg-transparent text-charcoal hover:border-gold-300 hover:text-gold-500",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
