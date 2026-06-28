/**
 * API contract types — the frontend mirror of the backend DTOs.
 *
 * IMPORTANT: keep in sync with the backend Zod schemas
 * (`backend/src/modules/<module>/<module>.schema.ts`). When the backend
 * contract changes, update these in the same change.
 *
 * Milestone 1 ships only the shared enums, the role type, and the list/error
 * envelopes. Per-module DTOs land with their feature.
 */

// ---------------------------------------------------------------------------
// Roles + status enums (string unions matching Keycloak + backend enums)
// ---------------------------------------------------------------------------

export const ROLES = ["RH", "MANAGER", "DIRECTION", "CONSULTANT"] as const;
export type Role = (typeof ROLES)[number];

/** Recruitment pipeline (matches backend Prisma `CandidateStatus`). */
export const CANDIDATE_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "VALIDATED",
  "REJECTED",
  "HIRED",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

/** Consultant availability (matches backend Prisma `ConsultantStatus`). */
export const CONSULTANT_STATUSES = [
  "INTERCONTRAT",
  "ON_MISSION",
  "AVAILABLE",
] as const;
export type ConsultantStatus = (typeof CONSULTANT_STATUSES)[number];

/** Mission lifecycle (matches backend Prisma `MissionStatus`). */
export const MISSION_STATUSES = [
  "DRAFT",
  "STAFFED",
  "IN_PROGRESS",
  "CLOSED",
  "ARCHIVED",
] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

/** Assignment (staffing) status (matches backend Prisma `AssignmentStatus`). */
export const ASSIGNMENT_STATUSES = [
  "PROPOSED",
  "CONFIRMED",
  "ACTIVE",
  "ENDED",
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

/** Contract lifecycle (matches backend Prisma `ContractStatus`). */
export const CONTRACT_STATUSES = [
  "DRAFT",
  "INTERNAL_VALIDATION",
  "PENDING_SIGNATURE",
  "SIGNED",
  "ARCHIVED",
] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

/** Contract validation workflow steps (RH → MANAGER → DIRECTION). */
export const CONTRACT_VALIDATION_STEPS = ["RH", "MANAGER", "DIRECTION"] as const;
export type ContractValidationStep =
  (typeof CONTRACT_VALIDATION_STEPS)[number];

/** Outcome of a contract validation step. */
export const CONTRACT_VALIDATION_STATES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;
export type ContractValidationState =
  (typeof CONTRACT_VALIDATION_STATES)[number];

export const DOCUMENT_TYPES = [
  "CV",
  "CONTRACT",
  "CONTRACT_AMENDMENT",
  "PROPOSAL",
  "MISSION_DOC",
  "OTHER",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const ENTITY_TYPES = [
  "CANDIDATE",
  "CONSULTANT",
  "CLIENT",
  "MISSION",
  "CONTRACT",
  "CONTRACT_TEMPLATE",
  "ASSIGNMENT",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// ---------------------------------------------------------------------------
// Envelopes
// ---------------------------------------------------------------------------

/** ISO-8601 timestamp string. */
export type ISODateString = string;

/** Backend list envelope: `{ data, page, pageSize, total }`. */
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Backend error envelope: `{ error: { code, message, details? } }`. */
export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
