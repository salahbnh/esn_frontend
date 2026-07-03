import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";

function detailCode(err: unknown): string | undefined {
  if (err instanceof ApiError && typeof err.details === "object" && err.details !== null) {
    return (err.details as { code?: unknown }).code as string | undefined;
  }
  return undefined;
}

export function jobPostErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.status === 422) return fr.jobPosts.errNotDraft;
  switch (detailCode(err)) {
    case "CANDIDATE_IS_CONSULTANT":
      return fr.jobPosts.errIsConsultant;
    case "JOB_POST_HAS_APPLICATIONS":
      return fr.jobPosts.errHasApplications;
    case "QUESTION_OPTIONS_REQUIRED":
      return fr.jobPosts.errOptionsRequired;
    case "ALREADY_LINKED":
      return fr.jobPosts.errAlreadyLinked;
    default:
      return fr.jobPosts.saveError;
  }
}
