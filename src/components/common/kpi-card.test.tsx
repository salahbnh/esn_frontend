import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KpiCard } from "@/components/common/kpi-card";

describe("KpiCard", () => {
  it("renders the label and value", () => {
    render(<KpiCard label="Taux d'occupation" value="82%" sub="42 consultants" />);
    expect(screen.getByText("Taux d'occupation")).toBeInTheDocument();
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("42 consultants")).toBeInTheDocument();
  });

  it("shows a skeleton (hides the value) while loading", () => {
    const { container } = render(
      <KpiCard label="Disponibles" value={12} loading />,
    );
    expect(screen.queryByText("12")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
