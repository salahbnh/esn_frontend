import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/format";

describe("Badge + statusLabel", () => {
  it("renders a French status label inside a badge", () => {
    render(<Badge>{statusLabel("consultant", "ON_MISSION")}</Badge>);
    expect(screen.getByText("En mission")).toBeInTheDocument();
  });
});
