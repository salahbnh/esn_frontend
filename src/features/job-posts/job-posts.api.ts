/** Typed admin API for `/api/job-posts`. */

import type { apiClient } from "@/lib/api-client";
import type {
  ApplicationDetail,
  ApplicationList,
  CreateQuestionBody,
  JobPostBody,
  JobPostDetail,
  JobPostList,
  JobQuestion,
  ListJobPostsQuery,
  PatchApplicationStatusBody,
  UpdateQuestionBody,
} from "@/features/job-posts/job-posts.types";

type Client = ReturnType<typeof apiClient>;

export function listJobPosts(client: Client, query: ListJobPostsQuery = {}): Promise<JobPostList> {
  return client.get<JobPostList>("/job-posts", {
    query: { status: query.status, search: query.search, page: query.page, pageSize: query.pageSize },
  });
}

export function getJobPost(client: Client, id: string): Promise<JobPostDetail> {
  return client.get<JobPostDetail>(`/job-posts/${id}`);
}

export function createJobPost(client: Client, body: JobPostBody): Promise<JobPostDetail> {
  return client.post<JobPostDetail>("/job-posts", body);
}

export function updateJobPost(client: Client, id: string, body: Partial<JobPostBody>): Promise<JobPostDetail> {
  return client.patch<JobPostDetail>(`/job-posts/${id}`, body);
}

export function publishJobPost(client: Client, id: string): Promise<JobPostDetail> {
  return client.post<JobPostDetail>(`/job-posts/${id}/publish`, {});
}

export function closeJobPost(client: Client, id: string): Promise<JobPostDetail> {
  return client.post<JobPostDetail>(`/job-posts/${id}/close`, {});
}

export function archiveJobPost(client: Client, id: string): Promise<void> {
  return client.del<void>(`/job-posts/${id}`);
}

// --- Questions -------------------------------------------------------------

export function listQuestions(client: Client, id: string): Promise<JobQuestion[]> {
  return client.get<JobQuestion[]>(`/job-posts/${id}/questions`);
}

export function addQuestion(client: Client, id: string, body: CreateQuestionBody): Promise<JobQuestion> {
  return client.post<JobQuestion>(`/job-posts/${id}/questions`, body);
}

export function updateQuestion(
  client: Client,
  id: string,
  qid: string,
  body: UpdateQuestionBody,
): Promise<JobQuestion> {
  return client.patch<JobQuestion>(`/job-posts/${id}/questions/${qid}`, body);
}

export function archiveQuestion(client: Client, id: string, qid: string): Promise<void> {
  return client.del<void>(`/job-posts/${id}/questions/${qid}`);
}

export function reorderQuestions(client: Client, id: string, orderedIds: string[]): Promise<void> {
  return client.post<void>(`/job-posts/${id}/questions/reorder`, { orderedIds });
}

// --- Applications ----------------------------------------------------------

export function listApplications(
  client: Client,
  id: string,
  query: { status?: string; page?: number; pageSize?: number } = {},
): Promise<ApplicationList> {
  return client.get<ApplicationList>(`/job-posts/${id}/applications`, { query });
}

export function getApplication(client: Client, appId: string): Promise<ApplicationDetail> {
  return client.get<ApplicationDetail>(`/job-posts/applications/${appId}`);
}

export function patchApplicationStatus(
  client: Client,
  appId: string,
  body: PatchApplicationStatusBody,
): Promise<ApplicationDetail> {
  return client.patch<ApplicationDetail>(`/job-posts/applications/${appId}/status`, body);
}

export function linkApplication(client: Client, appId: string): Promise<ApplicationDetail> {
  return client.post<ApplicationDetail>(`/job-posts/applications/${appId}/link`, {});
}
