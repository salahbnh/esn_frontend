"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/job-posts/ai-evaluation.api";

export const aiEvaluationKeys = {
  all: ["ai-evaluations"] as const,
  status: () => [...aiEvaluationKeys.all, "status"] as const,
  list: (appId: string) => [...aiEvaluationKeys.all, "application", appId] as const,
};

function useApiReady(): boolean {
  return useSession().status === "authenticated";
}

/** Availability probe — drives the enabled/disabled state of the trigger button. */
export function useAiStatus() {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: aiEvaluationKeys.status(),
    queryFn: () => api.getAiStatus(client),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAiEvaluations(appId: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(appId);
  return useQuery({
    queryKey: aiEvaluationKeys.list(appId),
    queryFn: () => api.listAiEvaluations(client, appId),
    enabled,
  });
}

export function useTriggerAiEvaluation(appId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.triggerAiEvaluation(client, appId),
    onSuccess: () => qc.invalidateQueries({ queryKey: aiEvaluationKeys.list(appId) }),
  });
}
