"use client";

/**
 * TanStack Query hooks for the Documents endpoints. Lists are keyed by the owning
 * entity ref `(entityType, entityId)`. Mutations invalidate that ref's list.
 * Download is a one-shot (not a cached query): it fetches a short-lived presigned
 * URL on demand. Mirrors the earlier feature hook modules.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/documents/documents.api";
import type {
  DocumentRef,
  ListDocumentsQuery,
  UploadDocumentInput,
} from "@/features/documents/documents.types";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (ref: DocumentRef, page?: number) =>
    [...documentKeys.lists(), ref.entityType, ref.entityId, page ?? 1] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

export function useDocuments(ref: DocumentRef, page?: number) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(ref.entityId);
  const query: ListDocumentsQuery = {
    entityType: ref.entityType,
    entityId: ref.entityId,
    page,
  };
  return useQuery({
    queryKey: documentKeys.list(ref, page),
    queryFn: () => api.listDocuments(client, query),
    enabled,
  });
}

export function useUploadDocument() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadDocumentInput) => api.uploadDocument(client, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

/** One-shot: resolve a short-lived presigned URL for a document by id. */
export function useDocumentUrl() {
  const client = useApi();
  return useMutation({
    mutationFn: (id: string) => api.getDocumentUrl(client, id),
  });
}

export function useDeleteDocument() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteDocument(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

export function useRestoreDocument() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.restoreDocument(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
