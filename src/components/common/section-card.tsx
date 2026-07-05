/**
 * Titled content section for detail pages: a card with an icon chip + heading
 * (and an optional right-aligned action), body below. Gives tabs and detail
 * blocks a consistent, calm structure.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { MODULE_ACCENTS, type ModuleAccent } from "@/lib/module-accents";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  icon: Icon,
  accent,
  action,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  accent?: ModuleAccent;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const tint = accent ? MODULE_ACCENTS[accent] : undefined;
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            {Icon ? (
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  tint?.chip ?? "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            ) : null}
            {title}
          </h3>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
