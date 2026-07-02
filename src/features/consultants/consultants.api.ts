/**
 * Typed consultants API — one function per `/api/consultants` endpoint, bound to
 * a token-aware `apiClient`. Mirrors `recruitment.api.ts`.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  AdminUpdateConsultantBody,
  ConsultantDetail,
  ConsultantList,
  ConsultantListItem,
  DocumentMetaList,
  ListConsultantsQuery,
  OwnAssignmentList,
  OwnAssignmentsQuery,
  SelfEditProfileBody,
  StatusChangeBody,
} from "@/features/consultants/consultants.types";

type Client = ReturnType<typeof apiClient>;

/** Date-only string → full ISO-8601 datetime (the backend's `.datetime()` requirement). */
function toISODatetime(dateStr: string): string {
  return dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
}

// --- Staff reads -----------------------------------------------------------

export function listConsultants(
  client: Client,
  query: ListConsultantsQuery,
): Promise<ConsultantList> {
  return client.get<ConsultantList>("/consultants", {
    query: {
      status: query.status,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function getConsultant(
  client: Client,
  id: string,
): Promise<ConsultantDetail> {
  return client.get<ConsultantDetail>(`/consultants/${id}`);
}

export function listConsultantDocuments(
  client: Client,
  id: string,
  query: { page?: number; pageSize?: number } = {},
): Promise<DocumentMetaList> {
  return client.get<DocumentMetaList>(`/consultants/${id}/documents`, {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

// --- Staff writes ----------------------------------------------------------

export function adminUpdateConsultant(
  client: Client,
  id: string,
  body: AdminUpdateConsultantBody,
): Promise<ConsultantListItem> {
  return client.patch<ConsultantListItem>(`/consultants/${id}`, {
    ...body,
    availabilityDate: body.availabilityDate
      ? toISODatetime(body.availabilityDate)
      : undefined,
  });
}

export function changeConsultantStatus(
  client: Client,
  id: string,
  body: StatusChangeBody,
): Promise<ConsultantListItem> {
  return client.patch<ConsultantListItem>(`/consultants/${id}/status`, body);
}

/** Re-send the set-password invite email (RH/DIRECTION). Returns 204 (no body). */
export function resendConsultantInvite(client: Client, id: string): Promise<void> {
  return client.post<void>(`/consultants/${id}/resend-invite`);
}

// --- Self-service (/me) ----------------------------------------------------

export function getOwnProfile(client: Client): Promise<ConsultantDetail> {
  return client.get<ConsultantDetail>("/consultants/me");
}

export function selfEditProfile(
  client: Client,
  body: SelfEditProfileBody,
): Promise<ConsultantListItem> {
  return client.patch<ConsultantListItem>("/consultants/me", body);
}

export function listOwnAssignments(
  client: Client,
  query: OwnAssignmentsQuery,
): Promise<OwnAssignmentList> {
  return client.get<OwnAssignmentList>("/consultants/me/assignments", {
    query: { status: query.status, page: query.page, pageSize: query.pageSize },
  });
}
