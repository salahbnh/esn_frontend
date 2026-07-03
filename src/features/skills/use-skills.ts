"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/skills/skills.api";
import type {
  CreateSkillBody,
  ListSkillsQuery,
  UpdateSkillBody,
} from "@/features/skills/skills.types";

export const skillKeys = {
  all: ["skills"] as const,
  list: (q: ListSkillsQuery) => [...skillKeys.all, "list", q] as const,
};

function useApiReady(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

export function useSkills(query: ListSkillsQuery = {}) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({
    queryKey: skillKeys.list(query),
    queryFn: () => api.listSkills(client, query),
    enabled,
    staleTime: 5 * 60 * 1000, // referential changes rarely
  });
}

export function useCreateSkill() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSkillBody) => api.createSkill(client, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  });
}

export function useUpdateSkill(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSkillBody) => api.updateSkill(client, id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  });
}

export function useDeleteSkill() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteSkill(client, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  });
}
