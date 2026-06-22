/**
 * Typed missions API — one function per `/api/missions` endpoint, bound to a
 * token-aware `apiClient`. Date-only inputs are expanded to ISO datetimes here.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  AmendmentList,
  CreateAmendmentBody,
  CreateMissionBody,
  ListMissionsQuery,
  MissionAmendment,
  MissionDetail,
  MissionList,
  MissionListItem,
  MissionStatusChangeBody,
  PaginationQuery,
  UpdateMissionBody,
} from "@/features/missions/missions.types";

type Client = ReturnType<typeof apiClient>;

/** Date-only string → full ISO-8601 datetime (the backend's `.datetime()` requirement). */
function toISODatetime(dateStr: string): string {
  return dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
}

export function listMissions(
  client: Client,
  query: ListMissionsQuery,
): Promise<MissionList> {
  return client.get<MissionList>("/missions", {
    query: {
      status: query.status,
      clientId: query.clientId,
      search: query.search,
      includeArchived: query.includeArchived,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function getMission(
  client: Client,
  id: string,
): Promise<MissionDetail> {
  return client.get<MissionDetail>(`/missions/${id}`);
}

export function createMission(
  client: Client,
  body: CreateMissionBody,
): Promise<MissionDetail> {
  return client.post<MissionDetail>("/missions", {
    ...body,
    startDate: toISODatetime(body.startDate),
    endDate: body.endDate ? toISODatetime(body.endDate) : undefined,
  });
}

export function updateMission(
  client: Client,
  id: string,
  body: UpdateMissionBody,
): Promise<MissionDetail> {
  return client.patch<MissionDetail>(`/missions/${id}`, {
    ...body,
    startDate: body.startDate ? toISODatetime(body.startDate) : undefined,
    endDate: body.endDate ? toISODatetime(body.endDate) : undefined,
  });
}

export function changeMissionStatus(
  client: Client,
  id: string,
  body: MissionStatusChangeBody,
): Promise<MissionListItem> {
  return client.patch<MissionListItem>(`/missions/${id}/status`, body);
}

export function archiveMission(
  client: Client,
  id: string,
): Promise<MissionListItem> {
  return client.patch<MissionListItem>(`/missions/${id}/archive`, {});
}

export function listAmendments(
  client: Client,
  id: string,
  query: PaginationQuery = {},
): Promise<AmendmentList> {
  return client.get<AmendmentList>(`/missions/${id}/amendments`, {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

export function createAmendment(
  client: Client,
  id: string,
  body: CreateAmendmentBody,
): Promise<MissionAmendment> {
  return client.post<MissionAmendment>(`/missions/${id}/amendments`, {
    ...body,
    effectiveDate: toISODatetime(body.effectiveDate),
  });
}
