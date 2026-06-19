"use client";

/**
 * Titled card wrapping a Recharts chart inside a ResponsiveContainer. Renders
 * an empty state (French) when `isEmpty`. Theme-aware: charts inside use CSS
 * vars (`hsl(var(--chart-N))`) so they adapt to light/dark automatically.
 */

import type { ReactElement, ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

import { EmptyState } from "@/components/common/async-states";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  isEmpty = false,
  emptyHint,
  height = 280,
  children,
  className,
  actions,
}: {
  title: string;
  description?: string;
  isEmpty?: boolean;
  emptyHint?: string;
  height?: number;
  /** A single Recharts chart element (e.g. <BarChart>…</BarChart>). */
  children: ReactElement;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {actions}
      </CardHeader>
      <CardContent className="flex-1">
        {isEmpty ? (
          <EmptyState hint={emptyHint} className="h-full min-h-[200px]" />
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
