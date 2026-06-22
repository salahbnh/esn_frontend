"use client";

import { EmptyState } from "@/components/common/async-states";
import { Badge } from "@/components/ui/badge";
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
import { QueryBoundary } from "@/features/consultants/query-boundary";
import { useConsultantDocuments } from "@/features/consultants/use-consultants";

/** Bytes → a short human label (Ko / Mo). */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Read-only document metadata. Upload/download is the Documents module (M8);
 * this only lists what exists. `storageKey` is never present in the payload.
 */
export function ConsultantDocumentsList({
  consultantId,
}: {
  consultantId: string;
}) {
  const query = useConsultantDocuments(consultantId);
  return (
    <QueryBoundary query={query}>
      {(data) =>
        data.data.length === 0 ? (
          <EmptyState
            title={fr.consultants.noDocuments}
            hint={fr.consultants.noDocumentsHint}
          />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{fr.consultants.docFilename}</TableHead>
                  <TableHead>{fr.consultants.docType}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {fr.consultants.docSize}
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {fr.consultants.docDate}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.filename}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doc.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                      {formatBytes(doc.sizeBytes)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                      {formatDate(doc.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      }
    </QueryBoundary>
  );
}
