import { describe, expect, it } from "vitest";

import {
  allowedProposalTransitions,
  allowedTransitions,
} from "@/features/recruitment/pipeline";

describe("candidate pipeline state machine (mirror of backend ALLOWED_TRANSITIONS)", () => {
  it("offers INTERVIEW or REJECTED from APPLIED", () => {
    expect(allowedTransitions("APPLIED")).toEqual(["INTERVIEW", "REJECTED"]);
  });

  it("offers VALIDATED or REJECTED from INTERVIEW", () => {
    expect(allowedTransitions("INTERVIEW")).toEqual(["VALIDATED", "REJECTED"]);
  });

  it("offers only REJECTED from VALIDATED (HIRED is convert-only)", () => {
    expect(allowedTransitions("VALIDATED")).toEqual(["REJECTED"]);
  });

  it("offers nothing from terminal statuses", () => {
    expect(allowedTransitions("REJECTED")).toEqual([]);
    expect(allowedTransitions("HIRED")).toEqual([]);
  });

  it("never offers HIRED as a manual transition", () => {
    const everyTarget = (["APPLIED", "INTERVIEW", "VALIDATED", "REJECTED", "HIRED"] as const).flatMap(
      (s) => allowedTransitions(s),
    );
    expect(everyTarget).not.toContain("HIRED");
  });
});

describe("proposal state machine (mirror of backend ALLOWED_PROPOSAL_TRANSITIONS)", () => {
  it("offers SENT from DRAFT", () => {
    expect(allowedProposalTransitions("DRAFT")).toEqual(["SENT"]);
  });

  it("offers ACCEPTED or DECLINED from SENT", () => {
    expect(allowedProposalTransitions("SENT")).toEqual(["ACCEPTED", "DECLINED"]);
  });

  it("offers nothing from terminal statuses", () => {
    expect(allowedProposalTransitions("ACCEPTED")).toEqual([]);
    expect(allowedProposalTransitions("DECLINED")).toEqual([]);
  });

  it("never offers DRAFT as a manual transition", () => {
    const everyTarget = (["DRAFT", "SENT", "ACCEPTED", "DECLINED"] as const).flatMap(
      (s) => allowedProposalTransitions(s),
    );
    expect(everyTarget).not.toContain("DRAFT");
  });
});
