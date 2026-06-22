/**
 * Typed clients API — one function per `/api/clients` endpoint, bound to a
 * token-aware `apiClient`. Mirrors `recruitment.api.ts`.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  Client,
  ClientDetail,
  ClientList,
  CreateClientBody,
  ListClientsQuery,
  UpdateClientBody,
} from "@/features/clients/clients.types";

type Client_ = ReturnType<typeof apiClient>;

export function listClients(
  client: Client_,
  query: ListClientsQuery,
): Promise<ClientList> {
  return client.get<ClientList>("/clients", {
    query: { search: query.search, page: query.page, pageSize: query.pageSize },
  });
}

export function getClient(client: Client_, id: string): Promise<ClientDetail> {
  return client.get<ClientDetail>(`/clients/${id}`);
}

export function createClient(
  client: Client_,
  body: CreateClientBody,
): Promise<Client> {
  return client.post<Client>("/clients", body);
}

export function updateClient(
  client: Client_,
  id: string,
  body: UpdateClientBody,
): Promise<Client> {
  return client.patch<Client>(`/clients/${id}`, body);
}
