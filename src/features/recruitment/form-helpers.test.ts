import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  candidateErrorMessage,
  toConvertBody,
  toCreateBody,
  toUpdateBody,
} from "@/features/recruitment/form-helpers";

describe("toCreateBody", () => {
  it("trims required fields and drops empty optionals (never sends empty strings)", () => {
    const body = toCreateBody({
      firstName: "  Hugo ",
      lastName: "Martin",
      email: " hugo@x.io ",
      phone: "",
      source: "  ",
      targetPosition: "Dev",
      notes: "",
    });
    expect(body).toEqual({
      firstName: "Hugo",
      lastName: "Martin",
      email: "hugo@x.io",
      phone: undefined,
      source: undefined,
      targetPosition: "Dev",
      notes: undefined,
    });
  });
});

describe("toUpdateBody", () => {
  it("maps only provided values, blank → undefined (omitted on the wire)", () => {
    expect(toUpdateBody({ firstName: "A", phone: "" })).toEqual({
      firstName: "A",
      lastName: undefined,
      email: undefined,
      phone: undefined,
      source: undefined,
      targetPosition: undefined,
      notes: undefined,
    });
  });
});

describe("toConvertBody", () => {
  it("keeps position, drops blank optionals", () => {
    expect(
      toConvertBody({
        position: " Dev ",
        hireDate: "",
        tjm: "650.00",
        seniority: "",
        bio: "",
      }),
    ).toEqual({
      position: "Dev",
      hireDate: undefined,
      tjm: "650.00",
      seniority: undefined,
      bio: undefined,
    });
  });
});

describe("candidateErrorMessage (always French; never the backend's English message)", () => {
  it("maps a duplicate email (code in details, not top-level) to the French message", () => {
    const err = new ApiError(409, "CONFLICT", "A candidate with this email already exists", {
      code: "EMAIL_EXISTS",
    });
    expect(candidateErrorMessage(err)).toBe(fr.candidates.emailExists);
  });

  it("falls back to the generic French message for other API errors", () => {
    const err = new ApiError(500, "INTERNAL", "Internal server error");
    expect(candidateErrorMessage(err)).toBe(fr.candidates.saveError);
  });

  it("handles non-API errors with the generic French message", () => {
    expect(candidateErrorMessage(new Error("boom"))).toBe(fr.candidates.saveError);
  });
});
