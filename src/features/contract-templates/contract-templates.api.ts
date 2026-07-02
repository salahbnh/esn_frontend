/**
 * Typed Contract-Templates API — `/api/contract-templates` (RH/DIRECTION write,
 * RH/MGR/DIR read). Reuses the `ContractTemplate` DTO from the contracts module.
 * Note: the backend has a `deactivate` but NO re-activate (PATCH rejects isActive).
 */

import type { apiClient } from "@/lib/api-client";
import type {
  ContractTemplate,
  TemplateList,
} from "@/features/contracts/contracts.types";

type Client = ReturnType<typeof apiClient>;

export interface ListTemplatesAdminQuery {
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface TemplateBody {
  name: string;
  body: string;
}

export function listTemplatesAdmin(
  client: Client,
  query: ListTemplatesAdminQuery,
): Promise<TemplateList> {
  return client.get<TemplateList>("/contract-templates", {
    query: {
      includeInactive: query.includeInactive,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function getTemplate(
  client: Client,
  id: string,
): Promise<ContractTemplate> {
  return client.get<ContractTemplate>(`/contract-templates/${id}`);
}

export function createTemplate(
  client: Client,
  body: TemplateBody,
): Promise<ContractTemplate> {
  return client.post<ContractTemplate>("/contract-templates", body);
}

export function updateTemplate(
  client: Client,
  id: string,
  body: Partial<TemplateBody>,
): Promise<ContractTemplate> {
  return client.patch<ContractTemplate>(`/contract-templates/${id}`, body);
}

export function deactivateTemplate(
  client: Client,
  id: string,
): Promise<ContractTemplate> {
  return client.patch<ContractTemplate>(
    `/contract-templates/${id}/deactivate`,
    {},
  );
}
