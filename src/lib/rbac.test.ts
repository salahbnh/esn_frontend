import { describe, expect, it } from "vitest";

import { navForRole } from "@/lib/rbac";

describe("navForRole", () => {
  it("gives a consultant only the self-service space + dashboard", () => {
    const sections = navForRole("CONSULTANT");
    const hrefs = sections.flatMap((s) => s.items.map((i) => i.href));
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/me");
    expect(hrefs).not.toContain("/candidates");
    expect(hrefs).not.toContain("/missions");
  });

  it("gives RH recruitment + consultants but not staffing", () => {
    const hrefs = navForRole("RH")
      .flatMap((s) => s.items)
      .map((i) => i.href);
    expect(hrefs).toContain("/candidates");
    expect(hrefs).toContain("/consultants");
    expect(hrefs).not.toContain("/staffing");
  });

  it("shows nothing for an unauthenticated (null) role", () => {
    expect(navForRole(null)).toHaveLength(0);
  });
});
