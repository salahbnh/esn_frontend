import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  consultantErrorMessage,
  toAdminUpdateBody,
  toSelfEditBody,
  toStatusChangeBody,
} from "@/features/consultants/form-helpers";

describe("toAdminUpdateBody", () => {
  it("trims values, drops blanks; date stays date-only (the API expands it)", () => {
    expect(
      toAdminUpdateBody({
        position: "  Dev Full-Stack ",
        tjm: "",
        seniority: "  ",
        bio: "Senior",
        availabilityDate: "2026-09-01",
      }),
    ).toEqual({
      position: "Dev Full-Stack",
      tjm: undefined,
      seniority: undefined,
      bio: "Senior",
      availabilityDate: "2026-09-01",
    });
  });
});

describe("toSelfEditBody", () => {
  it("keeps only the narrow self-editable fields, blank → undefined", () => {
    expect(toSelfEditBody({ bio: "x", seniority: "" })).toEqual({
      bio: "x",
      seniority: undefined,
    });
  });
});

describe("toStatusChangeBody", () => {
  it("passes status, drops a blank comment", () => {
    expect(toStatusChangeBody({ status: "ON_MISSION", comment: "" })).toEqual({
      status: "ON_MISSION",
      comment: undefined,
    });
  });
});

describe("consultantErrorMessage (always French)", () => {
  it("maps an invalid transition (code in details) to the French message", () => {
    const err = new ApiError(400, "BAD_REQUEST", "Cannot transition ...", {
      code: "INVALID_TRANSITION",
      from: "AVAILABLE",
      to: "AVAILABLE",
    });
    expect(consultantErrorMessage(err)).toBe(fr.consultants.invalidTransition);
  });

  it("falls back to the generic French message otherwise", () => {
    expect(consultantErrorMessage(new ApiError(500, "INTERNAL", "x"))).toBe(
      fr.consultants.saveError,
    );
    expect(consultantErrorMessage(new Error("net"))).toBe(
      fr.consultants.saveError,
    );
  });
});
