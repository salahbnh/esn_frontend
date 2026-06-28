/**
 * UX mirror of the backend documents authorization matrix
 * (`backend/src/modules/documents/documents.access.ts`). Used ONLY to hide
 * buttons / filter type options — the server re-checks everything and remains
 * the authority. Ownership (CONSULTANT-own) cannot be decided here, so callers
 * pass an `isOwner` flag for CONSULTANT contexts.
 */

import { DOCUMENT_TYPES, type DocumentType, type EntityType, type Role } from "@/lib/types";

const UPLOAD_MATRIX: Record<EntityType, Role[]> = {
  CANDIDATE: ["RH", "DIRECTION"],
  CONSULTANT: ["RH", "DIRECTION", "CONSULTANT"],
  CONTRACT: ["RH", "DIRECTION"],
  CONTRACT_TEMPLATE: ["RH", "DIRECTION"],
  MISSION: ["MANAGER", "DIRECTION"],
  ASSIGNMENT: ["MANAGER", "DIRECTION"],
  CLIENT: ["RH", "MANAGER", "DIRECTION"],
};

const DOWNLOAD_MATRIX: Record<EntityType, Role[]> = {
  CANDIDATE: ["RH", "DIRECTION", "MANAGER"],
  CONSULTANT: ["RH", "DIRECTION", "MANAGER", "CONSULTANT"],
  CONTRACT: ["RH", "DIRECTION", "MANAGER", "CONSULTANT"],
  CONTRACT_TEMPLATE: ["RH", "DIRECTION"],
  MISSION: ["RH", "DIRECTION", "MANAGER", "CONSULTANT"],
  ASSIGNMENT: ["RH", "DIRECTION", "MANAGER", "CONSULTANT"],
  CLIENT: ["RH", "DIRECTION", "MANAGER"],
};

/** Document types a CONSULTANT may upload to their OWN profile. */
export const CONSULTANT_SELF_UPLOAD_TYPES: DocumentType[] = ["CV", "OTHER"];

/**
 * Whether `role` may upload to `entityType`. For CONSULTANT, only their own
 * CONSULTANT profile and only CV/OTHER — pass `isOwner` (defaults to false).
 */
export function canUploadTo(
  role: Role | null | undefined,
  entityType: EntityType,
  isOwner = false,
): boolean {
  if (!role) return false;
  if (!UPLOAD_MATRIX[entityType].includes(role)) return false;
  if (role === "CONSULTANT") {
    return entityType === "CONSULTANT" && isOwner;
  }
  return true;
}

/** The document types selectable in the upload dialog for this role. */
export function allowedUploadTypes(
  role: Role | null | undefined,
): readonly DocumentType[] {
  if (role === "CONSULTANT") return CONSULTANT_SELF_UPLOAD_TYPES;
  return DOCUMENT_TYPES;
}

/** Whether `role` may see/list documents of `entityType` (ownership aside). */
export function canDownloadFrom(
  role: Role | null | undefined,
  entityType: EntityType,
): boolean {
  if (!role) return false;
  return DOWNLOAD_MATRIX[entityType].includes(role);
}

/** Delete/restore is RH + DIRECTION only — no ownership exception. */
export function canDeleteDoc(role: Role | null | undefined): boolean {
  return role === "RH" || role === "DIRECTION";
}
