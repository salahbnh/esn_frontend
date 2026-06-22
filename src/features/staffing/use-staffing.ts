"use client";

/**
 * TanStack Query hooks for the staffing endpoints. Queries gated on
 * `useApiReady()`. Mutations invalidate staffing keys AND the cross-module
 * mission + consultant keys, because the backend status cascade changes a
 * mission's status/`_assignmentCount` and a consultant's status. Mirrors the
 * earlier feature hook modules.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/staffing/staffing.api";
import { consultantKeys } from "@/features/consultants/use-consultants";
import { missionKeys } from "@/features/missions/use-missions";
import type {
  Assignment,
  AssignmentStatusChangeBody,
  CreateAssignmentBody,
  ListAssignmentsQuery,
  PaginationQuery,
  UpdateAssignmentBody,
} from "@/features/staffing/staffing.types";

export const staffingKeys = {
  all: ["staffing"] as const,
  assignments: () => [...staffingKeys.all, "assignments"] as const,
  assignmentList: (q: ListAssignmentsQuery) =>
    [...staffingKeys.assignments(), "list", q] as const,
  assignment: (id: string) =>
    [...staffingKeys.assignments(), "detail", id] as const,
  occupancy: () => [...staffingKeys.all, "occupancy"] as const,
  consultantOccupancy: (id: string) =>
    [...staffingKeys.occupancy(), id] as const,
  globalOccupancy: (q: PaginationQuery) =>
    [...staffingKeys.occupancy(), "global", q] as const,
  suggestions: (missionId: string) =>
    [...staffingKeys.all, "suggestions", missionId] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

/**
 * Invalidate everything a staffing mutation can affect: the staffing lists +
 * occupancy, plus the touched mission and consultant (status cascade).
 */
function invalidateForAssignment(qc: QueryClient, a: Assignment): void {
  qc.invalidateQueries({ queryKey: staffingKeys.assignments() });
  qc.invalidateQueries({ queryKey: staffingKeys.occupancy() });
  qc.invalidateQueries({ queryKey: missionKeys.detail(a.missionId) });
  qc.invalidateQueries({ queryKey: missionKeys.lists() });
  qc.invalidateQueries({ queryKey: consultantKeys.detail(a.consultantId) });
  qc.invalidateQueries({ queryKey: consultantKeys.lists() });
  qc.invalidateQueries({ queryKey: consultantKeys.me() });
}

// --- Queries ---------------------------------------------------------------

export function useAssignments(query: ListAssignmentsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: staffingKeys.assignmentList(query),
    queryFn: () => api.listAssignments(client, query),
    enabled,
  });
}

export function useAssignment(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: staffingKeys.assignment(id),
    queryFn: () => api.getAssignment(client, id),
    enabled,
  });
}

export function useConsultantOccupancy(consultantId: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(consultantId);
  return useQuery({
    queryKey: staffingKeys.consultantOccupancy(consultantId),
    queryFn: () => api.getConsultantOccupancy(client, consultantId),
    enabled,
  });
}

export function useGlobalOccupancy(query: PaginationQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: staffingKeys.globalOccupancy(query),
    queryFn: () => api.listGlobalOccupancy(client, query),
    enabled,
  });
}

export function useSuggestions(missionId: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(missionId);
  return useQuery({
    queryKey: staffingKeys.suggestions(missionId),
    queryFn: () => api.getSuggestions(client, missionId),
    enabled,
  });
}

// --- Mutations -------------------------------------------------------------

export function useCreateAssignment() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAssignmentBody) =>
      api.createAssignment(client, body),
    onSuccess: (data) => invalidateForAssignment(qc, data),
  });
}

export function useUpdateAssignment(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateAssignmentBody) =>
      api.updateAssignment(client, id, body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: staffingKeys.assignment(id) });
      invalidateForAssignment(qc, data);
    },
  });
}

export function useChangeAssignmentStatus(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AssignmentStatusChangeBody) =>
      api.changeAssignmentStatus(client, id, body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: staffingKeys.assignment(id) });
      invalidateForAssignment(qc, data);
    },
  });
}
