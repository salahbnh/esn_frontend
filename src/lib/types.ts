/**
 * API contract types — the frontend mirror of the backend DTOs.
 *
 * IMPORTANT: These MUST stay in sync with the backend Zod schemas
 * (`backend/src/modules/<module>/<module>.schema.ts`). There is no shared
 * workspace; the contract is kept in sync deliberately. When the backend
 * contract changes, update these types in the same change.
 *
 * Derived from docs/PRD.md, docs/architecture.md and docs/rbac-matrix.md.
 */

// ---------------------------------------------------------------------------
// Enums (string unions — match Keycloak roles + backend status enums)
// ---------------------------------------------------------------------------

export const ROLES = ["RH", "MANAGER", "DIRECTION", "CONSULTANT"] as const;
export type Role = (typeof ROLES)[number];

/** Recruitment pipeline: application → interview → validation. */
export const CANDIDATE_STATUSES = [
  "APPLICATION",
  "INTERVIEW",
  "VALIDATED",
  "REJECTED",
  "CONVERTED",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

/** Consultant availability: intercontrat / on mission / available. */
export const CONSULTANT_STATUSES = [
  "INTERCONTRACT",
  "ON_MISSION",
  "AVAILABLE",
] as const;
export type ConsultantStatus = (typeof CONSULTANT_STATUSES)[number];

/** Mission lifecycle: create → assign → validate → start → in-progress → close. */
export const MISSION_STATUSES = [
  "DRAFT",
  "ASSIGNED",
  "VALIDATED",
  "IN_PROGRESS",
  "CLOSED",
  "ARCHIVED",
] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

/** Contract internal validation workflow: RH → MANAGER → DIRECTION. */
export const CONTRACT_STATUSES = [
  "DRAFT",
  "PENDING_RH",
  "PENDING_MANAGER",
  "PENDING_DIRECTION",
  "VALIDATED",
  "SENT",
  "SIGNED",
  "ARCHIVED",
] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const DOCUMENT_TYPES = [
  "CV",
  "CONTRACT",
  "AMENDMENT",
  "OTHER",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// ---------------------------------------------------------------------------
// Entity shapes (a subset — the foundation; extend per-module as built)
// ---------------------------------------------------------------------------

/** ISO-8601 timestamp string (e.g. "2026-06-15T10:00:00.000Z"). */
export type ISODateString = string;

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  status: CandidateStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Consultant {
  id: string;
  /** Keycloak-linked application user; null until provisioned. */
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  skills: string[];
  status: ConsultantStatus;
  /** Tarif Journalier Moyen (daily rate), in EUR. */
  tjm?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Mission {
  id: string;
  clientName: string;
  title: string;
  role?: string;
  requiredSkills: string[];
  startDate: ISODateString;
  endDate?: ISODateString;
  tjm?: number;
  status: MissionStatus;
  /** Consultant currently assigned, if any. */
  assignedConsultantId?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Contract {
  id: string;
  consultantId: string;
  templateId?: string;
  status: ContractStatus;
  /** Storage key of the generated/signed PDF in MinIO, once available. */
  pdfStorageKey?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  /** Object key in MinIO / S3-compatible storage. */
  storageKey: string;
  /** Entity this document is attached to (e.g. a consultant or contract id). */
  entityId: string;
  entityType: "CONSULTANT" | "CONTRACT" | "CANDIDATE" | "MISSION";
  uploadedBy: string;
  createdAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Error contract — backend returns `{ error: { code, message } }` on non-2xx.
// ---------------------------------------------------------------------------

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
  };
}
