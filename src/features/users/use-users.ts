"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/users/users.api";
import type { CreateUserBody, ListUsersQuery } from "@/features/users/users.types";

export const userKeys = {
  all: ["users"] as const,
  list: (q: ListUsersQuery) => [...userKeys.all, "list", q] as const,
};

function useApiReady(): boolean {
  return useSession().status === "authenticated";
}

export function useUsers(query: ListUsersQuery = {}) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => api.listUsers(client, query),
    enabled,
  });
}

/** Active managers — feeds the contract designated-manager picker. */
export function useManagers() {
  return useUsers({ role: "MANAGER", pageSize: 100 });
}

export function useCreateUser() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateUserBody) => api.createUser(client, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function usePatchUserStatus() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; isActive: boolean }) =>
      api.patchUserStatus(client, args.id, args.isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useResendUserInvite() {
  const client = useApi();
  return useMutation({
    mutationFn: (id: string) => api.resendUserInvite(client, id),
  });
}
