"use client";

/**
 * TanStack Query hooks for the consultants endpoints. Queries read the auth'd
 * client from `useApi()` and are gated on `useApiReady()` (avoids the token race
 * that shows a spurious error on first load). Mutations invalidate the relevant
 * keys on success. Mirrors `use-recruitment.ts`.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/consultants/consultants.api";
import type {
  AdminUpdateConsultantBody,
  ListConsultantsQuery,
  OwnAssignmentsQuery,
  SelfEditProfileBody,
  StatusChangeBody,
} from "@/features/consultants/consultants.types";

export const consultantKeys = {
  all: ["consultants"] as const,
  lists: () => [...consultantKeys.all, "list"] as const,
  list: (q: ListConsultantsQuery) => [...consultantKeys.lists(), q] as const,
  detail: (id: string) => [...consultantKeys.all, "detail", id] as const,
  documents: (id: string) => [...consultantKeys.all, id, "documents"] as const,
  me: () => [...consultantKeys.all, "me"] as const,
  myAssignments: (q: OwnAssignmentsQuery) =>
    [...consultantKeys.all, "me", "assignments", q] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

// --- Staff queries ---------------------------------------------------------

export function useConsultants(query: ListConsultantsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: consultantKeys.list(query),
    queryFn: () => api.listConsultants(client, query),
    enabled,
  });
}

export function useConsultant(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: consultantKeys.detail(id),
    queryFn: () => api.getConsultant(client, id),
    enabled,
  });
}

export function useConsultantDocuments(id: string, page?: number) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: [...consultantKeys.documents(id), page ?? 1],
    queryFn: () => api.listConsultantDocuments(client, id, { page }),
    enabled,
  });
}

// --- Self-service queries --------------------------------------------------

export function useOwnProfile() {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: consultantKeys.me(),
    queryFn: () => api.getOwnProfile(client),
    enabled,
  });
}

export function useOwnAssignments(query: OwnAssignmentsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: consultantKeys.myAssignments(query),
    queryFn: () => api.listOwnAssignments(client, query),
    enabled,
  });
}

// --- Mutations -------------------------------------------------------------

export function useAdminUpdateConsultant(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminUpdateConsultantBody) =>
      api.adminUpdateConsultant(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: consultantKeys.detail(id) });
      qc.invalidateQueries({ queryKey: consultantKeys.lists() });
    },
  });
}

export function useChangeConsultantStatus(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StatusChangeBody) =>
      api.changeConsultantStatus(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: consultantKeys.detail(id) });
      qc.invalidateQueries({ queryKey: consultantKeys.lists() });
    },
  });
}

export function useSelfEditProfile() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SelfEditProfileBody) => api.selfEditProfile(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: consultantKeys.me() });
    },
  });
}
