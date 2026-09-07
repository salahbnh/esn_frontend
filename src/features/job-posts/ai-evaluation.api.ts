/** Typed API for AI evaluations (`/api/ai-evaluations` + application sub-resources). */

import type { apiClient } from "@/lib/api-client";
import type { AiEvaluation, AiStatus } from "@/features/job-posts/ai-evaluation.types";

type Client = ReturnType<typeof apiClient>;

export function getAiStatus(client: Client): Promise<AiStatus> {
  return client.get<AiStatus>("/ai-evaluations/status");
}

export function listAiEvaluations(client: Client, appId: string): Promise<AiEvaluation[]> {
  return client.get<AiEvaluation[]>(`/job-posts/applications/${appId}/ai-evaluations`);
}

export function triggerAiEvaluation(client: Client, appId: string): Promise<AiEvaluation> {
  return client.post<AiEvaluation>(`/job-posts/applications/${appId}/ai-evaluations`, {});
}
