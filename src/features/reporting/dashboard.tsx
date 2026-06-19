"use client";

/**
 * Role-aware dashboard switch. Receives the role + name from the server page
 * and renders the matching variant. CONSULTANT → self-dashboard; everyone else
 * → the staff summary dashboard (which itself renders only the role's blocks).
 */

import { ConsultantDashboard } from "@/features/reporting/consultant-dashboard";
import { StaffDashboard } from "@/features/reporting/staff-dashboard";
import type { Role } from "@/lib/types";

export function Dashboard({
  role,
  name,
}: {
  role: Role | null;
  name?: string | null;
}) {
  if (role === "CONSULTANT") {
    return <ConsultantDashboard name={name} />;
  }
  return <StaffDashboard name={name} />;
}
