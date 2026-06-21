import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StatusTransition } from "@/features/recruitment/components/status-transition";

// The mutation hook pulls in next-auth + react-query; stub it.
vi.mock("@/features/recruitment/use-recruitment", () => ({
  useTransitionStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe("StatusTransition", () => {
  it("shows a muted note (no control) for a terminal status", () => {
    render(<StatusTransition candidateId="c1" status="REJECTED" />);
    expect(
      screen.getByText("Aucune transition disponible pour ce statut."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Changer le statut" }),
    ).not.toBeInTheDocument();
  });

  it("renders the transition control for a non-terminal status, submit disabled until a target is picked", () => {
    render(<StatusTransition candidateId="c1" status="APPLIED" />);
    expect(
      screen.getByRole("heading", { name: "Changer le statut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mettre à jour" }),
    ).toBeDisabled();
  });
});
