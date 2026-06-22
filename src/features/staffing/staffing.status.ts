import type { AssignmentStatus } from "@/lib/types";

/**
 * Assignment status state machine — a mirror of the backend
 * `ALLOWED_STATUS_TRANSITIONS` in `staffing.service.ts`. CONFIRMED can advance to
 * ACTIVE or revert to PROPOSED; ACTIVE→ENDED; ENDED is terminal. The current
 * status is never offered as a target. The server is authoritative.
 *
 * NOTE: `→ACTIVE` cascades to mission STAFFED + consultant ON_MISSION; `→ENDED`
 * benches the consultant. Activating may also be blocked by the over-allocation
 * guard (OVER_ALLOCATED) unless forced — handled in the status control.
 */
export const ALLOWED_ASSIGNMENT_TRANSITIONS: Record<
  AssignmentStatus,
  AssignmentStatus[]
> = {
  PROPOSED: ["CONFIRMED"],
  CONFIRMED: ["ACTIVE", "PROPOSED"],
  ACTIVE: ["ENDED"],
  ENDED: [],
};

export function allowedAssignmentTransitions(
  status: AssignmentStatus,
): AssignmentStatus[] {
  return ALLOWED_ASSIGNMENT_TRANSITIONS[status];
}
