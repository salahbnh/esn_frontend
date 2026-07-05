/** Typed Users admin API — `/api/users` (list = staff read; writes = DIRECTION). */

import type { apiClient } from "@/lib/api-client";
import type {
  AdminUser,
  CreateUserBody,
  ListUsersQuery,
  UserList,
} from "@/features/users/users.types";

type Client = ReturnType<typeof apiClient>;

export function listUsers(client: Client, query: ListUsersQuery = {}): Promise<UserList> {
  return client.get<UserList>("/users", {
    query: { role: query.role, search: query.search, page: query.page, pageSize: query.pageSize },
  });
}

export function createUser(client: Client, body: CreateUserBody): Promise<AdminUser> {
  return client.post<AdminUser>("/users", body);
}

export function patchUserStatus(client: Client, id: string, isActive: boolean): Promise<AdminUser> {
  return client.patch<AdminUser>(`/users/${id}/status`, { isActive });
}

export function resendUserInvite(client: Client, id: string): Promise<void> {
  return client.post<void>(`/users/${id}/resend-invite`, {});
}
