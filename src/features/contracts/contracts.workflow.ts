import {
  CONTRACT_VALIDATION_STEPS,
  type ContractStatus,
  type ContractValidationStep,
  type Role,
} from "@/lib/types";
import type { ContractValidation } from "@/features/contracts/contracts.types";

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
