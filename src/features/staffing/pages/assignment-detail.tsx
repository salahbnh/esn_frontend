"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { AssignmentFormDialog } from "@/features/staffing/components/assignment-form-dialog";
import { AssignmentStatusControl } from "@/features/staffing/components/assignment-status-control";
import { QueryBoundary } from "@/features/staffing/query-boundary";
import { useAssignment } from "@/features/staffing/use-staffing";

export function AssignmentDetailView({ id }: { id: string }) {
  const { data: session } = useSession();
  const canManage =
    session?.user?.role === "MANAGER" || session?.user?.role === "DIRECTION";
  const query = useAssignment(id);

  return (
    <QueryBoundary query={query}>
      {(a) => (
        <section className="space-y-6">
          <PageHeader
            title={a.mission.project}
            actions={
              <>
                <StatusBadge kind="assignment" value={a.status} />
                {canManage ? <AssignmentFormDialog assignment={a} /> : null}
              </>
            }
          />

          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <Field label={fr.staffing.mission}>
              <Link
                href={`/missions/${a.missionId}`}
                className="text-primary hover:underline"
              >
                {a.mission.project}
              </Link>
            </Field>
            <Field label={fr.staffing.consultant}>
              <Link
                href={`/consultants/${a.consultantId}`}
                className="text-primary hover:underline"
              >
                {a.consultant.user.firstName} {a.consultant.user.lastName}
              </Link>
            </Field>
            <Field label={fr.staffing.roleOnMission}>
              {a.roleOnMission ?? "—"}
            </Field>
            <Field label={fr.staffing.allocation}>
              <span className="tabular-nums">{a.allocationPct} %</span>
            </Field>
            <Field label={fr.staffing.startDate}>
              {formatDate(a.startDate)}
            </Field>
            <Field label={fr.staffing.endDate}>{formatDate(a.endDate)}</Field>
          </dl>

          {canManage ? (
            <AssignmentStatusControl assignmentId={id} status={a.status} />
          ) : null}
        </section>
      )}
    </QueryBoundary>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
