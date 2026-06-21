/**
 * Recruitment (ATS) DTOs — frontend mirror of the backend Zod/Prisma shapes in
 * `backend/src/modules/recruitment/recruitment.schema.ts` and the Prisma models.
 * Keep in sync with the backend when the contract changes.
 */

import type {
  CandidateStatus,
  ISODateString,
  PaginatedResult,
} from "@/lib/types";

export type InteractionType = "CALL" | "EMAIL" | "INTERVIEW" | "NOTE";
export type ProposalStatus = "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED";

/** Bare Candidate model (no relations) — returned by list + mutations. */
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  source: string | null;
  targetPosition: string | null;
  notes: string | null;
  status: CandidateStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Referential skill (read-only here; no skills endpoint yet). */
export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface CandidateInteraction {
  id: string;
  candidateId: string;
  type: InteractionType;
  occurredAt: ISODateString;
  summary: string;
  authorId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CandidateEvaluation {
  id: string;
  candidateId: string;
  evaluatorId: string;
  criteria: Record<string, number>;
  overallScore: number;
  recommendation: string | null;
  comment: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Proposal {
  id: string;
  candidateId: string;
  status: ProposalStatus;
  content: Record<string, unknown>;
  documentId: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Detail shape: Candidate + included relations (`GET /candidates/:id`). */
export interface CandidateDetail extends Candidate {
  skills: Skill[];
  interactions: CandidateInteraction[];
  evaluations: CandidateEvaluation[];
  proposals: Proposal[];
}

/** Consultant created by `/convert` (subset we rely on). */
export interface Consultant {
  id: string;
  userId: string;
  position: string;
  tjm: string | null; // Prisma Decimal serialised as string
  status: string;
  hireDate: ISODateString | null;
  seniority: string | null;
  bio: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ConversionResult {
  candidate: Candidate;
  consultant: Consultant;
}

// --- Request bodies (mirror backend Zod) -----------------------------------

export interface CreateCandidateBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  targetPosition?: string;
  notes?: string;
  // skillIds deferred — no /api/skills endpoint yet.
}

export type UpdateCandidateBody = Partial<CreateCandidateBody>;

export interface StatusTransitionBody {
  status: Exclude<CandidateStatus, "HIRED">;
  comment?: string;
}

export interface CreateInteractionBody {
  type: InteractionType;
  occurredAt: string; // full ISO datetime (expanded from a date input)
  summary: string;
}

export interface CreateEvaluationBody {
  criteria: Record<string, number>;
  overallScore: number;
  recommendation?: string;
  comment?: string;
}

export interface CreateProposalBody {
  content: Record<string, unknown>;
}

export interface UpdateProposalStatusBody {
  status: Exclude<ProposalStatus, "DRAFT">;
}

export interface ConvertCandidateBody {
  position: string;
  hireDate?: string; // full ISO datetime
  tjm?: string; // decimal string e.g. "650.00"
  seniority?: string;
  bio?: string;
  // skillIds deferred.
}

// --- Query params + list envelopes -----------------------------------------

export interface ListCandidatesQuery {
  status?: CandidateStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type CandidateList = PaginatedResult<Candidate>;
export type InteractionList = PaginatedResult<CandidateInteraction>;
export type EvaluationList = PaginatedResult<CandidateEvaluation>;
export type ProposalList = PaginatedResult<Proposal>;
