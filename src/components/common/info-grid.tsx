/**
 * Detail-page field primitives. `InfoGrid` lays fields out in a responsive
 * two-column definition list; `InfoField` renders one label/value pair with an
 * optional small icon. Replaces the per-page `Field` copies so every detail
 * page presents information the same clean way.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function InfoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </dl>
  );
}

export function InfoField({
  label,
  children,
  icon: Icon,
  full,
}: {
  label: string;
  children: ReactNode;
  icon?: LucideIcon;
  full?: boolean;
}) {
  return (
    <div className={cn("min-w-0", full && "sm:col-span-2")}>
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon aria-hidden="true" className="h-3.5 w-3.5" /> : null}
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
