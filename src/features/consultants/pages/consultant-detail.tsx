"use client";

import { useSession } from "next-auth/react";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fr } from "@/lib/i18n/fr";
import { AdminEditDialog } from "@/features/consultants/components/admin-edit-dialog";
import { ConsultantDocumentsList } from "@/features/consultants/components/consultant-documents-list";
import { ConsultantProfile } from "@/features/consultants/components/consultant-profile";
import { ConsultantStatusControl } from "@/features/consultants/components/consultant-status-control";
import { ConsultantOccupancyLink } from "@/features/staffing/components/consultant-occupancy-link";
import { QueryBoundary } from "@/features/consultants/query-boundary";
import { useConsultant } from "@/features/consultants/use-consultants";

export function ConsultantDetailView({ id }: { id: string }) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const canAdminEdit = role === "RH" || role === "DIRECTION";
  const canChangeStatus =
    role === "RH" || role === "MANAGER" || role === "DIRECTION";
  // GET /:id/documents allows RH / DIRECTION (and CONSULTANT own) — not MANAGER.
  const canSeeDocs = role === "RH" || role === "DIRECTION";

  const query = useConsultant(id);

  return (
    <QueryBoundary query={query}>
      {(consultant) => (
        <section className="space-y-6">
          <PageHeader
            title={`${consultant.user.firstName} ${consultant.user.lastName}`}
            subtitle={consultant.position}
            actions={
              <>
                <StatusBadge kind="consultant" value={consultant.status} />
                <ConsultantOccupancyLink consultantId={consultant.id} />
                {canAdminEdit ? (
                  <AdminEditDialog consultant={consultant} />
                ) : null}
              </>
            }
          />

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">
                {fr.consultants.tabProfile}
              </TabsTrigger>
              {canSeeDocs ? (
                <TabsTrigger value="documents">
                  {fr.consultants.tabDocuments}
                </TabsTrigger>
              ) : null}
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ConsultantProfile consultant={consultant} />
              {canChangeStatus ? (
                <ConsultantStatusControl
                  consultantId={id}
                  status={consultant.status}
                />
              ) : null}
            </TabsContent>
            {canSeeDocs ? (
              <TabsContent value="documents">
                <ConsultantDocumentsList consultantId={id} />
              </TabsContent>
            ) : null}
          </Tabs>
        </section>
      )}
    </QueryBoundary>
  );
}
