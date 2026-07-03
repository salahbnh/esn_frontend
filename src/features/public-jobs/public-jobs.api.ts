/**
 * Public portal fetch wrappers — UNAUTHENTICATED. Plain `fetch`, NO auth token,
 * NO cookies. Hits the backend's isolated /api/public surface.
 */

import { env } from "@/lib/env";
import type { PublicJobResult } from "@/features/public-jobs/public-jobs.types";

const base = env.apiBaseUrl.replace(/\/$/, "");

export async function fetchPublicJob(token: string): Promise<PublicJobResult> {
  try {
    const res = await fetch(`${base}/public/jobs/${encodeURIComponent(token)}`, {
      credentials: "omit",
    });
    if (res.status === 404) return { kind: "not_found" };
    if (res.status === 410) return { kind: "closed" };
    if (!res.ok) return { kind: "error" };
    return { kind: "ok", job: await res.json() };
  } catch {
    return { kind: "error" };
  }
}

export async function fetchPublicSkills(): Promise<string[]> {
  try {
    const res = await fetch(`${base}/public/skills`, { credentials: "omit" });
    if (!res.ok) return [];
    const data = (await res.json()) as { skills: { name: string }[] };
    return data.skills.map((s) => s.name);
  } catch {
    return [];
  }
}

export interface SubmitResult {
  ok: boolean;
  referenceId?: string;
  errorMessage?: string;
}

export async function submitApplication(token: string, form: FormData): Promise<SubmitResult> {
  try {
    const res = await fetch(`${base}/public/jobs/${encodeURIComponent(token)}/apply`, {
      method: "POST",
      body: form,
      credentials: "omit",
    });
    if (res.status === 202) {
      const data = (await res.json()) as { referenceId?: string };
      return { ok: true, ...(data.referenceId ? { referenceId: data.referenceId } : {}) };
    }
    if (res.status === 429) return { ok: false, errorMessage: "Trop de tentatives. Réessayez plus tard." };
    const data = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return { ok: false, errorMessage: data.error?.message ?? "Échec de l'envoi. Veuillez réessayer." };
  } catch {
    return { ok: false, errorMessage: "Échec de l'envoi. Veuillez réessayer." };
  }
}
