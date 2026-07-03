"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fr } from "@/lib/i18n/fr";
import { JobPostStatusBadge } from "@/features/job-posts/components/badges";
import { QueryBoundary } from "@/features/job-posts/query-boundary";
import { useJobPosts } from "@/features/job-posts/use-job-posts";

export function JobPostsListView() {
  const role = useSession().data?.user?.role ?? null;
  const canManage = role === "RH" || role === "DIRECTION";
  const query = useJobPosts({ pageSize: 100 });

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.jobPosts.title}
        subtitle={fr.jobPosts.subtitle}
        actions={
          canManage ? (
            <Button asChild>
              <Link href="/job-posts/new">
                <Plus className="h-4 w-4" />
                {fr.jobPosts.new}
              </Link>
            </Button>
          ) : undefined
        }
      />

      <QueryBoundary query={query}>
        {(list) => {
          const rows = list.data;
          if (rows.length === 0) {
            return <EmptyState title={fr.jobPosts.noResults} hint={fr.jobPosts.noResultsHint} />;
          }
          return (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{fr.jobPosts.jobTitle}</TableHead>
                    <TableHead>{fr.jobPosts.status.DRAFT}</TableHead>
                    <TableHead className="hidden sm:table-cell">{fr.jobPosts.employmentType}</TableHead>
                    <TableHead className="text-right">{fr.jobPosts.applications}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer">
                      <TableCell className="font-medium">
                        <Link href={`/job-posts/${p.id}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </TableCell>
                      <TableCell><JobPostStatusBadge status={p.status} /></TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {fr.jobPosts.employmentTypes[p.employmentType]}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{p._count.applications}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }}
      </QueryBoundary>
    </section>
  );
}
