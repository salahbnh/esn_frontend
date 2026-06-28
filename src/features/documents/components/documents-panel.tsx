"use client";

import { useSession } from "next-auth/react";

import { EmptyState } from "@/components/common/async-states";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import type { EntityType } from "@/lib/types";
import { canUploadTo } from "@/features/documents/documents.matrix";
import { DocumentRowActions } from "@/features/documents/components/document-row-actions";
import { DocumentUploadDialog } from "@/features/documents/components/document-upload-dialog";
import { formatBytes } from "@/features/documents/form-helpers";
import { QueryBoundary } from "@/features/documents/query-boundary";
import { useDocuments } from "@/features/documents/use-documents";

/**
 * Reusable documents area for any entity: lists its documents with per-row
 * download/delete and a role-gated upload button. Authorization is mirrored from
 * the backend for UX only — the server re-checks everything.
 */
export function DocumentsPanel({
  entityType,
  entityId,
  isOwner = false,
}: {
  entityType: EntityType;
  entityId: string;
  isOwner?: boolean;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const canUpload = canUploadTo(role, entityType, isOwner);

  const ref = { entityType, entityId };
  const query = useDocuments(ref);

  return (
    <div className="space-y-4">
      {canUpload ? (
        <div className="flex justify-end">
          <DocumentUploadDialog entityType={entityType} entityId={entityId} />
        </div>
      ) : null}

      <QueryBoundary query={query}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.documents.noDocuments}
              hint={fr.documents.noDocumentsHint}
            />
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{fr.documents.filename}</TableHead>
                    <TableHead>{fr.documents.type}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {fr.documents.size}
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {fr.documents.date}
                    </TableHead>
                    <TableHead className="text-right">
                      {fr.documents.download}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.filename}
                      </TableCell>
                      <TableCell>
                        <StatusBadge kind="document" value={doc.type} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                        {formatBytes(doc.sizeBytes)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                        {formatDate(doc.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DocumentRowActions documentId={doc.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        }
      </QueryBoundary>
    </div>
  );
}
