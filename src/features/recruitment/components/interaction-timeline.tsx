"use client";

import { EmptyState } from "@/components/common/async-states";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { QueryBoundary } from "@/features/recruitment/query-boundary";
import { useInteractions } from "@/features/recruitment/use-recruitment";

/** Read-only timeline of candidate interactions (most recent first). */
export function InteractionTimeline({ candidateId }: { candidateId: string }) {
  const query = useInteractions(candidateId);
  return (
    <QueryBoundary query={query}>
      {(data) =>
        data.data.length === 0 ? (
          <EmptyState title={fr.candidates.noInteractions} hint="" />
        ) : (
          <ul className="space-y-3">
            {data.data.map((it) => (
              <li
                key={it.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="secondary">
                    {fr.candidates.interactionTypes[it.type]}
                  </Badge>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatDate(it.occurredAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{it.summary}</p>
              </li>
            ))}
          </ul>
        )
      }
    </QueryBoundary>
  );
}
