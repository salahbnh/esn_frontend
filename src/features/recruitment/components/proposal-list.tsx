"use client";

import { toast } from "sonner";

import { EmptyState } from "@/components/common/async-states";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { allowedProposalTransitions } from "@/features/recruitment/pipeline";
import { QueryBoundary } from "@/features/recruitment/query-boundary";
import {
  useProposals,
  useUpdateProposalStatus,
} from "@/features/recruitment/use-recruitment";
import type { Proposal } from "@/features/recruitment/recruitment.types";

/** French labels for known offer fields; unknown keys fall back to the raw key. */
const FIELD_LABELS: Record<string, string> = {
  contractType: fr.candidates.proposalFields.contractType,
  position: fr.candidates.proposalFields.position,
  tjm: fr.candidates.proposalFields.tjm,
  startDate: fr.candidates.proposalFields.startDate,
  duration: fr.candidates.proposalFields.duration,
  notes: fr.candidates.proposalFields.notes,
};

function renderValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  if (key === "startDate" && typeof value === "string") return formatDate(value);
  return String(value);
}

/**
 * Offer proposals. RH (`canManage`) gets status-transition controls; DIRECTION
 * sees them read-only. PDF download is deferred (`documentId` is always null).
 */
export function ProposalList({
  candidateId,
  canManage,
}: {
  candidateId: string;
  canManage: boolean;
}) {
  const query = useProposals(candidateId);
  const mutation = useUpdateProposalStatus(candidateId);

  async function changeStatus(proposal: Proposal, status: string) {
    try {
      await mutation.mutateAsync({
        proposalId: proposal.id,
        body: { status: status as "SENT" | "ACCEPTED" | "DECLINED" },
      });
      toast.success(fr.candidates.proposalUpdated);
    } catch {
      toast.error(fr.candidates.addError);
    }
  }

  return (
    <QueryBoundary query={query}>
      {(data) =>
        data.data.length === 0 ? (
          <EmptyState title={fr.candidates.noProposals} hint="" />
        ) : (
          <ul className="space-y-3">
            {data.data.map((p) => (
              <li key={p.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge kind="proposal" value={p.status} />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {Object.entries(p.content).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {FIELD_LABELS[key] ?? key}
                      </dt>
                      <dd className="text-sm">{renderValue(key, value)}</dd>
                    </div>
                  ))}
                </dl>
                {canManage && allowedProposalTransitions(p.status).length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allowedProposalTransitions(p.status).map((next) => (
                      <Button
                        key={next}
                        variant="outline"
                        size="sm"
                        disabled={mutation.isPending}
                        onClick={() => changeStatus(p, next)}
                      >
                        {fr.candidates.proposalAction[next]}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )
      }
    </QueryBoundary>
  );
}
