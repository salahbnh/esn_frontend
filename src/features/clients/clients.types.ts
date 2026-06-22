/**
 * Clients DTOs — frontend mirror of `backend/src/modules/clients/*` + the Prisma
 * Client model. Keep in sync with the backend when the contract changes.
 */

import type { ISODateString, PaginatedResult } from "@/lib/types";

export interface Client {
  id: string;
  name: string;
  industry: string | null;
  contactName: string | null;
  contactEmail: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** `GET /clients/:id` — Client + a mission count. */
export interface ClientDetail extends Client {
  _missionCount: number;
}

export interface CreateClientBody {
  name: string;
  industry?: string;
  contactName?: string;
  contactEmail?: string;
}

export type UpdateClientBody = Partial<CreateClientBody>;

export interface ListClientsQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

export type ClientList = PaginatedResult<Client>;
