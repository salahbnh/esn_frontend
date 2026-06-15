import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import type { ApiErrorShape } from "@/lib/types";

/**
 * Typed API client. The single place fetch + the backend base URL live.
 * Never scatter raw `fetch(url)` calls across the app — use these helpers.
 *
 * - Prefixes NEXT_PUBLIC_API_BASE_URL.
 * - Attaches `Authorization: Bearer <accessToken>` from the NextAuth session.
 * - Throws `ApiError` on non-2xx, parsing the backend `{ error: { code, message } }`.
 *
 * NOTE: this reads the session via `getServerSession`, so the helpers are meant
 * for Server Components / Route Handlers / Server Actions. For client-side
 * calls, pass an explicit token via `ApiRequestOptions.token` (e.g. from
 * `useSession().data?.accessToken`).
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface ApiRequestOptions {
  /** Explicit bearer token (use from client components). */
  token?: string;
  /** Extra headers merged over the defaults. */
  headers?: Record<string, string>;
  /** Forwarded to fetch (e.g. `cache`, `next`, `signal`). */
  init?: Omit<RequestInit, "method" | "body" | "headers">;
}

async function resolveToken(explicit?: string): Promise<string | undefined> {
  if (explicit) return explicit;
  // Server-side: read the access token from the NextAuth session.
  const session = await getServerSession(authOptions);
  return session?.accessToken;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {},
): Promise<T> {
  const token = await resolveToken(options.token);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options.init,
  });

  if (!res.ok) {
    let code = "UNKNOWN";
    let message = res.statusText || "Request failed";
    try {
      const parsed = (await res.json()) as Partial<ApiErrorShape>;
      if (parsed.error) {
        code = parsed.error.code ?? code;
        message = parsed.error.message ?? message;
      }
    } catch {
      // Non-JSON error body — keep the status-derived defaults.
    }
    throw new ApiError(res.status, code, message);
  }

  // 204 No Content → nothing to parse.
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("PATCH", path, body, options),
  del: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
