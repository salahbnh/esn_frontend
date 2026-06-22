import { describe, expect, it } from "vitest";

import {
  ALLOWED_ASSIGNMENT_TRANSITIONS,
  allowedAssignmentTransitions,
} from "@/features/staffing/staffing.status";
import { ASSIGNMENT_STATUSES } from "@/lib/types";

describe("assignment status state machine (mirror of backend ALLOWED_STATUS_TRANSITIONS)", () => {
  it("PROPOSED can only go to CONFIRMED", () => {
    expect(allowedAssignmentTransitions("PROPOSED")).toEqual(["CONFIRMED"]);
  });

  it("CONFIRMED can advance to ACTIVE or revert to PROPOSED", () => {
    expect(allowedAssignmentTransitions("CONFIRMED")).toEqual([
      "ACTIVE",
      "PROPOSED",
    ]);
  });

  it("ACTIVE can only go to ENDED", () => {
    expect(allowedAssignmentTransitions("ACTIVE")).toEqual(["ENDED"]);
  });

  it("ENDED is terminal", () => {
    expect(allowedAssignmentTransitions("ENDED")).toEqual([]);
  });

  it("never offers the current status as a target", () => {
    for (const status of ASSIGNMENT_STATUSES) {
      expect(ALLOWED_ASSIGNMENT_TRANSITIONS[status]).not.toContain(status);
    }
  });
});
