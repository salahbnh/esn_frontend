"use client";

/**
 * TanStack Query hooks for the reporting endpoints. Each reads the auth'd
 * client from the M1 `useApi()` hook (token from the NextAuth session) and
 * keys by report (+ date window where relevant). The global 30s staleTime
 * from `makeQueryClient` applies.
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import {
  getHr,
  getMissions,
  getMyDashboard,
  getOccupancy,
  getPipeline,
  getSummary,
} from "@/features/reporting/reporting.api";
import type { DateWindow } from "@/features/reporting/reporting.types";

export const reportingKeys = {
  all: ["reports"] as const,
  summary: () => [...reportingKeys.all, "summary"] as const,
  occupancy: () => [...reportingKeys.all, "occupancy"] as const,
  pipeline: (w: DateWindow) =>
    [...reportingKeys.all, "pipeline", w.from, w.to] as const,
  missions: (w: DateWindow) =>
    [...reportingKeys.all, "missions", w.from, w.to] as const,
  hr: () => [...reportingKeys.all, "hr"] as const,
  me: () => [...reportingKeys.all, "me"] as const,
};

/**
 * Whether the auth'd API client is ready. On a fresh page load `useSession()`
 * resolves asynchronously; firing a query before the access token exists yields
 * a 401. Gating queries on this avoids the "load only after Réessayer" race.
 */
function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

export function useSummary() {
  const api = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: reportingKeys.summary(),
    queryFn: () => getSummary(api),
    enabled,
  });
}

export function useOccupancy() {
  const api = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: reportingKeys.occupancy(),
    queryFn: () => getOccupancy(api),
    enabled,
  });
}

export function usePipeline(window: DateWindow) {
  const api = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: reportingKeys.pipeline(window),
    queryFn: () => getPipeline(api, window),
    enabled,
  });
}

export function useMissions(window: DateWindow) {
  const api = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: reportingKeys.missions(window),
    queryFn: () => getMissions(api, window),
    enabled,
  });
}

export function useHr() {
  const api = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: reportingKeys.hr(),
    queryFn: () => getHr(api),
    enabled,
  });
}

export function useMyDashboard() {
  const api = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: reportingKeys.me(),
    queryFn: () => getMyDashboard(api),
    enabled,
  });
}
