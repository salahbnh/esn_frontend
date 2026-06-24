"use client";

import { EmptyState } from "@/components/common/async-states";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { QueryBoundary } from "@/features/contracts/query-boundary";
import { useContractAmendments } from "@/features/contracts/use-contracts";

/** French labels for the structured `changes` keys; unknown keys fall back raw. */
const CHANGE_LABELS: Record<string, string> = {
  newType: fr.contracts.newType,
  newEndDate: fr.contracts.newEndDate,
  note: fr.contracts.note,
};

function renderChangeValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  if (key === "newEndDate" && typeof value === "string") return formatDate(value);
  return String(value);
}

/** Read-only list of contract amendments (most recent first). */
export function ContractAmendmentList({ contractId }: { contractId: string }) {
  const query = useContractAmendments(contractId);
  return (
    <QueryBoundary query={query}>
      {(data) =>
        data.data.length === 0 ? (
          <EmptyState title={fr.contracts.noAmendments} hint="" />
        ) : (
          <ul className="space-y-3">
            {data.data.map((a) => (
              <li key={a.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{a.reason}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {fr.contracts.amendmentEffectiveDate}:{" "}
                    {formatDate(a.effectiveDate)}
                  </span>
                </div>
                {Object.keys(a.changes).length > 0 ? (
                  <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {Object.entries(a.changes).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {CHANGE_LABELS[key] ?? key}
                        </dt>
                        <dd className="text-sm">
                          {renderChangeValue(key, value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            ))}
          </ul>
        )
      }
    </QueryBoundary>
  );
}
