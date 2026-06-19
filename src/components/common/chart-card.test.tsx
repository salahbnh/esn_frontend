import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Bar, BarChart } from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { fr } from "@/lib/i18n/fr";

const chart = (
  <BarChart data={[{ label: "A", value: 1 }]}>
    <Bar dataKey="value" />
  </BarChart>
);

describe("ChartCard", () => {
  it("renders its title and wraps the chart when it has data", () => {
    render(
      <ChartCard title="Missions par statut" isEmpty={false}>
        {chart}
      </ChartCard>,
    );
    expect(screen.getByText("Missions par statut")).toBeInTheDocument();
    // Empty state must NOT be shown when there is data.
    expect(screen.queryByText(fr.asyncStates.empty)).not.toBeInTheDocument();
  });

  it("shows the French empty state when isEmpty", () => {
    render(
      <ChartCard title="Missions par statut" isEmpty>
        {chart}
      </ChartCard>,
    );
    expect(screen.getByText("Missions par statut")).toBeInTheDocument();
    expect(screen.getByText(fr.asyncStates.empty)).toBeInTheDocument();
  });
});
