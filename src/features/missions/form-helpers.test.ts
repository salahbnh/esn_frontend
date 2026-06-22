import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  missionErrorMessage,
  toAmendmentBody,
  toCreateMissionBody,
  toStatusChangeBody,
} from "@/features/missions/form-helpers";

describe("toCreateMissionBody", () => {
  it("keeps required fields trimmed, drops blank optionals, omits skills", () => {
    expect(
      toCreateMissionBody({
        clientId: "c1",
        project: "  Plateforme ",
        role: "Dev",
        description: "",
        startDate: "2026-09-01",
        endDate: "",
        tjm: "650.00",
      }),
    ).toEqual({
      clientId: "c1",
      project: "Plateforme",
      role: "Dev",
      description: undefined,
      startDate: "2026-09-01",
      endDate: undefined,
      tjm: "650.00",
    });
  });
});

describe("toStatusChangeBody", () => {
  it("passes status, drops a blank comment", () => {
    expect(toStatusChangeBody({ status: "STAFFED", comment: "" })).toEqual({
      status: "STAFFED",
      comment: undefined,
    });
  });
});

describe("toAmendmentBody (structured changes — no raw JSON)", () => {
  it("rolls only the filled fields into `changes`", () => {
    expect(
      toAmendmentBody({
        reason: "Prolongation",
        effectiveDate: "2026-10-01",
        newTjm: "700.00",
        newEndDate: "",
        newRole: "",
        note: "Accord client",
      }),
    ).toEqual({
      reason: "Prolongation",
      effectiveDate: "2026-10-01",
      changes: { newTjm: "700.00", note: "Accord client" },
    });
  });

  it("produces an empty changes object when no structured field is filled", () => {
    expect(
      toAmendmentBody({
        reason: "Note interne",
        effectiveDate: "2026-10-01",
        newTjm: "",
        newEndDate: "",
        newRole: "",
        note: "",
      }).changes,
    ).toEqual({});
  });
});

describe("missionErrorMessage (always French)", () => {
  it("maps an invalid transition (code in details) to the French message", () => {
    const err = new ApiError(400, "BAD_REQUEST", "Cannot transition ...", {
      code: "INVALID_TRANSITION",
    });
    expect(missionErrorMessage(err)).toBe(fr.missions.invalidTransition);
  });

  it("falls back to the generic French message otherwise", () => {
    expect(missionErrorMessage(new ApiError(500, "INTERNAL", "x"))).toBe(
      fr.missions.saveError,
    );
    expect(missionErrorMessage(new Error("net"))).toBe(fr.missions.saveError);
  });
});
