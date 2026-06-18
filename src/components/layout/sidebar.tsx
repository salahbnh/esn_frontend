import { Logo } from "@/components/layout/logo";
import { NavLinks } from "@/components/layout/nav-links";
import type { Role } from "@/lib/types";

/**
 * Desktop sidebar. Fixed left column, hidden below `lg` (mobile uses the Sheet
 * in the Topbar). Role-aware nav driven by `rbac.ts`.
 */
export function Sidebar({ role }: { role: Role | null | undefined }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <NavLinks role={role} />
      </div>
    </aside>
  );
}
