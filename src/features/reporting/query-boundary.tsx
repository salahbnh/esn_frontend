"use client";

/**
 * Small helper to render the right async state for a TanStack Query result and
 * pass the resolved data to a render-prop. Handles 404 (NOT_FOUND) gracefully
 * with an EmptyState (e.g. a consultant with no profile yet).
 */

import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { EmptyState, ErrorState, LoadingState } from "@/components/common/async-states";
import { ApiError } from "@/lib/api-client";

export function QueryBoundary<T>({
  query,
  children,
  notFound,
}: {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
  /** Override the empty state shown on a 404. */
  notFound?: { title?: string; hint?: string };
}) {
  if (query.isPending) return <LoadingState />;

  if (query.isError) {
    const err = query.error;
    if (err instanceof ApiError && err.status === 404) {
      return <EmptyState title={notFound?.title} hint={notFound?.hint} />;
    }
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  return <>{children(query.data)}</>;
}
