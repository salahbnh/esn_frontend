/**
 * Missions DTOs — frontend mirror of `backend/src/modules/missions/*` + the
 * Prisma models. `tjm` and the client contact fields are optional/nullable
 * because the backend REDACTS them for a CONSULTANT's own-assigned read.
 */

import type {
  ISODateString,
  MissionStatus,
  PaginatedResult,
} from "@/lib/types";
import type { Skill } from "@/features/recruitment/recruitment.types";

/** Client summary embedded in a mission list item. */
export interface MissionClientSummary {
  id: string;
  name: string;
}

/** Full client embedded in mission detail (contact redacted for CONSULTANT). */
export interface MissionClientDetail {
  id: string;
  name: string;
  industry: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
}

export interface MissionListItem {
  id: string;
  clientId: string;
  project: string;
  role: string;
  description: string | null;
  startDate: ISODateString;
  endDate: ISODateString | null;
  tjm: string; // decimal string (never redacted on the staff list)
  status: MissionStatus;
  archivedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  client: MissionClientSummary;
  _assignmentCount: number; // ACTIVE assignments
}

export interface MissionDetail {
  id: string;
  clientId: string;
  project: string;
  role: string;
  description: string | null;
  startDate: ISODateString;
  endDate: ISODateString | null;
  tjm: string | null; // null/undefined when redacted (CONSULTANT)
  status: MissionStatus;
  archivedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  client: MissionClientDetail;
  requiredSkills: Skill[];
  _activeAssignmentCount: number;
  _totalAssignmentCount: number;
  _amendmentCount: number;
}

export interface MissionAmendment {
  id: string;
  missionId: string;
  reason: string;
  changes: Record<string, unknown>;
  effectiveDate: ISODateString;
  authorId: string;
  createdAt: ISODateString;
}

// --- Request bodies --------------------------------------------------------

export interface CreateMissionBody {
  clientId: string;
  project: string;
  role: string;
  description?: string;
  startDate: string; // ISO datetime (expanded from a date input)
  endDate?: string;
  tjm: string;
  requiredSkillIds?: string[]; // deferred — sent [] / omitted
}

export type UpdateMissionBody = Partial<CreateMissionBody>;

export interface MissionStatusChangeBody {
  status: Exclude<MissionStatus, "ARCHIVED">;
  comment?: string;
}

export interface CreateAmendmentBody {
  reason: string;
  changes: Record<string, unknown>;
  effectiveDate: string; // ISO datetime
}

// --- Query params + envelopes ----------------------------------------------

export interface ListMissionsQuery {
  status?: MissionStatus;
  clientId?: string;
  search?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
  // skillId: deferred (no /api/skills endpoint)
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type MissionList = PaginatedResult<MissionListItem>;
export type AmendmentList = PaginatedResult<MissionAmendment>;
