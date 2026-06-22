import { describe, expect, it } from "vitest";

import {
  ALLOWED_MISSION_TRANSITIONS,
  allowedMissionTransitions,
} from "@/features/missions/missions.status";
import { MISSION_STATUSES } from "@/lib/types";

describe("mission status state machine (mirror of backend ALLOWED_STATUS_TRANSITIONS)", () => {
  it("DRAFT can only go to STAFFED (no DRAFT→IN_PROGRESS shortcut)", () => {
    expect(allowedMissionTransitions("DRAFT")).toEqual(["STAFFED"]);
    expect(allowedMissionTransitions("DRAFT")).not.toContain("IN_PROGRESS");
  });

  it("STAFFED can advance to IN_PROGRESS or revert to DRAFT", () => {
    expect(allowedMissionTransitions("STAFFED")).toEqual([
      "IN_PROGRESS",
      "DRAFT",
    ]);
  });

  it("IN_PROGRESS can only go to CLOSED", () => {
    expect(allowedMissionTransitions("IN_PROGRESS")).toEqual(["CLOSED"]);
  });

  it("CLOSED and ARCHIVED are terminal", () => {
    expect(allowedMissionTransitions("CLOSED")).toEqual([]);
    expect(allowedMissionTransitions("ARCHIVED")).toEqual([]);
  });

  it("never offers ARCHIVED as a manual /status transition (it is /archive-only)", () => {
    const everyTarget = MISSION_STATUSES.flatMap((s) =>
      allowedMissionTransitions(s),
    );
    expect(everyTarget).not.toContain("ARCHIVED");
  });

  it("never offers the current status as a target", () => {
    for (const status of MISSION_STATUSES) {
      expect(ALLOWED_MISSION_TRANSITIONS[status]).not.toContain(status);
    }
  });
});
