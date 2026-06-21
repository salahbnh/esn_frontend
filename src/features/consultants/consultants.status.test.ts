import { describe, expect, it } from "vitest";

import {
  ALLOWED_CONSULTANT_TRANSITIONS,
  allowedConsultantTransitions,
} from "@/features/consultants/consultants.status";
import { CONSULTANT_STATUSES } from "@/lib/types";

describe("consultant status state machine (mirror of backend ALLOWED_STATUS_TRANSITIONS)", () => {
  it("offers the two other statuses from AVAILABLE", () => {
    expect(allowedConsultantTransitions("AVAILABLE")).toEqual([
      "INTERCONTRAT",
      "ON_MISSION",
    ]);
  });

  it("offers the two other statuses from INTERCONTRAT", () => {
    expect(allowedConsultantTransitions("INTERCONTRAT")).toEqual([
      "AVAILABLE",
      "ON_MISSION",
    ]);
  });

  it("offers the two other statuses from ON_MISSION", () => {
    expect(allowedConsultantTransitions("ON_MISSION")).toEqual([
      "AVAILABLE",
      "INTERCONTRAT",
    ]);
  });

  it("has no terminal states — every status has transitions", () => {
    for (const status of CONSULTANT_STATUSES) {
      expect(allowedConsultantTransitions(status).length).toBeGreaterThan(0);
    }
  });

  it("never offers the current status as a target", () => {
    for (const status of CONSULTANT_STATUSES) {
      expect(ALLOWED_CONSULTANT_TRANSITIONS[status]).not.toContain(status);
    }
  });
});
