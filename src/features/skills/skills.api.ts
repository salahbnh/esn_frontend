/**
 * Typed Skills referential API — `/api/skills` (list = all roles; write = RH/DIRECTION).
 */

import type { apiClient } from "@/lib/api-client";
import type { Skill } from "@/lib/types";
import type {
  CreateSkillBody,
  ListSkillsQuery,
  SkillList,
  UpdateSkillBody,
} from "@/features/skills/skills.types";

type Client = ReturnType<typeof apiClient>;

export function listSkills(client: Client, query: ListSkillsQuery = {}): Promise<SkillList> {
  return client.get<SkillList>("/skills", {
    query: {
      search: query.search,
      category: query.category,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
}

export function createSkill(client: Client, body: CreateSkillBody): Promise<Skill> {
  return client.post<Skill>("/skills", body);
}

export function updateSkill(client: Client, id: string, body: UpdateSkillBody): Promise<Skill> {
  return client.patch<Skill>(`/skills/${id}`, body);
}

export function deleteSkill(client: Client, id: string): Promise<void> {
  return client.del<void>(`/skills/${id}`);
}
