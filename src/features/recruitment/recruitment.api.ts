/**
 * Typed recruitment API — one function per `/api/candidates` endpoint, bound to
 * a token-aware `apiClient`. Mirrors the structure of `reporting.api.ts`.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  Candidate,
  CandidateDetail,
  CandidateEvaluation,
  CandidateInteraction,
  ConversionResult,
  ConvertCandidateBody,
  CreateCandidateBody,
  CreateEvaluationBody,
  CreateInteractionBody,
  CreateProposalBody,
  EvaluationList,
  CandidateList,
  InteractionList,
  ListCandidatesQuery,
  PaginationQuery,
  Proposal,
  ProposalList,
  StatusTransitionBody,
  UpdateCandidateBody,
  UpdateProposalStatusBody,
} from "@/features/recruitment/recruitment.types";

type Client = ReturnType<typeof apiClient>;

/**
 * A date-only string from `<input type="date">` ("2026-06-19") expanded to a
 * full ISO-8601 datetime, which the backend schemas require. Same lesson as
 * `toWindowQuery` in reporting. Pass-through if already a datetime.
 */
export function toISODatetime(dateStr: string): string {
  return dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
}

// --- Candidate CRUD --------------------------------------------------------

export function listCandidates(
  client: Client,
  query: ListCandidatesQuery,
): Promise<CandidateList> {
  return client.get<CandidateList>("/candidates", {
    query: {
      status: query.status,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function getCandidate(
  client: Client,
  id: string,
): Promise<CandidateDetail> {
  return client.get<CandidateDetail>(`/candidates/${id}`);
}

export function createCandidate(
  client: Client,
  body: CreateCandidateBody,
): Promise<Candidate> {
  return client.post<Candidate>("/candidates", body);
}

export function updateCandidate(
  client: Client,
  id: string,
  body: UpdateCandidateBody,
): Promise<Candidate> {
  return client.patch<Candidate>(`/candidates/${id}`, body);
}

export function transitionStatus(
  client: Client,
  id: string,
  body: StatusTransitionBody,
): Promise<Candidate> {
  return client.patch<Candidate>(`/candidates/${id}/status`, body);
}

// --- Interactions ----------------------------------------------------------

export function addInteraction(
  client: Client,
  id: string,
  body: CreateInteractionBody,
): Promise<CandidateInteraction> {
  return client.post<CandidateInteraction>(`/candidates/${id}/interactions`, {
    ...body,
    occurredAt: toISODatetime(body.occurredAt),
  });
}

export function listInteractions(
  client: Client,
  id: string,
  query: PaginationQuery = {},
): Promise<InteractionList> {
  return client.get<InteractionList>(`/candidates/${id}/interactions`, {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

// --- Evaluations -----------------------------------------------------------

export function addEvaluation(
  client: Client,
  id: string,
  body: CreateEvaluationBody,
): Promise<CandidateEvaluation> {
  return client.post<CandidateEvaluation>(`/candidates/${id}/evaluations`, body);
}

export function listEvaluations(
  client: Client,
  id: string,
  query: PaginationQuery = {},
): Promise<EvaluationList> {
  return client.get<EvaluationList>(`/candidates/${id}/evaluations`, {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

// --- Proposals -------------------------------------------------------------

export function createProposal(
  client: Client,
  id: string,
  body: CreateProposalBody,
): Promise<Proposal> {
  return client.post<Proposal>(`/candidates/${id}/proposals`, body);
}

export function updateProposalStatus(
  client: Client,
  id: string,
  proposalId: string,
  body: UpdateProposalStatusBody,
): Promise<Proposal> {
  return client.patch<Proposal>(
    `/candidates/${id}/proposals/${proposalId}/status`,
    body,
  );
}

export function listProposals(
  client: Client,
  id: string,
  query: PaginationQuery = {},
): Promise<ProposalList> {
  return client.get<ProposalList>(`/candidates/${id}/proposals`, {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

// --- Conversion ------------------------------------------------------------

export function convertCandidate(
  client: Client,
  id: string,
  body: ConvertCandidateBody,
): Promise<ConversionResult> {
  return client.post<ConversionResult>(`/candidates/${id}/convert`, {
    ...body,
    hireDate: body.hireDate ? toISODatetime(body.hireDate) : undefined,
  });
}
