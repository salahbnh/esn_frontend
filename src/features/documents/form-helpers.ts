/**
 * Upload payload building + client-side guards + French error messaging for the
 * Documents module. The server re-validates mime/size and remains the authority;
 * these checks are for instant UX feedback only. Error messages key off
 * `details.code`.
 */

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import type { DocumentType } from "@/lib/types";
import type { UploadDocumentInput } from "@/features/documents/documents.types";

export const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB — mirrors the backend cap.

const PDF = "application/pdf";
const DOC = "application/msword";
const DOCX =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLS = "application/vnd.ms-excel";
const XLSX =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const PNG = "image/png";
const JPEG = "image/jpeg";

/** Mirror of the backend `MIME_ALLOWLIST` (DocumentType → accepted mime types). */
export const MIME_ALLOWLIST: Record<DocumentType, string[]> = {
  CV: [PDF, DOC, DOCX],
  CONTRACT: [PDF],
  CONTRACT_AMENDMENT: [PDF],
  PROPOSAL: [PDF],
  MISSION_DOC: [PDF, DOC, DOCX, XLS, XLSX],
  OTHER: [PDF, DOC, DOCX, PNG, JPEG],
};

const EXT_BY_MIME: Record<string, string> = {
  [PDF]: ".pdf",
  [DOC]: ".doc",
  [DOCX]: ".docx",
  [XLS]: ".xls",
  [XLSX]: ".xlsx",
  [PNG]: ".png",
  [JPEG]: ".jpg,.jpeg",
};

/** The `accept` attribute for a file input, given the chosen document type. */
export function acceptFor(type: DocumentType): string {
  return MIME_ALLOWLIST[type].map((m) => EXT_BY_MIME[m] ?? "").join(",");
}

/** Client-side guard. Returns an error `code` or `null` when the file is OK. */
export function validateFile(
  type: DocumentType,
  file: File | undefined | null,
): "NO_FILE" | "BAD_MIME" | "FILE_TOO_LARGE" | null {
  if (!file) return "NO_FILE";
  if (file.size > MAX_SIZE_BYTES) return "FILE_TOO_LARGE";
  // Some browsers send an empty mime for .doc/.xls — defer those to the server.
  if (file.type && !MIME_ALLOWLIST[type].includes(file.type)) return "BAD_MIME";
  return null;
}

export function buildUploadFormData(input: UploadDocumentInput): FormData {
  const form = new FormData();
  form.append("file", input.file);
  form.append("type", input.type);
  form.append("entityType", input.entityType);
  form.append("entityId", input.entityId);
  return form;
}

/** Bytes → a short human label (o / Ko / Mo). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function detailCode(err: unknown): string | undefined {
  if (err instanceof ApiError && typeof err.details === "object" && err.details !== null) {
    return (err.details as { code?: unknown }).code as string | undefined;
  }
  return undefined;
}

/** Always French — maps the documents error codes (incl. the local guard codes). */
export function documentErrorMessage(err: unknown): string {
  const code = err instanceof ApiError ? detailCode(err) ?? err.code : codeFromString(err);
  switch (code) {
    case "BAD_MIME":
      return fr.documents.errBadMime;
    case "FILE_TOO_LARGE":
      return fr.documents.errTooLarge;
    case "NO_FILE":
      return fr.documents.errNoFile;
    default:
      return fr.documents.saveError;
  }
}

/** Allows passing a bare guard code string straight to the message mapper. */
function codeFromString(err: unknown): string | undefined {
  return typeof err === "string" ? err : undefined;
}
