import { type ReactNode } from "react";

export function StatCard({ title, value, children }: { title: string; value: number; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="mt-1 font-display text-2xl text-charcoal">{value}</p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default StatCard;
