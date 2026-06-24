import { describe, expect, it } from "vitest";

import {
  canValidate,
  currentPendingStep,
} from "@/features/contracts/contracts.workflow";
import type { ContractValidation } from "@/features/contracts/contracts.types";

function v(
  step: ContractValidation["step"],
  state: ContractValidation["state"],
): ContractValidation {
  return {
    id: step,
    contractId: "c1",
    step,
    state,
    validatorId: null,
    decidedAt: null,
    comment: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("currentPendingStep", () => {
  it("returns RH when nothing is approved yet", () => {
    const vals = [v("RH", "PENDING"), v("MANAGER", "PENDING"), v("DIRECTION", "PENDING")];
    expect(currentPendingStep(vals)).toBe("RH");
  });

  it("advances to MANAGER once RH approved", () => {
    const vals = [v("RH", "APPROVED"), v("MANAGER", "PENDING"), v("DIRECTION", "PENDING")];
    expect(currentPendingStep(vals)).toBe("MANAGER");
  });

  it("returns null when all steps are approved", () => {
    const vals = [v("RH", "APPROVED"), v("MANAGER", "APPROVED"), v("DIRECTION", "APPROVED")];
    expect(currentPendingStep(vals)).toBeNull();
  });
});

describe("canValidate (step → role gate)", () => {
  const valsManagerPending = [
    v("RH", "APPROVED"),
    v("MANAGER", "PENDING"),
    v("DIRECTION", "PENDING"),
  ];

  it("lets only the current-step role act", () => {
    expect(canValidate(valsManagerPending, "INTERNAL_VALIDATION", "MANAGER")).toBe(true);
    expect(canValidate(valsManagerPending, "INTERNAL_VALIDATION", "RH")).toBe(false);
    expect(canValidate(valsManagerPending, "INTERNAL_VALIDATION", "DIRECTION")).toBe(false);
  });

  it("is false unless the contract is in validation", () => {
    expect(canValidate(valsManagerPending, "DRAFT", "MANAGER")).toBe(false);
    expect(canValidate(valsManagerPending, "PENDING_SIGNATURE", "MANAGER")).toBe(false);
  });

  it("is false for a consultant / no role", () => {
    expect(canValidate(valsManagerPending, "INTERNAL_VALIDATION", "CONSULTANT")).toBe(false);
    expect(canValidate(valsManagerPending, "INTERNAL_VALIDATION", null)).toBe(false);
  });
});
