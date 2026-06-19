import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api-client";
import { Dashboard } from "@/features/reporting/dashboard";
import { fr } from "@/lib/i18n/fr";
import type {
  HrReport,
  MissionsReport,
  OccupancyReport,
  OwnDashboard,
  PipelineReport,
  SummaryReport,
} from "@/features/reporting/reporting.types";

// --- Mock the reporting hooks (no network / session needed). -----------------
const useSummary = vi.fn();
const useMyDashboard = vi.fn();

vi.mock("@/features/reporting/use-reporting", () => ({
  useSummary: () => useSummary(),
  useMyDashboard: () => useMyDashboard(),
}));

const occupancy: OccupancyReport = {
  globalAvgAllocationPct: 75,
  consultantsByStatus: { ON_MISSION: 8, INTERCONTRAT: 2, AVAILABLE: 3 },
  totalConsultants: 13,
  distribution: { full: 6, partial: 2, unassigned: 5 },
};

const missions: MissionsReport = {
  from: "2026-01-01",
  to: "2026-06-01",
  byStatus: { DRAFT: 1, STAFFED: 2, IN_PROGRESS: 4, CLOSED: 3, ARCHIVED: 0 },
  activeCount: 4,
  forecastCount: 2,
  avgDurationDays: 120,
  totalMissions: 10,
};

const pipeline: PipelineReport = {
  from: "2026-01-01",
  to: "2026-06-01",
  funnel: { APPLIED: 20, INTERVIEW: 10, VALIDATED: 5, REJECTED: 8, HIRED: 3 },
  total: 46,
};

const hr: HrReport = {
  headcount: { total: 13, byStatus: { ON_MISSION: 8, INTERCONTRAT: 2, AVAILABLE: 3 } },
  intercontratCount: 2,
  contractsByStatus: {
    DRAFT: 1,
    INTERNAL_VALIDATION: 1,
    PENDING_SIGNATURE: 0,
    SIGNED: 5,
    ARCHIVED: 2,
  },
};

function summarySuccess(data: SummaryReport) {
  return { isPending: false, isError: false, data, refetch: vi.fn() };
}

beforeEach(() => {
  useSummary.mockReset();
  useMyDashboard.mockReset();
});

describe("Dashboard role branching", () => {
  it("RH sees occupancy, missions, pipeline and HR blocks (4 sections)", () => {
    useSummary.mockReturnValue(
      summarySuccess({ occupancy, missions, pipeline, hr }),
    );
    render(<Dashboard role="RH" name="Alice" />);

    expect(screen.getByText(fr.reports.occupancyTitle)).toBeInTheDocument();
    expect(screen.getByText(fr.reports.missionsTitle)).toBeInTheDocument();
    expect(screen.getByText(fr.reports.pipelineTitle)).toBeInTheDocument();
    expect(screen.getByText(fr.reports.hrTitle)).toBeInTheDocument();
  });

  it("MANAGER sees only occupancy and missions (pipeline/HR omitted)", () => {
    useSummary.mockReturnValue(summarySuccess({ occupancy, missions }));
    render(<Dashboard role="MANAGER" name="Bob" />);

    expect(screen.getByText(fr.reports.occupancyTitle)).toBeInTheDocument();
    expect(screen.getByText(fr.reports.missionsTitle)).toBeInTheDocument();
    expect(screen.queryByText(fr.reports.pipelineTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(fr.reports.hrTitle)).not.toBeInTheDocument();
  });

  it("CONSULTANT sees the self-dashboard (own missions list)", () => {
    const me: OwnDashboard = {
      consultantId: "c1",
      activeAllocationPct: 80,
      activeAssignmentsCount: 1,
      activeMissions: [
        {
          missionId: "m1",
          project: "Refonte SI",
          clientName: "ACME",
          allocationPct: 80,
          startDate: "2026-01-01",
          endDate: null,
        },
      ],
    };
    useMyDashboard.mockReturnValue({
      isPending: false,
      isError: false,
      data: me,
      refetch: vi.fn(),
    });
    render(<Dashboard role="CONSULTANT" name="Carla" />);

    expect(screen.getByText(fr.dashboard.myMissions)).toBeInTheDocument();
    expect(screen.getByText("Refonte SI")).toBeInTheDocument();
    expect(screen.getByText("ACME")).toBeInTheDocument();
    // Staff-only section titles must be absent.
    expect(screen.queryByText(fr.reports.pipelineTitle)).not.toBeInTheDocument();
  });

  it("CONSULTANT without a profile (404) shows a graceful empty state", () => {
    useMyDashboard.mockReturnValue({
      isPending: false,
      isError: true,
      error: new ApiError(404, "NOT_FOUND", "Aucune fiche consultant"),
      refetch: vi.fn(),
    });
    render(<Dashboard role="CONSULTANT" name="Dan" />);
    expect(
      screen.getByText(fr.dashboard.noConsultantProfile),
    ).toBeInTheDocument();
  });
});
