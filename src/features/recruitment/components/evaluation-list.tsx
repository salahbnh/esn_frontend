"use client";

import { EmptyState } from "@/components/common/async-states";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { QueryBoundary } from "@/features/recruitment/query-boundary";
import { useEvaluations } from "@/features/recruitment/use-recruitment";

/** Read-only list of candidate evaluations with per-criterion scores. */
export function EvaluationList({ candidateId }: { candidateId: string }) {
  const query = useEvaluations(candidateId);
  return (
    <QueryBoundary query={query}>
      {(data) =>
        data.data.length === 0 ? (
          <EmptyState title={fr.candidates.noEvaluations} hint="" />
        ) : (
          <ul className="space-y-3">
            {data.data.map((ev) => (
              <li key={ev.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">
                    {fr.candidates.overallScore}: {ev.overallScore}/10
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatDate(ev.createdAt)}
                  </span>
                </div>
                {Object.keys(ev.criteria).length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(ev.criteria).map(([name, score]) => (
                      <Badge key={name} variant="secondary">
                        {name}: {score}/10
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {ev.recommendation ? (
                  <p className="mt-3 text-sm">
                    <span className="text-muted-foreground">
                      {fr.candidates.recommendation}:{" "}
                    </span>
                    {ev.recommendation}
                  </p>
                ) : null}
                {ev.comment ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {ev.comment}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )
      }
    </QueryBoundary>
  );
}
