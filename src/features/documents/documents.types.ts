/**
 * Documents DTOs — frontend mirror of `backend/src/modules/documents/*`.
 * The response NEVER carries `storageKey`; do not add it here.
 */

import type {
  DocumentType,
  EntityType,
  ISODateString,
  PaginatedResult,
} from "@/lib/types";

/** A polymorphic document target (the owning entity). */
export interface DocumentRef {
  entityType: EntityType;
  entityId: string;
}

/** Document metadata — exactly what the API returns (no `storageKey`). */
export interface DocumentMeta {
  id: string;
  type: DocumentType;
  entityType: EntityType;
  entityId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedById: string | null; // null for public (anonymous) portal uploads
  createdAt: ISODateString;
}

/** `GET /documents/:id/url` — short-lived presigned GET URL. */
export interface PresignedUrl {
  url: string;
  expiresAt: ISODateString;
}

// --- Request inputs --------------------------------------------------------

export interface UploadDocumentInput {
  file: File;
  type: DocumentType;
  entityType: EntityType;
  entityId: string;
}

export interface ListDocumentsQuery {
  entityType: EntityType;
  entityId: string;
  page?: number;
  pageSize?: number;
}

export type DocumentMetaList = PaginatedResult<DocumentMeta>;
