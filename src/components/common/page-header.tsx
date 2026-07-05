/**
 * Page header: title + optional subtitle + an actions slot (right-aligned).
 * Optionally shows a module icon inside a soft accent chip (per-module tints
 * from `module-accents.ts`). Reused across every module screen.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { MODULE_ACCENTS, type ModuleAccent } from "@/lib/module-accents";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  icon: Icon,
  accent,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
  accent?: ModuleAccent;
}) {
  const tint = accent ? MODULE_ACCENTS[accent] : undefined;
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              tint?.chip ?? "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
