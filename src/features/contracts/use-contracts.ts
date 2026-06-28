"use client";

/**
 * TanStack Query hooks for the contracts endpoints (+ read-only templates).
 * Queries gated on `useApiReady()`. Workflow mutations (submit / validate /
 * generate-pdf / archive / amendment) invalidate the contract lists + the
 * touched detail, plus the consultant keys, because a consultant's detail view
 * surfaces their contracts. Mirrors the earlier feature hook modules.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/contracts/contracts.api";
import { consultantKeys } from "@/features/consultants/use-consultants";
import type {
  Contract,
  CreateContractAmendmentBody,
  CreateContractBody,
  ListContractsQuery,
  PaginationQuery,
  UpdateContractBody,
  ValidateStepBody,
} from "@/features/contracts/contracts.types";

export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (q: ListContractsQuery) => [...contractKeys.lists(), q] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  amendments: (id: string) => [...contractKeys.detail(id), "amendments"] as const,
  amendmentList: (id: string, q: PaginationQuery) =>
    [...contractKeys.amendments(id), q] as const,
  templates: () => [...contractKeys.all, "templates"] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

/** Invalidate the contract lists + this contract's detail, plus the consultant. */
function invalidateForContract(qc: QueryClient, c: Contract): void {
  qc.invalidateQueries({ queryKey: contractKeys.lists() });
  qc.invalidateQueries({ queryKey: contractKeys.detail(c.id) });
  qc.invalidateQueries({ queryKey: consultantKeys.detail(c.consultantId) });
  qc.invalidateQueries({ queryKey: consultantKeys.lists() });
}

// --- Queries ---------------------------------------------------------------

export function useContracts(query: ListContractsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: contractKeys.list(query),
    queryFn: () => api.listContracts(client, query),
    enabled,
  });
}

export function useContract(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => api.getContract(client, id),
    enabled,
  });
}

export function useContractAmendments(id: string, query: PaginationQuery = {}) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: contractKeys.amendmentList(id, query),
    queryFn: () => api.listContractAmendments(client, id, query),
    enabled,
  });
}

export function useTemplates() {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: contractKeys.templates(),
    queryFn: () => api.listTemplates(client),
    enabled,
  });
}

// --- Mutations -------------------------------------------------------------

export function useCreateContract() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateContractBody) => api.createContract(client, body),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useUpdateContract(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateContractBody) =>
      api.updateContract(client, id, body),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useSubmitContract(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.submitContract(client, id),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useValidateContract(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ValidateStepBody) =>
      api.validateContract(client, id, body),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useGenerateContractPdf(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.generateContractPdf(client, id),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useSignContract(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (signedPdfDocumentId: string) =>
      api.signContract(client, id, signedPdfDocumentId),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useArchiveContract(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.archiveContract(client, id),
    onSuccess: (data) => invalidateForContract(qc, data),
  });
}

export function useCreateContractAmendment(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateContractAmendmentBody) =>
      api.createContractAmendment(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contractKeys.amendments(id) });
      qc.invalidateQueries({ queryKey: contractKeys.detail(id) });
    },
  });
}
