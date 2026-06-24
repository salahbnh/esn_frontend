/**
 * Typed contracts API — one function per `/api/contracts` endpoint (+ the
 * read-only templates list), bound to a token-aware `apiClient`. Date-only
 * inputs are expanded to ISO datetimes here.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  Contract,
  ContractAmendment,
  ContractAmendmentList,
  ContractDetail,
  ContractList,
  CreateContractAmendmentBody,
  CreateContractBody,
  ListContractsQuery,
  PaginationQuery,
  TemplateList,
  UpdateContractBody,
  ValidateStepBody,
} from "@/features/contracts/contracts.types";

type Client = ReturnType<typeof apiClient>;

function toISODatetime(dateStr: string): string {
  return dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
}

function withDates<T extends { startDate?: string; endDate?: string }>(
  body: T,
): T {
  return {
    ...body,
    startDate: body.startDate ? toISODatetime(body.startDate) : undefined,
    endDate: body.endDate ? toISODatetime(body.endDate) : undefined,
  };
}

// --- Contracts -------------------------------------------------------------

export function listContracts(
  client: Client,
  query: ListContractsQuery,
): Promise<ContractList> {
  return client.get<ContractList>("/contracts", {
    query: {
      status: query.status,
      consultantId: query.consultantId,
      type: query.type,
      search: query.search,
      includeArchived: query.includeArchived,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function getContract(
  client: Client,
  id: string,
): Promise<ContractDetail> {
  return client.get<ContractDetail>(`/contracts/${id}`);
}

export function createContract(
  client: Client,
  body: CreateContractBody,
): Promise<ContractDetail> {
  return client.post<ContractDetail>("/contracts", withDates(body));
}

export function updateContract(
  client: Client,
  id: string,
  body: UpdateContractBody,
): Promise<ContractDetail> {
  return client.patch<ContractDetail>(`/contracts/${id}`, withDates(body));
}

export function submitContract(
  client: Client,
  id: string,
): Promise<ContractDetail> {
  return client.patch<ContractDetail>(`/contracts/${id}/submit`, {});
}

export function validateContract(
  client: Client,
  id: string,
  body: ValidateStepBody,
): Promise<ContractDetail> {
  return client.patch<ContractDetail>(`/contracts/${id}/validate`, body);
}

export function generateContractPdf(
  client: Client,
  id: string,
): Promise<ContractDetail> {
  return client.post<ContractDetail>(`/contracts/${id}/generate-pdf`, {});
}

export function archiveContract(
  client: Client,
  id: string,
): Promise<Contract> {
  return client.patch<Contract>(`/contracts/${id}/archive`, {});
}

export function listContractAmendments(
  client: Client,
  id: string,
  query: PaginationQuery = {},
): Promise<ContractAmendmentList> {
  return client.get<ContractAmendmentList>(`/contracts/${id}/amendments`, {
    query: { page: query.page, pageSize: query.pageSize },
  });
}

export function createContractAmendment(
  client: Client,
  id: string,
  body: CreateContractAmendmentBody,
): Promise<ContractAmendment> {
  return client.post<ContractAmendment>(`/contracts/${id}/amendments`, {
    ...body,
    effectiveDate: toISODatetime(body.effectiveDate),
  });
}

// --- Templates (read-only — for the create picker) -------------------------

export function listTemplates(client: Client): Promise<TemplateList> {
  return client.get<TemplateList>("/contract-templates", {
    query: { pageSize: 100 },
  });
}
