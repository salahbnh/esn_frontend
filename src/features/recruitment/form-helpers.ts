/**
 * Form → API payload mapping + error messaging for recruitment dialogs.
 * Explicit field mapping (no spreading of form state) so we never send unknown
 * keys to the backend's `.strict()` schemas, and empty optionals become
 * `undefined` (dropped by JSON.stringify) rather than empty strings.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import type {
  ConvertCandidateBody,
  CreateCandidateBody,
  UpdateCandidateBody,
} from "@/features/recruitment/recruitment.types";
import type {
  ConvertCandidateForm,
  CreateCandidateForm,
  UpdateCandidateForm,
} from "@/features/recruitment/recruitment.schemas";

/** Trimmed value, or `undefined` when blank. */
function blankToUndef(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

export function toCreateBody(v: CreateCandidateForm): CreateCandidateBody {
  return {
    firstName: v.firstName.trim(),
    lastName: v.lastName.trim(),
    email: v.email.trim(),
    phone: blankToUndef(v.phone),
    source: blankToUndef(v.source),
    targetPosition: blankToUndef(v.targetPosition),
    notes: blankToUndef(v.notes),
  };
}

export function toUpdateBody(v: UpdateCandidateForm): UpdateCandidateBody {
  return {
    firstName: blankToUndef(v.firstName),
    lastName: blankToUndef(v.lastName),
    email: blankToUndef(v.email),
    phone: blankToUndef(v.phone),
    source: blankToUndef(v.source),
    targetPosition: blankToUndef(v.targetPosition),
    notes: blankToUndef(v.notes),
  };
}

export function toConvertBody(v: ConvertCandidateForm): ConvertCandidateBody {
  return {
    position: v.position.trim(),
    hireDate: v.hireDate?.trim() || undefined,
    tjm: v.tjm?.trim() || undefined,
    seniority: v.seniority?.trim() || undefined,
    bio: v.bio?.trim() || undefined,
  };
}

/**
 * Map an API error to a French, user-facing message. Always French — backend
 * `message`s are English, so we never surface them; we key off error codes
 * instead. The duplicate-email signal lives in `details.code` (the top-level
 * `code` is the generic "CONFLICT").
 */
export function candidateErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const detailCode =
      typeof err.details === "object" && err.details !== null
        ? (err.details as { code?: unknown }).code
        : undefined;
    if (err.code === "EMAIL_EXISTS" || detailCode === "EMAIL_EXISTS") {
      return fr.candidates.emailExists;
    }
  }
  return fr.candidates.saveError;
}
