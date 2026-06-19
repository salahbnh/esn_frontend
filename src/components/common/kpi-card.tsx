/**
 * KPI card: a big headline value with an optional sub-line and icon. Shows a
 * skeleton while loading. Accent tints the icon and value. Reused everywhere.
 */

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type KpiAccent = "primary" | "accent" | "rh" | "mgr" | "dir" | "cons";

const accentText: Record<KpiAccent, string> = {
  primary: "text-primary",
  accent: "text-accent",
  rh: "text-role-rh",
  mgr: "text-role-mgr",
  dir: "text-role-dir",
  cons: "text-role-cons",
};

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
  loading = false,
  className,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  accent?: KpiAccent;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p
              className={cn(
                "text-2xl font-semibold tabular-nums",
                accentText[accent],
              )}
            >
              {value}
            </p>
          )}
          {loading ? (
            <Skeleton className="h-3 w-16" />
          ) : sub ? (
            <p className="text-xs text-muted-foreground">{sub}</p>
          ) : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "shrink-0 rounded-md bg-muted p-2",
              accentText[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
