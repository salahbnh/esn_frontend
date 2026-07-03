import type { PaginatedResult, Skill } from "@/lib/types";

export type { Skill };

export interface CreateSkillBody {
  name: string;
  category?: string;
}

export interface UpdateSkillBody {
  name?: string;
  category?: string;
}

export interface ListSkillsQuery {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export type SkillList = PaginatedResult<Skill>;
