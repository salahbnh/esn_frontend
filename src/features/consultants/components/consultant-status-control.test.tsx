import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConsultantStatusControl } from "@/features/consultants/components/consultant-status-control";

// The mutation hook pulls in next-auth + react-query; stub it.
vi.mock("@/features/consultants/use-consultants", () => ({
  useChangeConsultantStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe("ConsultantStatusControl", () => {
  it("renders the control with the heading + a disabled submit until a target is picked", () => {
    render(<ConsultantStatusControl consultantId="c1" status="AVAILABLE" />);
    expect(
      screen.getByRole("heading", { name: "Changer le statut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mettre à jour" }),
    ).toBeDisabled();
  });

  it("shows the staffing-automation hint", () => {
    render(<ConsultantStatusControl consultantId="c1" status="ON_MISSION" />);
    expect(
      screen.getByText(/mis à jour automatiquement par le module Affectations/),
    ).toBeInTheDocument();
  });
});
