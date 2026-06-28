"use client";

import type { ReactNode } from "react";

import { PageHeader } from "@/components/common/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fr } from "@/lib/i18n/fr";
import { ClientFormDialog } from "@/features/clients/components/client-form-dialog";
import { DocumentsPanel } from "@/features/documents/components/documents-panel";
import { QueryBoundary } from "@/features/clients/query-boundary";
import { useClient } from "@/features/clients/use-clients";

export function ClientDetailView({ id }: { id: string }) {
  const query = useClient(id);

  return (
    <QueryBoundary query={query}>
      {(client) => (
        <section className="space-y-6">
          <PageHeader
            title={client.name}
            subtitle={client.industry ?? undefined}
            actions={<ClientFormDialog client={client} />}
          />

          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">{fr.clients.tabInfo}</TabsTrigger>
              <TabsTrigger value="documents">{fr.documents.title}</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <Field label={fr.clients.industry}>
                  {client.industry ?? "—"}
                </Field>
                <Field label={fr.clients.missionCount}>
                  <span className="tabular-nums">{client._missionCount}</span>
                </Field>
                <Field label={fr.clients.contactName}>
                  {client.contactName ?? "—"}
                </Field>
                <Field label={fr.clients.contactEmail}>
                  {client.contactEmail ?? "—"}
                </Field>
              </dl>
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsPanel entityType="CLIENT" entityId={id} />
            </TabsContent>
          </Tabs>
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
