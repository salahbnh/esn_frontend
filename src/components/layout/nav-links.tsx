"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navForRole } from "@/lib/rbac";
import type { Role } from "@/lib/types";

/**
 * Role-aware navigation links with active-route highlighting. Shared by the
 * desktop sidebar and the mobile sheet. `onNavigate` lets the sheet close on click.
 */
export function NavLinks({
  role,
  onNavigate,
}: {
  role: Role | null | undefined;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sections = navForRole(role);

  // An item matches the current path on exact equality or as a path prefix
  // (so `/consultants/:id` keeps "Consultants" active). When two nav items both
  // match — e.g. `/me` and `/me/missions` — only the most specific (longest)
  // one is highlighted, so a parent doesn't light up alongside its child.
  const matches = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const allHrefs = sections.flatMap((s) => s.items.map((i) => i.href));
  const isActive = (href: string) =>
    matches(href) &&
    !allHrefs.some((other) => other.length > href.length && matches(other));

  return (
    <nav className="flex flex-col gap-6" aria-label="Navigation principale">
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          {section.items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
