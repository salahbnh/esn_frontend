"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Allocation % chip: over-allocated (≥100) red, allocated (1–99) teal, on the
 * bench (0) grey. Reused by the occupancy table and the consultant detail.
 */
export function OccupancyBadge({
  pct,
  className,
}: {
  pct: number;
  className?: string;
}) {
  const tone =
    pct >= 100
      ? "bg-destructive/15 text-destructive border-transparent dark:bg-destructive/25"
      : pct > 0
        ? "bg-role-cons/15 text-role-cons border-transparent dark:bg-role-cons/25"
        : "bg-muted text-muted-foreground border-transparent";
  return (
    <Badge className={cn(tone, "tabular-nums", className)}>{pct} %</Badge>
  );
}
