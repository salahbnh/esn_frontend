"use client";

import { Award, Briefcase, CalendarDays, CalendarOff, Percent, User, UsersRound } from "lucide-react";
import { InfoField, InfoGrid } from "@/components/common/info-grid";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
          <PageHeader icon={UsersRound} accent="staffing"
            title={a.mission.project}
            actions={
              <>
                <StatusBadge kind="assignment" value={a.status} />
                {canManage ? <AssignmentFormDialog assignment={a} /> : null}
              </>
            }
          />

          <InfoGrid>
            <InfoField label={fr.staffing.mission} icon={Briefcase}>
              <Link
                href={`/missions/${a.missionId}`}
                className="text-primary hover:underline"
              >
                {a.mission.project}
              </Link>
            </InfoField>
            <InfoField label={fr.staffing.consultant} icon={User}>
              <Link
                href={`/consultants/${a.consultantId}`}
                className="text-primary hover:underline"
              >
                {a.consultant.user.firstName} {a.consultant.user.lastName}
              </Link>
            </InfoField>
            <InfoField label={fr.staffing.roleOnMission} icon={Award}>
              {a.roleOnMission ?? "—"}
            </InfoField>
            <InfoField label={fr.staffing.allocation} icon={Percent}>
              <span className="tabular-nums">{a.allocationPct} %</span>
            </InfoField>
            <InfoField label={fr.staffing.startDate} icon={CalendarDays}>
              {formatDate(a.startDate)}
            </InfoField>
            <InfoField label={fr.staffing.endDate} icon={CalendarOff}>{formatDate(a.endDate)}</InfoField>
          </InfoGrid>

          {canManage ? (
            <AssignmentStatusControl assignmentId={id} status={a.status} />
          ) : null}
        </section>
      )}
    </QueryBoundary>
  );
}

