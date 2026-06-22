/**
 * Form → API payload mapping + error messaging for mission dialogs. Explicit
 * field mapping (no spreading form state); empty optionals become `undefined`.
 * Dates stay date-only here — the API layer expands them to ISO datetimes.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import type {
  CreateAmendmentBody,
  CreateMissionBody,
  MissionStatusChangeBody,
  UpdateMissionBody,
} from "@/features/missions/missions.types";
import type {
  AmendmentForm,
  MissionForm,
  MissionStatusChangeForm,
} from "@/features/missions/missions.schemas";

function blankToUndef(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

export function toCreateMissionBody(v: MissionForm): CreateMissionBody {
  // requiredSkillIds omitted (deferred — backend defaults to []).
  return {
    clientId: v.clientId,
    project: v.project.trim(),
    role: v.role.trim(),
    description: blankToUndef(v.description),
    startDate: v.startDate,
    endDate: blankToUndef(v.endDate),
    tjm: v.tjm.trim(),
  };
}

export function toUpdateMissionBody(v: MissionForm): UpdateMissionBody {
  return toCreateMissionBody(v);
}

export function toStatusChangeBody(
  v: MissionStatusChangeForm,
): MissionStatusChangeBody {
  return { status: v.status, comment: blankToUndef(v.comment) };
}

/** Build the freeform `changes` object from only the filled structured fields. */
export function toAmendmentBody(v: AmendmentForm): CreateAmendmentBody {
  const changes: Record<string, unknown> = {};
  if (blankToUndef(v.newTjm)) changes.newTjm = v.newTjm!.trim();
  if (blankToUndef(v.newEndDate)) changes.newEndDate = v.newEndDate!.trim();
  if (blankToUndef(v.newRole)) changes.newRole = v.newRole!.trim();
  if (blankToUndef(v.note)) changes.note = v.note!.trim();
  return {
    reason: v.reason.trim(),
    effectiveDate: v.effectiveDate,
    changes,
  };
}

/**
 * Always French. The invalid-transition signal lives in `details.code` (the
 * top-level code is the generic "BAD_REQUEST").
 */
export function missionErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const detailCode =
      typeof err.details === "object" && err.details !== null
        ? (err.details as { code?: unknown }).code
        : undefined;
    if (
      err.code === "INVALID_TRANSITION" ||
      detailCode === "INVALID_TRANSITION"
    ) {
      return fr.missions.invalidTransition;
    }
  }
  return fr.missions.saveError;
}
