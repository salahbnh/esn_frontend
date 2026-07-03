"use client";

import { use, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { fr } from "@/lib/i18n/fr";
import { ApplicationForm } from "@/features/public-jobs/components/application-form";
import { fetchPublicJob } from "@/features/public-jobs/public-jobs.api";
import type { PublicJobResult } from "@/features/public-jobs/public-jobs.types";

export default function PublicJobPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [result, setResult] = useState<PublicJobResult | null>(null);

  useEffect(() => {
    void fetchPublicJob(token).then(setResult);
  }, [token]);

  if (result === null) {
    return <p className="text-sm text-muted-foreground">{fr.publicJobs.loading}</p>;
  }

  if (result.kind === "not_found") {
    return <StateCard title={fr.publicJobs.notFoundTitle} body={fr.publicJobs.notFoundBody} />;
  }
  if (result.kind === "closed") {
    return <StateCard title={fr.publicJobs.closedTitle} body={fr.publicJobs.closedBody} />;
  }
  if (result.kind === "error") {
    return <StateCard title={fr.publicJobs.errorTitle} body={fr.publicJobs.errorBody} />;
  }

  const job = result.job;
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <Badge variant="secondary">{fr.jobPosts.employmentTypes[job.employmentType]}</Badge>
          {job.location ? <Badge variant="outline">{job.location}</Badge> : null}
          {job.seniorityLevel ? (
            <Badge variant="outline">{fr.jobPosts.seniorityLevels[job.seniorityLevel]}</Badge>
          ) : null}
        </div>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.description}</p>
        {job.requirements ? (
          <div>
            <h2 className="text-sm font-semibold">{fr.publicJobs.requirements}</h2>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.requirements}</p>
          </div>
        ) : null}
        {job.requiredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        ) : null}
      </header>

      <section className="rounded-lg border bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold">{fr.publicJobs.apply}</h2>
        <ApplicationForm job={job} />
      </section>
    </article>
  );
}

function StateCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border bg-background p-8 text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
