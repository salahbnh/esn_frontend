import { describe, expect, it } from "vitest";

import { toISODatetime } from "@/features/recruitment/recruitment.api";
import { recruitmentKeys } from "@/features/recruitment/use-recruitment";
import { CANDIDATE_STATUSES } from "@/lib/types";

describe("toISODatetime", () => {
  it("expands a date-only string to a full UTC datetime", () => {
    expect(toISODatetime("2026-06-19")).toBe("2026-06-19T00:00:00.000Z");
  });

  it("passes through a value that is already a datetime", () => {
    const iso = "2026-06-19T09:30:00.000Z";
    expect(toISODatetime(iso)).toBe(iso);
  });
});

describe("recruitmentKeys", () => {
  it("nests detail/interactions/evaluations/proposals under the candidate root", () => {
    // Invalidating a parent key must also match its children, so the prefixes
    // must line up. `lists()` and `detail()` both descend from `all`.
    expect(recruitmentKeys.all).toEqual(["candidates"]);
    expect(recruitmentKeys.lists()).toEqual(["candidates", "list"]);
    expect(recruitmentKeys.detail("c1")).toEqual([
      "candidates",
      "detail",
      "c1",
    ]);
    expect(recruitmentKeys.interactions("c1")).toEqual([
      "candidates",
      "c1",
      "interactions",
    ]);
    expect(recruitmentKeys.evaluations("c1")).toEqual([
      "candidates",
      "c1",
      "evaluations",
    ]);
    expect(recruitmentKeys.proposals("c1")).toEqual([
      "candidates",
      "c1",
      "proposals",
    ]);
  });

  it("keys a list by its query object", () => {
    const q = { status: "APPLIED" as const, page: 2 };
    expect(recruitmentKeys.list(q)).toEqual(["candidates", "list", q]);
  });
});

describe("CANDIDATE_STATUSES (backend enum parity — regression for the drift fix)", () => {
  it("matches the backend Prisma CandidateStatus values exactly", () => {
    expect([...CANDIDATE_STATUSES]).toEqual([
      "APPLIED",
      "INTERVIEW",
      "VALIDATED",
      "REJECTED",
      "HIRED",
    ]);
  });
});
