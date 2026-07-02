import { describe, expect, it } from "vitest";

import {
  canConsultantSign,
  canCountersign,
  canReject,
  canValidate,
  currentPendingStep,
  signingSubState,
} from "@/features/contracts/contracts.workflow";
import type {
  Contract,
  ContractValidation,
} from "@/features/contracts/contracts.types";

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

function contract(
  status: Contract["status"],
  consultantSignedAt: string | null,
): Contract {
  return {
    id: "c1",
    consultantId: "con1",
    templateId: null,
    type: "CDI",
    status,
    generatedPdfId: "doc1",
    signedPdfId: null,
    startDate: null,
    endDate: null,
    archivedAt: null,
    consultantSignedAt,
    consultantSignatoryName: consultantSignedAt ? "Inès Chevalier" : null,
    companySignedAt: null,
    companySignatoryName: null,
    rejectionReason: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    consultant: {
      id: "con1",
      position: "Engineer",
      tjm: null,
      status: "AVAILABLE",
      userId: "u1",
      user: { id: "u1", firstName: "Inès", lastName: "Chevalier" },
    },
  };
}

describe("two-party signing gates", () => {
  it("canConsultantSign only when PENDING_SIGNATURE and not yet signed", () => {
    expect(canConsultantSign(contract("PENDING_SIGNATURE", null))).toBe(true);
    expect(canConsultantSign(contract("PENDING_SIGNATURE", "2026-07-02T00:00:00.000Z"))).toBe(false);
    expect(canConsultantSign(contract("DRAFT", null))).toBe(false);
  });

  it("canReject mirrors canConsultantSign", () => {
    expect(canReject(contract("PENDING_SIGNATURE", null))).toBe(true);
    expect(canReject(contract("PENDING_SIGNATURE", "2026-07-02T00:00:00.000Z"))).toBe(false);
  });

  it("canCountersign only after the consultant signed", () => {
    expect(canCountersign(contract("PENDING_SIGNATURE", "2026-07-02T00:00:00.000Z"))).toBe(true);
    expect(canCountersign(contract("PENDING_SIGNATURE", null))).toBe(false);
    expect(canCountersign(contract("SIGNED", "2026-07-02T00:00:00.000Z"))).toBe(false);
  });

  it("signingSubState reflects which side is pending", () => {
    expect(signingSubState(contract("PENDING_SIGNATURE", null))).toBe("AWAITING_CONSULTANT");
    expect(signingSubState(contract("PENDING_SIGNATURE", "2026-07-02T00:00:00.000Z"))).toBe(
      "AWAITING_COMPANY",
    );
    expect(signingSubState(contract("DRAFT", null))).toBeNull();
    expect(signingSubState(contract("SIGNED", "2026-07-02T00:00:00.000Z"))).toBeNull();
  });
});
