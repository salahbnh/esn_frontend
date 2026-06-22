/**
 * Form → API payload mapping + error messaging for staffing dialogs. Dates stay
 * date-only here — the API layer expands them. Includes `isOverAllocated` so the
 * status/edit flows can branch to a "force" confirm on the OVER_ALLOCATED guard.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import type {
  AssignmentStatusChangeBody,
  CreateAssignmentBody,
  UpdateAssignmentBody,
} from "@/features/staffing/staffing.types";
import type {
  AssignmentForm,
  AssignmentStatusChangeForm,
} from "@/features/staffing/staffing.schemas";

function blankToUndef(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

export function toCreateAssignmentBody(v: AssignmentForm): CreateAssignmentBody {
  return {
    missionId: v.missionId,
    consultantId: v.consultantId,
    roleOnMission: blankToUndef(v.roleOnMission),
    startDate: v.startDate,
    endDate: blankToUndef(v.endDate),
    allocationPct: v.allocationPct,
  };
}

/** Edit sends only the mutable fields (mission + consultant are immutable). */
export function toUpdateAssignmentBody(v: AssignmentForm): UpdateAssignmentBody {
  return {
    roleOnMission: blankToUndef(v.roleOnMission),
    startDate: v.startDate || undefined,
    endDate: blankToUndef(v.endDate),
    allocationPct: v.allocationPct,
  };
}

export function toStatusChangeBody(
  v: AssignmentStatusChangeForm,
): AssignmentStatusChangeBody {
  return { status: v.status, comment: blankToUndef(v.comment) };
}

/** The `details.code` of an ApiError, if present. */
function detailCode(err: unknown): string | undefined {
  if (err instanceof ApiError && typeof err.details === "object" && err.details !== null) {
    return (err.details as { code?: unknown }).code as string | undefined;
  }
  return undefined;
}

/** True when the backend rejected for over-allocation (offer a force retry). */
export function isOverAllocated(err: unknown): boolean {
  return detailCode(err) === "OVER_ALLOCATED";
}

/**
 * Always French. Maps known `details.code`s; the OVER_ALLOCATED case is normally
 * intercepted by `isOverAllocated` before reaching here.
 */
export function assignmentErrorMessage(err: unknown): string {
  const code = detailCode(err);
  if (code === "INVALID_TRANSITION") return fr.staffing.invalidTransition;
  if (code === "OVER_ALLOCATED") return fr.staffing.overAllocated;
  if (code === "MISSION_NOT_STAFFABLE")
    return fr.staffing.missionNotStaffable;
  return fr.staffing.saveError;
}
