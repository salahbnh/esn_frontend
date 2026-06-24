/**
 * Form → API payload mapping + error messaging for contract dialogs. Dates stay
 * date-only here — the API layer expands them. Always-French error messages keyed
 * off `details.code`.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import type {
  CreateContractAmendmentBody,
  CreateContractBody,
  UpdateContractBody,
  ValidateStepBody,
} from "@/features/contracts/contracts.types";
import type {
  ContractAmendmentForm,
  ContractCreateForm,
  ContractEditForm,
  ValidateStepForm,
} from "@/features/contracts/contracts.schemas";

function blankToUndef(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

export function toCreateContractBody(v: ContractCreateForm): CreateContractBody {
  return {
    consultantId: v.consultantId,
    templateId: blankToUndef(v.templateId),
    type: v.type.trim(),
    startDate: blankToUndef(v.startDate),
    endDate: blankToUndef(v.endDate),
  };
}

export function toUpdateContractBody(v: ContractEditForm): UpdateContractBody {
  return {
    type: v.type.trim(),
    startDate: blankToUndef(v.startDate),
    endDate: blankToUndef(v.endDate),
  };
}

export function toValidateBody(v: ValidateStepForm): ValidateStepBody {
  return { decision: v.decision, comment: blankToUndef(v.comment) };
}

export function toContractAmendmentBody(
  v: ContractAmendmentForm,
): CreateContractAmendmentBody {
  const changes: Record<string, unknown> = {};
  if (blankToUndef(v.newType)) changes.newType = v.newType!.trim();
  if (blankToUndef(v.newEndDate)) changes.newEndDate = v.newEndDate!.trim();
  if (blankToUndef(v.note)) changes.note = v.note!.trim();
  return { reason: v.reason.trim(), effectiveDate: v.effectiveDate, changes };
}

function detailCode(err: unknown): string | undefined {
  if (err instanceof ApiError && typeof err.details === "object" && err.details !== null) {
    return (err.details as { code?: unknown }).code as string | undefined;
  }
  return undefined;
}

/** Always French — maps the contract workflow error codes. */
export function contractErrorMessage(err: unknown): string {
  switch (detailCode(err)) {
    case "CONTRACT_NOT_DRAFT":
      return fr.contracts.errNotDraft;
    case "INCOMPLETE_CONTRACT":
      return fr.contracts.errIncomplete;
    case "CONTRACT_NOT_READY":
      return fr.contracts.errNotReady;
    case "CONTRACT_NO_BODY":
      return fr.contracts.errNoBody;
    case "NOT_PENDING_SIGNATURE":
      return fr.contracts.errNotPendingSignature;
    case "CONTRACT_NOT_SIGNED":
      return fr.contracts.errNotSigned;
    case "NOT_IN_VALIDATION":
    case "NO_PENDING_STEP":
      return fr.contracts.errNotInValidation;
    default:
      return fr.contracts.saveError;
  }
}
