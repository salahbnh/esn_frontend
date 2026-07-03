"use client";

import Link from "next/link";

import { EmptyState } from "@/components/common/async-states";
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
import { ApplicationStatusBadge } from "@/features/job-posts/components/badges";
import { QueryBoundary } from "@/features/job-posts/query-boundary";
import { useApplications } from "@/features/job-posts/use-job-posts";

export function ApplicationList({ jobPostId }: { jobPostId: string }) {
  const query = useApplications(jobPostId);
  return (
    <QueryBoundary query={query}>
      {(list) =>
        list.data.length === 0 ? (
          <EmptyState title={fr.jobPosts.noApplications} />
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{fr.jobPosts.applicant}</TableHead>
                  <TableHead>{fr.jobPosts.appStatus}</TableHead>
                  <TableHead className="hidden sm:table-cell">{fr.jobPosts.receivedAt}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <Link href={`/job-posts/applications/${a.id}`} className="hover:underline">
                        {a.firstName} {a.lastName}
                      </Link>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                    </TableCell>
                    <TableCell><ApplicationStatusBadge status={a.status} /></TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(a.createdAt)}
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
