/**
 * Typed staffing API — one function per `/api/staffing` endpoint, bound to a
 * token-aware `apiClient`. Date-only inputs are expanded to ISO datetimes here.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  Assignment,
  AssignmentList,
  AssignmentStatusChangeBody,
  ConsultantOccupancy,
  CreateAssignmentBody,
  GlobalOccupancyList,
  ListAssignmentsQuery,
  PaginationQuery,
  SuggestionList,
  UpdateAssignmentBody,
} from "@/features/staffing/staffing.types";

type Client = ReturnType<typeof apiClient>;

function toISODatetime(dateStr: string): string {
  return dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
}

export function listAssignments(
  client: Client,
  query: ListAssignmentsQuery,
): Promise<AssignmentList> {
  return client.get<AssignmentList>("/staffing/assignments", {
    query: {
      missionId: query.missionId,
      consultantId: query.consultantId,
      status: query.status,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function getAssignment(
  client: Client,
  id: string,
): Promise<Assignment> {
  return client.get<Assignment>(`/staffing/assignments/${id}`);
}

export function createAssignment(
  client: Client,
  body: CreateAssignmentBody,
): Promise<Assignment> {
  return client.post<Assignment>("/staffing/assignments", {
    ...body,
    startDate: toISODatetime(body.startDate),
    endDate: body.endDate ? toISODatetime(body.endDate) : undefined,
  });
}

export function updateAssignment(
  client: Client,
  id: string,
  body: UpdateAssignmentBody,
): Promise<Assignment> {
  return client.patch<Assignment>(`/staffing/assignments/${id}`, {
    ...body,
    startDate: body.startDate ? toISODatetime(body.startDate) : undefined,
    endDate: body.endDate ? toISODatetime(body.endDate) : undefined,
  });
}

export function changeAssignmentStatus(
  client: Client,
  id: string,
  body: AssignmentStatusChangeBody,
): Promise<Assignment> {
  return client.patch<Assignment>(`/staffing/assignments/${id}/status`, body);
}

export function getConsultantOccupancy(
  client: Client,
  consultantId: string,
): Promise<ConsultantOccupancy> {
  return client.get<ConsultantOccupancy>(`/staffing/occupancy/${consultantId}`);
}

export function listGlobalOccupancy(
  client: Client,
  query: PaginationQuery = {},
): Promise<GlobalOccupancyList> {
  return client.get<GlobalOccupancyList>("/staffing/occupancy", {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

export function getSuggestions(
  client: Client,
  missionId: string,
  query: PaginationQuery = {},
): Promise<SuggestionList> {
  return client.get<SuggestionList>("/staffing/suggestions", {
    query: { missionId, page: query.page, pageSize: query.pageSize },
  });
}
