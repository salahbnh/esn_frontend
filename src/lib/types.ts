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

/** Recruitment pipeline. */
export const CANDIDATE_STATUSES = [
  "APPLICATION",
  "INTERVIEW",
  "VALIDATED",
  "REJECTED",
  "CONVERTED",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

/** Consultant availability. */
export const CONSULTANT_STATUSES = [
  "INTERCONTRACT",
  "ON_MISSION",
  "AVAILABLE",
] as const;
export type ConsultantStatus = (typeof CONSULTANT_STATUSES)[number];

/** Mission lifecycle. */
export const MISSION_STATUSES = [
  "DRAFT",
  "ASSIGNED",
  "VALIDATED",
  "IN_PROGRESS",
  "CLOSED",
  "ARCHIVED",
] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

/** Assignment (staffing) status. */
export const ASSIGNMENT_STATUSES = [
  "PROPOSED",
  "ACTIVE",
  "ENDED",
  "CANCELLED",
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

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
