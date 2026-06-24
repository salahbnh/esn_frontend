"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { AddAmendmentDialog } from "@/features/contracts/components/add-amendment-dialog";
import { ArchiveContractButton } from "@/features/contracts/components/archive-contract-button";
import { ContractAmendmentList } from "@/features/contracts/components/contract-amendment-list";
import { ContractContent } from "@/features/contracts/components/contract-content";
import { ContractEditDialog } from "@/features/contracts/components/contract-edit-dialog";
import { ContractFieldsForm } from "@/features/contracts/components/contract-fields-form";
import { GeneratePdfButton } from "@/features/contracts/components/generate-pdf-button";
import { SubmitContractButton } from "@/features/contracts/components/submit-contract-button";
import { ValidateControl } from "@/features/contracts/components/validate-control";
import { ValidationTimeline } from "@/features/contracts/components/validation-timeline";
import { QueryBoundary } from "@/features/contracts/query-boundary";
import { useContract } from "@/features/contracts/use-contracts";
import type { ContractDetail } from "@/features/contracts/contracts.types";

export function ContractDetailView({ id }: { id: string }) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const canAuthor = role === "RH" || role === "DIRECTION";
  const query = useContract(id);

  return (
    <QueryBoundary query={query}>
      {(contract) => {
        const consultant = contract.consultant;
        const fullName = `${consultant.user.firstName} ${consultant.user.lastName}`;
        const isDraft = contract.status === "DRAFT";
        const isSigned = contract.status === "SIGNED";
        const canGeneratePdf =
          contract.status === "INTERNAL_VALIDATION" ||
          contract.status === "PENDING_SIGNATURE";
        return (
          <section className="space-y-6">
            <PageHeader
              title={fullName}
              subtitle={contract.type}
              actions={
                <>
                  <StatusBadge kind="contract" value={contract.status} />
                  {canAuthor && isDraft ? (
                    <>
                      <ContractEditDialog contract={contract} />
                      <SubmitContractButton contractId={id} />
                    </>
                  ) : null}
                  {canAuthor && canGeneratePdf ? (
                    <GeneratePdfButton contract={contract} />
                  ) : null}
                  {canAuthor && contract.status !== "ARCHIVED" ? (
                    <ArchiveContractButton contractId={id} />
                  ) : null}
                </>
              }
            />

            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">{fr.contracts.tabValidation}</TabsTrigger>
                <TabsTrigger value="content">
                  {fr.contracts.tabContent}
                </TabsTrigger>
                <TabsTrigger value="amendments">
                  {fr.contracts.tabAmendments}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6">
                <ContractInfo contract={contract} />
                <ValidationTimeline validations={contract.validations} />
                <ValidateControl contract={contract} />
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {canAuthor && isDraft ? (
                  <ContractFieldsForm contract={contract} />
                ) : null}
                <ContractContent contract={contract} />
              </TabsContent>

              <TabsContent value="amendments" className="space-y-4">
                {canAuthor && isSigned ? (
                  <div className="flex justify-end">
                    <AddAmendmentDialog contractId={id} />
                  </div>
                ) : null}
                <ContractAmendmentList contractId={id} />
              </TabsContent>
            </Tabs>
          </section>
        );
      }}
    </QueryBoundary>
  );
}

function ContractInfo({ contract }: { contract: ContractDetail }) {
  const consultant = contract.consultant;
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      <Field label={fr.contracts.consultant}>
        <Link
          href={`/consultants/${contract.consultantId}`}
          className="text-primary hover:underline"
        >
          {consultant.user.firstName} {consultant.user.lastName}
        </Link>
      </Field>
      <Field label={fr.contracts.type}>{contract.type}</Field>
      <Field label={fr.contracts.template}>
        {contract.template?.name ?? fr.contracts.noTemplate}
      </Field>
      <Field label={fr.contracts.status}>
        <StatusBadge kind="contract" value={contract.status} />
      </Field>
      <Field label={fr.contracts.startDate}>
        {formatDate(contract.startDate)}
      </Field>
      <Field label={fr.contracts.endDate}>{formatDate(contract.endDate)}</Field>
    </dl>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
