import type { ConsultantStatus } from "@/lib/types";

/**
 * Consultant status state machine — a mirror of the backend
 * `ALLOWED_STATUS_TRANSITIONS` in `consultants.service.ts`. All statuses are
 * reversible (no terminal states), and the current status is never offered as a
 * target. The server is authoritative and rejects anything not listed here.
 *
 * NOTE: ON_MISSION / INTERCONTRAT are also driven automatically by the Staffing
 * module (on assignment activate/end). This manual path is for exceptional
 * corrections — the UI surfaces that nuance.
 */
export const ALLOWED_CONSULTANT_TRANSITIONS: Record<
  ConsultantStatus,
  ConsultantStatus[]
> = {
  AVAILABLE: ["INTERCONTRAT", "ON_MISSION"],
  INTERCONTRAT: ["AVAILABLE", "ON_MISSION"],
  ON_MISSION: ["AVAILABLE", "INTERCONTRAT"],
};

export function allowedConsultantTransitions(
  status: ConsultantStatus,
): ConsultantStatus[] {
  return ALLOWED_CONSULTANT_TRANSITIONS[status];
}
