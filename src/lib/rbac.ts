/**
 * Client-side RBAC helpers for UI gating ONLY. The backend is the real
 * authority on every API call — hiding nav/buttons here is UX, never security.
 *
 * The nav config drives the sidebar. `roles: "ALL"` shows the item to every
 * authenticated user; otherwise it is visible only to the listed roles.
 */

import {
  Briefcase,
  FileText,
  FolderOpen,
  LayoutDashboard,
  type LucideIcon,
  ScrollText,
  UserCircle,
  Users,
  UsersRound,
  Building2,
} from "lucide-react";

import { fr } from "@/lib/i18n/fr";
import type { Role } from "@/lib/types";

export type { Role };

export interface NavItem {
  /** i18n label (already French). */
  label: string;
  href: string;
  icon: LucideIcon;
  /** "ALL" or the roles allowed to see this item. */
  roles: "ALL" | Role[];
}

export interface NavSection {
  /** Section heading (French). */
  title: string;
  items: NavItem[];
}

/**
 * Full navigation model. Visibility per the rbac matrix / frontend plan §5:
 *  - RH: Dashboard, Candidats, Consultants, Contrats, Documents, Reporting
 *  - Manager: Dashboard, Clients, Missions, Staffing, Consultants(view), Reporting
 *  - Direction: everything
 *  - Consultant: slim self-service space
 */
const NAV_MODEL: NavSection[] = [
  {
    title: fr.nav.sectionMain,
    items: [
      {
        label: fr.nav.dashboard,
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: "ALL",
      },
    ],
  },
  {
    title: fr.nav.sectionManage,
    items: [
      {
        label: fr.nav.candidates,
        href: "/candidates",
        icon: Users,
        roles: ["RH", "DIRECTION"],
      },
      {
        label: fr.nav.consultants,
        href: "/consultants",
        icon: UsersRound,
        roles: ["RH", "MANAGER", "DIRECTION"],
      },
      {
        label: fr.nav.clients,
        href: "/clients",
        icon: Building2,
        roles: ["MANAGER", "DIRECTION"],
      },
      {
        label: fr.nav.missions,
        href: "/missions",
        icon: Briefcase,
        roles: ["MANAGER", "DIRECTION"],
      },
      {
        label: fr.nav.staffing,
        href: "/staffing",
        icon: UsersRound,
        roles: ["MANAGER", "DIRECTION"],
      },
      {
        label: fr.nav.contracts,
        href: "/contracts",
        icon: ScrollText,
        roles: ["RH", "MANAGER", "DIRECTION"],
      },
      {
        label: fr.nav.documents,
        href: "/documents",
        icon: FolderOpen,
        roles: ["RH", "DIRECTION"],
      },
      {
        label: fr.nav.reports,
        href: "/reports",
        icon: FileText,
        roles: ["RH", "MANAGER", "DIRECTION"],
      },
    ],
  },
  {
    title: fr.nav.sectionMe,
    items: [
      {
        label: fr.nav.myProfile,
        href: "/me",
        icon: UserCircle,
        roles: ["CONSULTANT"],
      },
      {
        label: fr.nav.myMissions,
        href: "/me/missions",
        icon: Briefcase,
        roles: ["CONSULTANT"],
      },
      {
        label: fr.nav.myDocuments,
        href: "/me/documents",
        icon: FolderOpen,
        roles: ["CONSULTANT"],
      },
      {
        label: fr.nav.myContract,
        href: "/me/contract",
        icon: ScrollText,
        roles: ["CONSULTANT"],
      },
    ],
  },
];

/**
 * Roles allowed to view the RH + pipeline reports (UX gating only — the backend
 * returns 403 for everyone else). Occupancy + missions are open to RH/MGR/DIR.
 */
export const RH_PIPELINE_REPORT_ROLES: Role[] = ["RH", "DIRECTION"];

/** Whether a role may see the pipeline / HR reports (UX only). */
export function canSeeHrReports(role: Role | null | undefined): boolean {
  return !!role && RH_PIPELINE_REPORT_ROLES.includes(role);
}

/** Whether a role may see a nav item (UX only). */
export function canSee(item: NavItem, role: Role | null | undefined): boolean {
  if (!role) return false;
  if (item.roles === "ALL") return true;
  return item.roles.includes(role);
}

/** Nav sections filtered to what `role` can see (empty sections dropped). */
export function navForRole(role: Role | null | undefined): NavSection[] {
  return NAV_MODEL.map((section) => ({
    title: section.title,
    items: section.items.filter((item) => canSee(item, role)),
  })).filter((section) => section.items.length > 0);
}
