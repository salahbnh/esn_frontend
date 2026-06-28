/**
 * The single backend integration point. Never scatter raw `fetch(url)` calls.
 *
 * - Prefixes `NEXT_PUBLIC_API_BASE_URL`.
 * - Attaches `Authorization: Bearer <token>` when a token is provided.
 * - Serializes a `query` object into a query string.
 * - Parses JSON and, on non-2xx, throws a typed `ApiError` built from the
 *   backend error envelope `{ error: { code, message, details? } }`.
 *
 * Token sourcing differs by environment, so the token is passed in explicitly:
 *  - Server (Server Components / Route Handlers): read it from the session and
 *    pass it, or use the `serverApi` helper.
 *  - Client: use the `useApi()` hook which reads it from the NextAuth session.
 */

import { env } from "@/lib/env";
import type { ApiErrorShape } from "@/lib/types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type QueryValue = string | number | boolean | null | undefined;

export interface ApiFetchOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Bearer token; omit for unauthenticated calls. */
  token?: string;
  /** Serialized into `?key=value` pairs (nullish values skipped). */
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  /** Forwarded to fetch (e.g. `cache`, `next`, `signal`). */
  init?: Omit<RequestInit, "method" | "body" | "headers">;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = env.apiBaseUrl.replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/** Core typed fetch. Throws `ApiError` on non-2xx. */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, token, query, headers, init } = options;

  // FormData (multipart uploads): send as-is and let the browser set the
  // `Content-Type` (with its multipart boundary) — never JSON-encode it.
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: finalHeaders,
    body:
      body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    let code = "UNKNOWN";
    let message = res.statusText || "Une erreur est survenue";
    let details: unknown;
    try {
      const parsed = (await res.json()) as Partial<ApiErrorShape>;
      if (parsed.error) {
        code = parsed.error.code ?? code;
        message = parsed.error.message ?? message;
        details = parsed.error.details;
      }
    } catch {
      // Non-JSON error body — keep status-derived defaults.
    }
    throw new ApiError(res.status, code, message, details);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Convenience verb wrappers bound to a token (server-side usage). */
export function apiClient(token?: string) {
  return {
    get: <T>(path: string, opts?: Omit<ApiFetchOptions, "method" | "body">) =>
      apiFetch<T>(path, { ...opts, token, method: "GET" }),
    post: <T>(path: string, body?: unknown, opts?: ApiFetchOptions) =>
      apiFetch<T>(path, { ...opts, token, method: "POST", body }),
    postForm: <T>(path: string, form: FormData, opts?: ApiFetchOptions) =>
      apiFetch<T>(path, { ...opts, token, method: "POST", body: form }),
    patch: <T>(path: string, body?: unknown, opts?: ApiFetchOptions) =>
      apiFetch<T>(path, { ...opts, token, method: "PATCH", body }),
    del: <T>(path: string, opts?: Omit<ApiFetchOptions, "method" | "body">) =>
      apiFetch<T>(path, { ...opts, token, method: "DELETE" }),
  };
}
