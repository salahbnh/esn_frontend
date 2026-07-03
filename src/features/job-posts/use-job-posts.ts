"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useApi } from "@/lib/use-api";
import * as api from "@/features/job-posts/job-posts.api";
import type {
  CreateQuestionBody,
  JobPostBody,
  ListJobPostsQuery,
  PatchApplicationStatusBody,
  UpdateQuestionBody,
} from "@/features/job-posts/job-posts.types";

export const jobPostKeys = {
  all: ["job-posts"] as const,
  lists: () => [...jobPostKeys.all, "list"] as const,
  list: (q: ListJobPostsQuery) => [...jobPostKeys.lists(), q] as const,
  detail: (id: string) => [...jobPostKeys.all, "detail", id] as const,
  questions: (id: string) => [...jobPostKeys.all, id, "questions"] as const,
  applications: (id: string) => [...jobPostKeys.all, id, "applications"] as const,
  application: (appId: string) => [...jobPostKeys.all, "application", appId] as const,
};

function useApiReady(): boolean {
  return useSession().status === "authenticated";
}

function invalidatePost(qc: QueryClient, id: string): void {
  qc.invalidateQueries({ queryKey: jobPostKeys.lists() });
  qc.invalidateQueries({ queryKey: jobPostKeys.detail(id) });
}

export function useJobPosts(query: ListJobPostsQuery) {
  const client = useApi();
  const enabled = useApiReady();
  return useQuery({ queryKey: jobPostKeys.list(query), queryFn: () => api.listJobPosts(client, query), enabled });
}

export function useJobPost(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({ queryKey: jobPostKeys.detail(id), queryFn: () => api.getJobPost(client, id), enabled });
}

export function useCreateJobPost() {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: JobPostBody) => api.createJobPost(client, body),
    onSuccess: (data) => invalidatePost(qc, data.id),
  });
}

export function useUpdateJobPost(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<JobPostBody>) => api.updateJobPost(client, id, body),
    onSuccess: () => invalidatePost(qc, id),
  });
}

export function usePublishJobPost(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.publishJobPost(client, id), onSuccess: () => invalidatePost(qc, id) });
}

export function useCloseJobPost(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.closeJobPost(client, id), onSuccess: () => invalidatePost(qc, id) });
}

export function useArchiveJobPost(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.archiveJobPost(client, id), onSuccess: () => invalidatePost(qc, id) });
}

// --- Questions -------------------------------------------------------------

export function useQuestions(id: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({ queryKey: jobPostKeys.questions(id), queryFn: () => api.listQuestions(client, id), enabled });
}

function invalidateQuestions(qc: QueryClient, id: string): void {
  qc.invalidateQueries({ queryKey: jobPostKeys.questions(id) });
  qc.invalidateQueries({ queryKey: jobPostKeys.detail(id) });
}

export function useAddQuestion(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateQuestionBody) => api.addQuestion(client, id, body),
    onSuccess: () => invalidateQuestions(qc, id),
  });
}

export function useUpdateQuestion(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { qid: string; body: UpdateQuestionBody }) =>
      api.updateQuestion(client, id, args.qid, args.body),
    onSuccess: () => invalidateQuestions(qc, id),
  });
}

export function useArchiveQuestion(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (qid: string) => api.archiveQuestion(client, id, qid),
    onSuccess: () => invalidateQuestions(qc, id),
  });
}

export function useReorderQuestions(id: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => api.reorderQuestions(client, id, orderedIds),
    onSuccess: () => invalidateQuestions(qc, id),
  });
}

// --- Applications ----------------------------------------------------------

export function useApplications(id: string, status?: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(id);
  return useQuery({
    queryKey: [...jobPostKeys.applications(id), status ?? "all"],
    queryFn: () => api.listApplications(client, id, status ? { status } : {}),
    enabled,
  });
}

export function useApplication(appId: string) {
  const client = useApi();
  const enabled = useApiReady() && Boolean(appId);
  return useQuery({
    queryKey: jobPostKeys.application(appId),
    queryFn: () => api.getApplication(client, appId),
    enabled,
  });
}

export function usePatchApplicationStatus(appId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PatchApplicationStatusBody) => api.patchApplicationStatus(client, appId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: jobPostKeys.all }),
  });
}

export function useLinkApplication(appId: string) {
  const client = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.linkApplication(client, appId),
    onSuccess: () => qc.invalidateQueries({ queryKey: jobPostKeys.all }),
  });
}
