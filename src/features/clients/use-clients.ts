"use client";

/**
 * TanStack Query hooks for the clients endpoints. Mirrors `use-recruitment.ts`:
 * queries gated on `useApiReady()`, mutations invalidate the relevant keys.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/clients/clients.api";
import type {
  CreateClientBody,
  ListClientsQuery,
  UpdateClientBody,
} from "@/features/clients/clients.types";

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (q: ListClientsQuery) => [...clientKeys.lists(), q] as const,
  detail: (id: string) => [...clientKeys.all, "detail", id] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

export function useClients(query: ListClientsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: clientKeys.list(query),
    queryFn: () => api.listClients(client, query),
    enabled,
  });
}

export function useClient(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => api.getClient(client, id),
    enabled,
  });
}

export function useCreateClient() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateClientBody) => api.createClient(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

export function useUpdateClient(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateClientBody) => api.updateClient(client, id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.detail(id) });
      qc.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}
