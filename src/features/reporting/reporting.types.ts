/**
 * Reporting DTOs — the frontend mirror of the backend `/api/reports/*` shapes.
 *
 * IMPORTANT: keep in sync with the backend reporting schemas. The reporting
 * enums below are distinct from the entity enums in `lib/types` (the reporting
 * endpoints expose their own aggregate status vocabularies).
 */

import type { ISODateString } from "@/lib/types";

// ---------------------------------------------------------------------------
// Reporting-specific status vocabularies
// ---------------------------------------------------------------------------

/** Consultant availability buckets used by occupancy/HR reports. */
export const REPORT_CONSULTANT_STATUSES = [
  "ON_MISSION",
  "INTERCONTRAT",
  "AVAILABLE",
] as const;
export type ReportConsultantStatus =
  (typeof REPORT_CONSULTANT_STATUSES)[number];

/** Recruitment funnel stages. */
export const PIPELINE_STAGES = [
  "APPLIED",
  "INTERVIEW",
  "VALIDATED",
  "REJECTED",
  "HIRED",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** Mission status buckets used by the missions report. */
export const REPORT_MISSION_STATUSES = [
  "DRAFT",
  "STAFFED",
  "IN_PROGRESS",
  "CLOSED",
  "ARCHIVED",
] as const;
export type ReportMissionStatus = (typeof REPORT_MISSION_STATUSES)[number];

/** Contract status buckets used by the HR report. */
export const REPORT_CONTRACT_STATUSES = [
  "DRAFT",
  "INTERNAL_VALIDATION",
  "PENDING_SIGNATURE",
  "SIGNED",
  "ARCHIVED",
] as const;
export type ReportContractStatus = (typeof REPORT_CONTRACT_STATUSES)[number];

// ---------------------------------------------------------------------------
// Report payloads
// ---------------------------------------------------------------------------

export interface OccupancyReport {
  globalAvgAllocationPct: number;
  consultantsByStatus: Record<ReportConsultantStatus, number>;
  totalConsultants: number;
  distribution: {
    full: number;
    partial: number;
    unassigned: number;
  };
}

export interface PipelineReport {
  from: ISODateString;
  to: ISODateString;
  funnel: Record<PipelineStage, number>;
  total: number;
}

export interface MissionsReport {
  from: ISODateString;
  to: ISODateString;
  byStatus: Record<ReportMissionStatus, number>;
  activeCount: number;
  forecastCount: number;
  avgDurationDays: number | null;
  totalMissions: number;
}

export interface HrReport {
  headcount: {
    total: number;
    byStatus: Record<ReportConsultantStatus, number>;
  };
  intercontratCount: number;
  contractsByStatus: Record<ReportContractStatus, number>;
}

/** Aggregate dashboard payload. `pipeline` + `hr` omitted for MANAGER. */
export interface SummaryReport {
  occupancy: OccupancyReport;
  missions: MissionsReport;
  pipeline?: PipelineReport;
  hr?: HrReport;
}

export interface OwnActiveMission {
  missionId: string;
  project: string;
  clientName: string;
  allocationPct: number;
  startDate: ISODateString;
  endDate: ISODateString | null;
}

export interface OwnDashboard {
  consultantId: string;
  activeAllocationPct: number;
  activeAssignmentsCount: number;
  activeMissions: OwnActiveMission[];
}

/** A from/to ISO date window for the windowed reports. */
export interface DateWindow {
  from: ISODateString;
  to: ISODateString;
}
