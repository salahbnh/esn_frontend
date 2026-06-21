/**
 * Form → API payload mapping + error messaging for consultant dialogs. Explicit
 * field mapping (no spreading form state) so we never send unknown keys to the
 * backend's `.strict()` schemas; empty optionals become `undefined` (dropped by
 * JSON.stringify) rather than empty strings. The API layer expands
 * `availabilityDate` (date-only) to a full ISO datetime.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import type {
  AdminUpdateConsultantBody,
  SelfEditProfileBody,
  StatusChangeBody,
} from "@/features/consultants/consultants.types";
import type {
  AdminUpdateForm,
  SelfEditForm,
  StatusChangeForm,
} from "@/features/consultants/consultants.schemas";

function blankToUndef(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

export function toAdminUpdateBody(v: AdminUpdateForm): AdminUpdateConsultantBody {
  return {
    position: blankToUndef(v.position),
    tjm: blankToUndef(v.tjm),
    seniority: blankToUndef(v.seniority),
    bio: blankToUndef(v.bio),
    availabilityDate: blankToUndef(v.availabilityDate),
  };
}

export function toSelfEditBody(v: SelfEditForm): SelfEditProfileBody {
  return {
    bio: blankToUndef(v.bio),
    seniority: blankToUndef(v.seniority),
  };
}

export function toStatusChangeBody(v: StatusChangeForm): StatusChangeBody {
  return {
    status: v.status,
    comment: blankToUndef(v.comment),
  };
}

/**
 * Map an API error to a French, user-facing message. Always French — backend
 * `message`s are English. The invalid-transition signal lives in `details.code`
 * (the top-level `code` is the generic "BAD_REQUEST").
 */
export function consultantErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const detailCode =
      typeof err.details === "object" && err.details !== null
        ? (err.details as { code?: unknown }).code
        : undefined;
    if (
      err.code === "INVALID_TRANSITION" ||
      detailCode === "INVALID_TRANSITION"
    ) {
      return fr.consultants.invalidTransition;
    }
  }
  return fr.consultants.saveError;
}
