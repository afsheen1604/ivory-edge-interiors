import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Pulsing placeholder block shown while data is loading. Compose with
 * Tailwind sizing classes, e.g. <Skeleton className="h-48 w-full" />.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-ivory-200", className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
