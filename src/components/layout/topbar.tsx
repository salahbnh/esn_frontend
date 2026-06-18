import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import type { Role } from "@/lib/types";

interface TopbarProps {
  title?: string;
  name?: string | null;
  email?: string | null;
  role?: Role | null;
}

/**
 * Top app bar: mobile nav trigger, page title/breadcrumb slot, theme toggle,
 * and the user menu. Server component — receives session-derived props.
 */
export function Topbar({ title, name, email, role }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <MobileNav role={role} />
      <div className="flex-1">
        {title ? (
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu name={name} email={email} role={role} />
      </div>
    </header>
  );
}
