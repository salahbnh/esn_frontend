"use client";

/**
 * Render the right async state for a TanStack Query result and pass resolved
 * data to a render-prop. Mirror of the other feature boundaries.
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
