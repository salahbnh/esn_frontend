"use client";

/**
 * TanStack Query hooks for contract-template management. Mutations invalidate the
 * admin lists AND the contracts module's `templates` key, so the contract create
 * dialog's picker reflects new/edited/deactivated templates immediately.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/contract-templates/contract-templates.api";
import type {
  ListTemplatesAdminQuery,
  TemplateBody,
} from "@/features/contract-templates/contract-templates.api";
import { contractKeys } from "@/features/contracts/use-contracts";

export const templateAdminKeys = {
  all: ["contract-templates"] as const,
  lists: () => [...templateAdminKeys.all, "list"] as const,
  list: (q: ListTemplatesAdminQuery) =>
    [...templateAdminKeys.lists(), q] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

export function useTemplatesAdmin(query: ListTemplatesAdminQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: templateAdminKeys.list(query),
    queryFn: () => api.listTemplatesAdmin(client, query),
    enabled,
  });
}

function useInvalidateTemplates() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: templateAdminKeys.all });
    // The contract create dialog reads templates via the contracts module key.
    qc.invalidateQueries({ queryKey: contractKeys.templates() });
  };
}

export function useCreateTemplate() {
  const client = useApi();
  const invalidate = useInvalidateTemplates();
  return useMutation({
    mutationFn: (body: TemplateBody) => api.createTemplate(client, body),
    onSuccess: invalidate,
  });
}

export function useUpdateTemplate(id: string) {
  const client = useApi();
  const invalidate = useInvalidateTemplates();
  return useMutation({
    mutationFn: (body: Partial<TemplateBody>) =>
      api.updateTemplate(client, id, body),
    onSuccess: invalidate,
  });
}

export function useDeactivateTemplate(id: string) {
  const client = useApi();
  const invalidate = useInvalidateTemplates();
  return useMutation({
    mutationFn: () => api.deactivateTemplate(client, id),
    onSuccess: invalidate,
  });
}
