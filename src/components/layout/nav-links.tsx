"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { MODULE_ACCENTS } from "@/lib/module-accents";
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
            const tint = MODULE_ACCENTS[item.accent];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? cn(tint.soft, "text-foreground")
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {/* Active indicator bar (module-tinted) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-opacity",
                    tint.bar,
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? tint.text : "text-muted-foreground/70",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
