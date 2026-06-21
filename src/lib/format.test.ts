import { describe, expect, it } from "vitest";

import { formatTJM, roleLabel, statusLabel } from "@/lib/format";

describe("statusLabel", () => {
  it("maps consultant statuses to French", () => {
    expect(statusLabel("consultant", "ON_MISSION")).toBe("En mission");
    expect(statusLabel("consultant", "INTERCONTRAT")).toBe("Intercontrat");
    expect(statusLabel("consultant", "AVAILABLE")).toBe("Disponible");
  });

  it("maps mission + contract statuses to French", () => {
    expect(statusLabel("mission", "IN_PROGRESS")).toBe("En cours");
    expect(statusLabel("contract", "INTERNAL_VALIDATION")).toBe(
      "Validation interne",
    );
  });
});

describe("roleLabel", () => {
  it("returns the French role name", () => {
    expect(roleLabel("RH")).toBe("Ressources humaines");
    expect(roleLabel("CONSULTANT")).toBe("Consultant");
  });
});

describe("formatTJM", () => {
  it("formats a decimal string as fr-FR EUR", () => {
    // Non-breaking spaces in fr-FR currency output — assert on the parts.
    const out = formatTJM("650.00");
    expect(out).toContain("650,00");
    expect(out).toContain("€");
  });

  it("returns a dash for empty input", () => {
    expect(formatTJM(null)).toBe("—");
    expect(formatTJM("")).toBe("—");
  });
});
