import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  contractErrorMessage,
  toContractAmendmentBody,
  toCreateContractBody,
  toUpdateContractBody,
  toValidateBody,
} from "@/features/contracts/form-helpers";

describe("toCreateContractBody", () => {
  it("keeps consultant + type, drops blank optionals", () => {
    expect(
      toCreateContractBody({
        consultantId: "c1",
        templateId: "",
        managerId: "m1",
        type: " CDI ",
        startDate: "2026-09-01",
        endDate: "",
      }),
    ).toEqual({
      consultantId: "c1",
      templateId: undefined,
      managerId: "m1",
      type: "CDI",
      startDate: "2026-09-01",
      endDate: undefined,
    });
  });

  it("keeps a chosen template", () => {
    const body = toCreateContractBody({
      consultantId: "c1",
      templateId: "tpl1",
      managerId: "m1",
      type: "CDI",
      startDate: "",
      endDate: "",
    });
    expect(body.templateId).toBe("tpl1");
  });
});

describe("toUpdateContractBody", () => {
  it("sends only mutable fields (no consultant/template)", () => {
    const body = toUpdateContractBody({
      type: " Régie ",
      startDate: "",
      endDate: "2026-12-31",
    });
    expect(body).toEqual({
      type: "Régie",
      startDate: undefined,
      endDate: "2026-12-31",
    });
    expect(body).not.toHaveProperty("consultantId");
  });
});

describe("toValidateBody", () => {
  it("passes the decision, drops a blank comment", () => {
    expect(toValidateBody({ decision: "APPROVED", comment: "" })).toEqual({
      decision: "APPROVED",
      comment: undefined,
    });
  });

  it("keeps a rejection comment", () => {
    expect(
      toValidateBody({ decision: "REJECTED", comment: " manque infos " }),
    ).toEqual({ decision: "REJECTED", comment: "manque infos" });
  });
});

describe("toContractAmendmentBody", () => {
  it("builds structured changes from the filled fields only", () => {
    expect(
      toContractAmendmentBody({
        reason: " Prolongation ",
        effectiveDate: "2027-01-01",
        newType: "",
        newEndDate: "2027-06-30",
        note: " RAS ",
      }),
    ).toEqual({
      reason: "Prolongation",
      effectiveDate: "2027-01-01",
      changes: { newEndDate: "2027-06-30", note: "RAS" },
    });
  });

  it("yields empty changes when no change field is filled", () => {
    expect(
      toContractAmendmentBody({
        reason: "Motif",
        effectiveDate: "2027-01-01",
        newType: "",
        newEndDate: "",
        note: "",
      }).changes,
    ).toEqual({});
  });
});

describe("contractErrorMessage (always French)", () => {
  it("maps the workflow error codes", () => {
    const cases: Array<[string, string]> = [
      ["CONTRACT_NOT_DRAFT", fr.contracts.errNotDraft],
      ["INCOMPLETE_CONTRACT", fr.contracts.errIncomplete],
      ["CONTRACT_NOT_READY", fr.contracts.errNotReady],
      ["CONTRACT_NO_BODY", fr.contracts.errNoBody],
      ["NOT_PENDING_SIGNATURE", fr.contracts.errNotPendingSignature],
    ];
    for (const [code, msg] of cases) {
      const err = new ApiError(400, "BAD_REQUEST", "x", { code });
      expect(contractErrorMessage(err)).toBe(msg);
    }
  });

  it("falls back to the generic French message", () => {
    expect(contractErrorMessage(new Error("net"))).toBe(fr.contracts.saveError);
  });
});
