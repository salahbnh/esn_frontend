import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AssignmentStatusControl } from "@/features/staffing/components/assignment-status-control";

vi.mock("@/features/staffing/use-staffing", () => ({
  useChangeAssignmentStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe("AssignmentStatusControl", () => {
  it("shows a muted note (no control) for the terminal ENDED status", () => {
    render(<AssignmentStatusControl assignmentId="a1" status="ENDED" />);
    expect(
      screen.getByText("Aucune transition disponible pour ce statut."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Changer le statut" }),
    ).not.toBeInTheDocument();
  });

  it("renders the control for a non-terminal status, submit disabled until a target is picked", () => {
    render(<AssignmentStatusControl assignmentId="a1" status="PROPOSED" />);
    expect(
      screen.getByRole("heading", { name: "Changer le statut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mettre à jour" }),
    ).toBeDisabled();
  });
});
