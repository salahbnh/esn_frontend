/**
 * Always-French error messaging for the skills referential, keyed off
 * `details.code` from the API's `AppError` envelope.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";

function detailCode(err: unknown): string | undefined {
  if (err instanceof ApiError && typeof err.details === "object" && err.details !== null) {
    return (err.details as { code?: unknown }).code as string | undefined;
  }
  return undefined;
}

export function skillErrorMessage(err: unknown): string {
  switch (detailCode(err)) {
    case "SKILL_ALREADY_EXISTS":
      return fr.skills.duplicateError;
    case "SKILL_IN_USE":
      return fr.skills.inUseError;
    default:
      return fr.skills.saveError;
  }
}
