"use client";

/**
 * Sub-nav tabs for the reports area, with active-route highlighting. The set of
 * tabs is decided server-side (role-gated) and passed in; this only handles the
 * active state.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface ReportTab {
  href: string;
  label: string;
}

export function ReportsTabs({ tabs }: { tabs: ReportTab[] }) {
  const pathname = usePathname();
  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b"
      aria-label="Navigation des rapports"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
