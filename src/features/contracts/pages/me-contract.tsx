"use client";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { fr } from "@/lib/i18n/fr";
import { formatDate } from "@/lib/format";
import { QueryBoundary } from "@/features/contracts/query-boundary";
import { ConsultantSignPanel } from "@/features/contracts/components/consultant-sign-panel";
import { canConsultantSign } from "@/features/contracts/contracts.workflow";
import { useMyContracts } from "@/features/contracts/use-contracts";
import type { Contract } from "@/features/contracts/contracts.types";

/** CONSULTANT self-service: read + sign/reject their own contracts. */
export function MeContractView() {
  const query = useMyContracts({ pageSize: 100 });

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.contracts.myContractsTitle}
        subtitle={fr.contracts.myContractsSubtitle}
      />

      <QueryBoundary query={query}>
        {(list) => {
          const pending = list.data.filter(canConsultantSign);
          const history = list.data.filter((c) => !canConsultantSign(c));

          if (list.data.length === 0) {
            return (
              <EmptyState
                title={fr.contracts.noMyContracts}
                hint={fr.contracts.noMyContractsHint}
              />
            );
          }

          return (
            <div className="space-y-8">
              {pending.length > 0 ? (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {fr.contracts.pendingSection}
                  </h2>
                  {pending.map((c) => (
                    <ConsultantSignPanel key={c.id} contract={c} />
                  ))}
                </div>
              ) : null}

              {history.length > 0 ? (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {fr.contracts.historySection}
                  </h2>
                  {history.map((c) => (
                    <HistoryRow key={c.id} contract={c} />
                  ))}
                </div>
              ) : null}
            </div>
          );
        }}
      </QueryBoundary>
    </section>
  );
}

function HistoryRow({ contract }: { contract: Contract }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">{contract.type}</p>
        <p className="text-sm text-muted-foreground">
          {fr.contracts.startDate}: {formatDate(contract.startDate)}
        </p>
      </div>
      <StatusBadge kind="contract" value={contract.status} />
    </div>
  );
}
