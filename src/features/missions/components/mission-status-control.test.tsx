import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MissionStatusControl } from "@/features/missions/components/mission-status-control";

vi.mock("@/features/missions/use-missions", () => ({
  useChangeMissionStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe("MissionStatusControl", () => {
  it("shows a muted note (no control) for a terminal status", () => {
    render(<MissionStatusControl missionId="m1" status="CLOSED" />);
    expect(
      screen.getByText("Aucune transition disponible pour ce statut."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Changer le statut" }),
    ).not.toBeInTheDocument();
  });

  it("renders the control for a non-terminal status, submit disabled until a target is picked", () => {
    render(<MissionStatusControl missionId="m1" status="DRAFT" />);
    expect(
      screen.getByRole("heading", { name: "Changer le statut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mettre à jour" }),
    ).toBeDisabled();
  });
});
