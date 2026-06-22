"use client";

/**
 * TanStack Query hooks for the missions endpoints. Queries gated on
 * `useApiReady()`; mutations invalidate the relevant keys. Mirrors
 * `use-recruitment.ts` / `use-consultants.ts`.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/missions/missions.api";
import type {
  CreateAmendmentBody,
  CreateMissionBody,
  ListMissionsQuery,
  MissionStatusChangeBody,
  UpdateMissionBody,
} from "@/features/missions/missions.types";

export const missionKeys = {
  all: ["missions"] as const,
  lists: () => [...missionKeys.all, "list"] as const,
  list: (q: ListMissionsQuery) => [...missionKeys.lists(), q] as const,
  detail: (id: string) => [...missionKeys.all, "detail", id] as const,
  amendments: (id: string) => [...missionKeys.all, id, "amendments"] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

// --- Queries ---------------------------------------------------------------

export function useMissions(query: ListMissionsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: missionKeys.list(query),
    queryFn: () => api.listMissions(client, query),
    enabled,
  });
}

export function useMission(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: missionKeys.detail(id),
    queryFn: () => api.getMission(client, id),
    enabled,
  });
}

export function useAmendments(id: string, page?: number) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: [...missionKeys.amendments(id), page ?? 1],
    queryFn: () => api.listAmendments(client, id, { page }),
    enabled,
  });
}

// --- Mutations -------------------------------------------------------------

export function useCreateMission() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMissionBody) => api.createMission(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: missionKeys.lists() });
    },
  });
}

export function useUpdateMission(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateMissionBody) => api.updateMission(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: missionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: missionKeys.lists() });
    },
  });
}

export function useChangeMissionStatus(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MissionStatusChangeBody) =>
      api.changeMissionStatus(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: missionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: missionKeys.lists() });
    },
  });
}

export function useArchiveMission(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.archiveMission(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: missionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: missionKeys.lists() });
    },
  });
}

export function useCreateAmendment(missionId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAmendmentBody) =>
      api.createAmendment(client, missionId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: missionKeys.amendments(missionId) });
      qc.invalidateQueries({ queryKey: missionKeys.detail(missionId) });
    },
  });
}
