/**
 * Consultants DTOs — frontend mirror of the backend shapes in
 * `backend/src/modules/consultants/*` and the Prisma models. Keep in sync with
 * the backend when the contract changes.
 */

import type {
  AssignmentStatus,
  ConsultantStatus,
  ISODateString,
  PaginatedResult,
} from "@/lib/types";
import type { Skill } from "@/features/recruitment/recruitment.types";

export interface ConsultantUser {
  firstName: string;
  lastName: string;
  email: string;
}

/** `GET /` list item (no `_assignmentCount`, no documents — those are detail-only). */
export interface ConsultantListItem {
  id: string;
  userId: string;
  position: string;
  tjm: string | null; // Prisma Decimal serialised as string
  status: ConsultantStatus;
  hireDate: ISODateString | null;
  availabilityDate: ISODateString | null;
  seniority: string | null;
  bio: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  user: ConsultantUser;
  skills: Skill[];
}

/** Document metadata (storageKey is NEVER present). */
export interface DocumentMeta {
  id: string;
  type: string; // DocumentType
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: ISODateString;
}

/** `GET /:id` and `GET /me` — list item + active-assignment count + documents. */
export interface ConsultantDetail extends ConsultantListItem {
  _assignmentCount: number;
  documents: DocumentMeta[];
}

export interface OwnAssignmentMission {
  id: string;
  project: string;
  status: string;
  client: { name: string };
}

/** `GET /me/assignments` item. */
export interface OwnAssignment {
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
  mission: OwnAssignmentMission;
}

// --- Request bodies (mirror backend Zod) -----------------------------------

export interface AdminUpdateConsultantBody {
  position?: string;
  tjm?: string; // decimal string e.g. "650.00"
  seniority?: string;
  bio?: string;
  availabilityDate?: string; // full ISO datetime (expanded from a date input)
  skillIds?: string[]; // deferred — no picker yet
}

export interface SelfEditProfileBody {
  bio?: string;
  seniority?: string;
  skillIds?: string[]; // deferred
}

export interface StatusChangeBody {
  status: ConsultantStatus;
  comment?: string;
}

// --- Query params ----------------------------------------------------------

export interface ListConsultantsQuery {
  status?: ConsultantStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  // skillId: deferred (no /api/skills endpoint yet)
}

export interface OwnAssignmentsQuery {
  status?: AssignmentStatus;
  page?: number;
  pageSize?: number;
}

// --- List envelopes --------------------------------------------------------

export type ConsultantList = PaginatedResult<ConsultantListItem>;
export type OwnAssignmentList = PaginatedResult<OwnAssignment>;
export type DocumentMetaList = PaginatedResult<DocumentMeta>;
