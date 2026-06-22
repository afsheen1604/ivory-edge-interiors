import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProjectSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProjectSearchInput({ value, onChange }: ProjectSearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects by name or location…"
        aria-label="Search projects"
        className="pl-10 pr-10"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-charcoal"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
