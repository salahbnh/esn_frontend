import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  assignmentErrorMessage,
  isOverAllocated,
  toCreateAssignmentBody,
  toStatusChangeBody,
  toUpdateAssignmentBody,
} from "@/features/staffing/form-helpers";

const baseForm = {
  missionId: "m1",
  consultantId: "c1",
  roleOnMission: "",
  startDate: "2026-09-01",
  endDate: "",
  allocationPct: 80,
};

describe("toCreateAssignmentBody", () => {
  it("keeps ids + allocation, drops blank optionals", () => {
    expect(toCreateAssignmentBody(baseForm)).toEqual({
      missionId: "m1",
      consultantId: "c1",
      roleOnMission: undefined,
      startDate: "2026-09-01",
      endDate: undefined,
      allocationPct: 80,
    });
  });
});

describe("toUpdateAssignmentBody", () => {
  it("sends only mutable fields (no mission/consultant)", () => {
    const body = toUpdateAssignmentBody({
      ...baseForm,
      roleOnMission: " Lead ",
    });
    expect(body).toEqual({
      roleOnMission: "Lead",
      startDate: "2026-09-01",
      endDate: undefined,
      allocationPct: 80,
    });
    expect(body).not.toHaveProperty("missionId");
    expect(body).not.toHaveProperty("consultantId");
  });
});

describe("toStatusChangeBody", () => {
  it("passes status, drops a blank comment", () => {
    expect(toStatusChangeBody({ status: "CONFIRMED", comment: "" })).toEqual({
      status: "CONFIRMED",
      comment: undefined,
    });
  });
});

describe("isOverAllocated", () => {
  it("detects the OVER_ALLOCATED guard (code in details)", () => {
    const err = new ApiError(400, "BAD_REQUEST", "...", {
      code: "OVER_ALLOCATED",
      requestedPct: 80,
    });
    expect(isOverAllocated(err)).toBe(true);
  });

  it("is false for other errors", () => {
    expect(isOverAllocated(new ApiError(400, "BAD_REQUEST", "x", { code: "INVALID_TRANSITION" }))).toBe(false);
    expect(isOverAllocated(new Error("net"))).toBe(false);
  });
});

describe("assignmentErrorMessage (always French)", () => {
  it("maps INVALID_TRANSITION", () => {
    const err = new ApiError(400, "BAD_REQUEST", "x", {
      code: "INVALID_TRANSITION",
    });
    expect(assignmentErrorMessage(err)).toBe(fr.staffing.invalidTransition);
  });

  it("falls back to the generic French message", () => {
    expect(assignmentErrorMessage(new Error("net"))).toBe(
      fr.staffing.saveError,
    );
  });
});
