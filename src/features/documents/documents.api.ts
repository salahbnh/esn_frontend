/**
 * Typed Documents API — one function per `/api/documents` endpoint, bound to a
 * token-aware `apiClient`. Upload sends multipart `FormData` (via `postForm`);
 * downloads go through the authorized presigned-URL endpoint (never a direct key).
 */

import type { apiClient } from "@/lib/api-client";
import { buildUploadFormData } from "@/features/documents/form-helpers";
import type {
  DocumentMeta,
  DocumentMetaList,
  ListDocumentsQuery,
  PresignedUrl,
  UploadDocumentInput,
} from "@/features/documents/documents.types";

type Client = ReturnType<typeof apiClient>;

export function listDocuments(
  client: Client,
  query: ListDocumentsQuery,
): Promise<DocumentMetaList> {
  return client.get<DocumentMetaList>("/documents", {
    query: {
      entityType: query.entityType,
      entityId: query.entityId,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function uploadDocument(
  client: Client,
  input: UploadDocumentInput,
): Promise<DocumentMeta> {
  return client.postForm<DocumentMeta>("/documents/upload", buildUploadFormData(input));
}

export function getDocumentUrl(
  client: Client,
  id: string,
): Promise<PresignedUrl> {
  return client.get<PresignedUrl>(`/documents/${id}/url`);
}

export function deleteDocument(client: Client, id: string): Promise<void> {
  return client.del<void>(`/documents/${id}`);
}

export function restoreDocument(
  client: Client,
  id: string,
): Promise<{ restored: boolean }> {
  return client.post<{ restored: boolean }>(`/documents/${id}/restore`, {});
}
