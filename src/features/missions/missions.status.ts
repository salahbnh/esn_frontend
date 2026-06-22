import type { MissionStatus } from "@/lib/types";

/** A status reachable via a manual `/status` transition (ARCHIVED is /archive-only). */
export type NextMissionStatus = Exclude<MissionStatus, "ARCHIVED">;

/**
 * Mission status state machine — a mirror of the backend `ALLOWED_STATUS_TRANSITIONS`
 * in `missions.service.ts`. The key invariant: there is **no DRAFT → IN_PROGRESS
 * shortcut** — a mission must be STAFFED before it can start. CLOSED/ARCHIVED are
 * terminal; ARCHIVED is reached only through the dedicated `/archive` endpoint,
 * never `/status`. STAFFED is also driven automatically by the Staffing module
 * (assignment activation), so the manual control is for exceptional cases.
 */
export const ALLOWED_MISSION_TRANSITIONS: Record<
  MissionStatus,
  NextMissionStatus[]
> = {
  DRAFT: ["STAFFED"],
  STAFFED: ["IN_PROGRESS", "DRAFT"],
  IN_PROGRESS: ["CLOSED"],
  CLOSED: [],
  ARCHIVED: [],
};

export function allowedMissionTransitions(
  status: MissionStatus,
): NextMissionStatus[] {
  return ALLOWED_MISSION_TRANSITIONS[status];
}
