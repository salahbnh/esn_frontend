/**
 * Staffing (Affectations) DTOs — frontend mirror of `backend/src/modules/staffing/*`.
 * The detail/list selects deliberately carry no PII beyond consultant first/last name.
 */

import type {
  AssignmentStatus,
  ConsultantStatus,
  ISODateString,
  MissionStatus,
  PaginatedResult,
} from "@/lib/types";
import type { Skill } from "@/features/recruitment/recruitment.types";

export interface AssignmentMissionSummary {
  id: string;
  project: string;
  status: MissionStatus;
  client: { name: string };
}

export interface AssignmentConsultantSummary {
  id: string;
  status: ConsultantStatus;
  user: { firstName: string; lastName: string };
}

/** Assignment list item & detail share this shape (`DETAIL_INCLUDE`). */
export interface Assignment {
  id: string;
  missionId: string;
  consultantId: string;
  roleOnMission: string | null;
  startDate: ISODateString;
  endDate: ISODateString | null;
  allocationPct: number;
  status: AssignmentStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  mission: AssignmentMissionSummary;
  consultant: AssignmentConsultantSummary;
}

/** `GET /occupancy/:consultantId`. */
export interface ConsultantOccupancy {
  consultantId: string;
  totalAllocationPct: number;
  activeAssignments: Array<{
    id: string;
    missionId: string;
    allocationPct: number;
  }>;
}

/** `GET /occupancy` item. */
export interface GlobalOccupancyItem {
  consultant: { id: string; name: string };
  totalAllocationPct: number;
  assignmentCount: number;
}

/** `GET /suggestions?missionId=` item (AVAILABLE consultants with overlapping skills). */
export interface Suggestion {
  consultant: {
    id: string;
    status: ConsultantStatus;
    firstName: string;
    lastName: string;
  };
  matchCount: number;
  currentAllocationPct: number;
  matchedSkills: Skill[];
}

// --- Request bodies --------------------------------------------------------

export interface CreateAssignmentBody {
  missionId: string;
  consultantId: string;
  roleOnMission?: string;
  startDate: string; // ISO datetime (expanded from a date input)
  endDate?: string;
  allocationPct: number; // 1–100
}

export interface UpdateAssignmentBody {
  roleOnMission?: string;
  startDate?: string;
  endDate?: string;
  allocationPct?: number;
  force?: boolean; // override over-allocation when raising an ACTIVE allocation
}

export interface AssignmentStatusChangeBody {
  status: AssignmentStatus;
  comment?: string;
  force?: boolean; // override the over-allocation guard on → ACTIVE
}

// --- Query params + envelopes ----------------------------------------------

export interface ListAssignmentsQuery {
  missionId?: string;
  consultantId?: string;
  status?: AssignmentStatus;
  page?: number;
  pageSize?: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type AssignmentList = PaginatedResult<Assignment>;
export type GlobalOccupancyList = PaginatedResult<GlobalOccupancyItem>;
export type SuggestionList = PaginatedResult<Suggestion>;
