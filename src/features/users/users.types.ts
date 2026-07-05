import type { ISODateString, PaginatedResult, Role } from "@/lib/types";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: ISODateString;
}

export type StaffRole = "RH" | "MANAGER" | "DIRECTION";

export interface CreateUserBody {
  firstName: string;
  lastName: string;
  role: StaffRole;
}

export interface ListUsersQuery {
  role?: Role;
  search?: string;
  page?: number;
  pageSize?: number;
}

export type UserList = PaginatedResult<AdminUser>;
