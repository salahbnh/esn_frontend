"use client";

/**
 * TanStack Query hooks for the recruitment endpoints. Queries read the auth'd
 * client from `useApi()` and are gated on `useApiReady()` (avoids the token race
 * that shows a spurious error on first load). Mutations invalidate the relevant
 * keys on success. Mirrors the structure of `use-reporting.ts`.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/recruitment/recruitment.api";
import type {
  ConvertCandidateBody,
  CreateCandidateBody,
  CreateEvaluationBody,
  CreateInteractionBody,
  CreateProposalBody,
  ListCandidatesQuery,
  StatusTransitionBody,
  UpdateCandidateBody,
  UpdateProposalStatusBody,
} from "@/features/recruitment/recruitment.types";

export const recruitmentKeys = {
  all: ["candidates"] as const,
  lists: () => [...recruitmentKeys.all, "list"] as const,
  list: (q: ListCandidatesQuery) => [...recruitmentKeys.lists(), q] as const,
  detail: (id: string) => [...recruitmentKeys.all, "detail", id] as const,
  interactions: (id: string) =>
    [...recruitmentKeys.all, id, "interactions"] as const,
  evaluations: (id: string) =>
    [...recruitmentKeys.all, id, "evaluations"] as const,
  proposals: (id: string) => [...recruitmentKeys.all, id, "proposals"] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

// --- Queries ---------------------------------------------------------------

export function useCandidates(query: ListCandidatesQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: recruitmentKeys.list(query),
    queryFn: () => api.listCandidates(client, query),
    enabled,
  });
}

export function useCandidate(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: recruitmentKeys.detail(id),
    queryFn: () => api.getCandidate(client, id),
    enabled,
  });
}

export function useInteractions(id: string, page?: number) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: [...recruitmentKeys.interactions(id), page ?? 1],
    queryFn: () => api.listInteractions(client, id, { page }),
    enabled,
  });
}

export function useEvaluations(id: string, page?: number) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: [...recruitmentKeys.evaluations(id), page ?? 1],
    queryFn: () => api.listEvaluations(client, id, { page }),
    enabled,
  });
}

export function useProposals(id: string, page?: number) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: [...recruitmentKeys.proposals(id), page ?? 1],
    queryFn: () => api.listProposals(client, id, { page }),
    enabled,
  });
}

// --- Mutations -------------------------------------------------------------

export function useCreateCandidate() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCandidateBody) =>
      api.createCandidate(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.lists() });
    },
  });
}

export function useUpdateCandidate(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateCandidateBody) =>
      api.updateCandidate(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
      qc.invalidateQueries({ queryKey: recruitmentKeys.lists() });
    },
  });
}

export function useTransitionStatus(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StatusTransitionBody) =>
      api.transitionStatus(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recruitmentKeys.detail(id) });
      qc.invalidateQueries({ queryKey: recruitmentKeys.lists() });
    },
  });
}

export function useAddInteraction(candidateId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInteractionBody) =>
      api.addInteraction(client, candidateId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recruitmentKeys.interactions(candidateId),
      });
    },
  });
}

export function useAddEvaluation(candidateId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEvaluationBody) =>
      api.addEvaluation(client, candidateId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recruitmentKeys.evaluations(candidateId),
      });
    },
  });
}

export function useCreateProposal(candidateId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProposalBody) =>
      api.createProposal(client, candidateId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recruitmentKeys.proposals(candidateId),
      });
    },
  });
}

export function useUpdateProposalStatus(candidateId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      proposalId: string;
      body: UpdateProposalStatusBody;
    }) =>
      api.updateProposalStatus(client, candidateId, vars.proposalId, vars.body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recruitmentKeys.proposals(candidateId),
      });
    },
  });
}

export function useConvertCandidate(candidateId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ConvertCandidateBody) =>
      api.convertCandidate(client, candidateId, body),
    onSuccess: () => {
      // Mark the candidate detail stale WITHOUT an immediate refetch: the dialog
      // navigates to the new consultant on success, and an immediate refetch
      // here would flip this candidate to HIRED, unmount the (VALIDATED-only)
      // convert dialog, and cancel that navigation. It refetches on next visit.
      qc.invalidateQueries({
        queryKey: recruitmentKeys.detail(candidateId),
        refetchType: "none",
      });
      qc.invalidateQueries({ queryKey: recruitmentKeys.lists() });
    },
  });
}
