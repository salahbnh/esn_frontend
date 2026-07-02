import {
  CONTRACT_VALIDATION_STEPS,
  type ContractStatus,
  type ContractValidationStep,
  type Role,
} from "@/lib/types";
import type { Contract, ContractValidation } from "@/features/contracts/contracts.types";

/**
 * The current pending validation step — the first step in RH→MANAGER→DIRECTION
 * order whose validation is still PENDING. Mirrors the backend's step gate.
 * Returns null when none is pending (all approved, or not in validation).
 */
export function currentPendingStep(
  validations: ContractValidation[],
): ContractValidationStep | null {
  for (const step of CONTRACT_VALIDATION_STEPS) {
    const v = validations.find((x) => x.step === step);
    if (v && v.state === "PENDING") return step;
  }
  return null;
}

/**
 * Whether the given role may act on the contract's current pending step. The
 * contract must be in INTERNAL_VALIDATION and the pending step must match the
 * role (the server enforces this regardless).
 */
export function canValidate(
  validations: ContractValidation[],
  status: ContractStatus,
  role: Role | null | undefined,
): boolean {
  if (status !== "INTERNAL_VALIDATION") return false;
  return Boolean(role) && currentPendingStep(validations) === role;
}

// --- Two-party signing (UX gates; the server is the real authority) --------

/** The consultant may sign when the contract awaits their (not-yet-given) signature. */
export function canConsultantSign(c: Contract): boolean {
  return c.status === "PENDING_SIGNATURE" && c.consultantSignedAt === null;
}

/** The consultant may reject up until they sign. */
export function canReject(c: Contract): boolean {
  return c.status === "PENDING_SIGNATURE" && c.consultantSignedAt === null;
}

/** RH/DIRECTION may countersign once the consultant has signed. */
export function canCountersign(c: Contract): boolean {
  return c.status === "PENDING_SIGNATURE" && c.consultantSignedAt !== null;
}

export type SigningSubState = "AWAITING_CONSULTANT" | "AWAITING_COMPANY" | null;

/** Which side the signing is waiting on (null when not in the signing window). */
export function signingSubState(c: Contract): SigningSubState {
  if (c.status !== "PENDING_SIGNATURE") return null;
  return c.consultantSignedAt === null ? "AWAITING_CONSULTANT" : "AWAITING_COMPANY";
}
