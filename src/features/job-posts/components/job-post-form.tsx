"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "@/lib/i18n/fr";
import { SkillPicker } from "@/features/skills/components/skill-picker";
import { jobPostErrorMessage } from "@/features/job-posts/form-helpers";
import { useCreateJobPost, useUpdateJobPost } from "@/features/job-posts/use-job-posts";
import type {
  EmploymentType,
  JobPostBody,
  JobPostDetail,
  SeniorityLevel,
} from "@/features/job-posts/job-posts.types";

const EMPLOYMENT: EmploymentType[] = ["CDI", "CDD", "STAGE", "FREELANCE"];
const SENIORITY: SeniorityLevel[] = ["JUNIOR", "CONFIRMED", "SENIOR", "LEAD"];

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(["CDI", "CDD", "STAGE", "FREELANCE"]),
  seniorityLevel: z.enum(["JUNIOR", "CONFIRMED", "SENIOR", "LEAD"]).optional(),
  minYearsExperience: z.string().optional(),
  expiresAt: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function blank(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

/** Create (no post) or edit (with post). RH/DIRECTION. */
export function JobPostForm({ post }: { post?: JobPostDetail }) {
  const isEdit = Boolean(post);
  const router = useRouter();
  const [skillIds, setSkillIds] = useState<string[]>(post?.requiredSkills.map((s) => s.id) ?? []);
  const createMutation = useCreateJobPost();
  const updateMutation = useUpdateJobPost(post?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      description: post?.description ?? "",
      requirements: post?.requirements ?? "",
      location: post?.location ?? "",
      employmentType: post?.employmentType ?? "CDI",
      seniorityLevel: post?.seniorityLevel ?? undefined,
      minYearsExperience: post?.minYearsExperience != null ? String(post.minYearsExperience) : "",
      expiresAt: post?.expiresAt ? post.expiresAt.slice(0, 10) : "",
    },
  });

  const onSubmit = handleSubmit(async (v) => {
    const body: JobPostBody = {
      title: v.title.trim(),
      description: v.description.trim(),
      employmentType: v.employmentType,
      skillIds,
      ...(blank(v.requirements) ? { requirements: v.requirements!.trim() } : {}),
      ...(blank(v.location) ? { location: v.location!.trim() } : {}),
      ...(v.seniorityLevel ? { seniorityLevel: v.seniorityLevel } : {}),
      ...(blank(v.minYearsExperience) ? { minYearsExperience: Number(v.minYearsExperience) } : {}),
      ...(blank(v.expiresAt) ? { expiresAt: new Date(v.expiresAt!).toISOString() } : {}),
    };
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(body);
        toast.success(fr.jobPosts.updateSuccess);
        router.push(`/job-posts/${post!.id}`);
      } else {
        const created = await createMutation.mutateAsync(body);
        toast.success(fr.jobPosts.createSuccess);
        router.push(`/job-posts/${created.id}`);
      }
    } catch (err) {
      toast.error(jobPostErrorMessage(err));
    }
  });

  const employmentType = watch("employmentType");
  const seniorityLevel = watch("seniorityLevel");

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">{fr.jobPosts.jobTitle} *</Label>
        <Input id="title" {...register("title")} />
        {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">{fr.jobPosts.description} *</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="requirements">{fr.jobPosts.requirements}</Label>
        <Textarea id="requirements" rows={3} {...register("requirements")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{fr.jobPosts.employmentType} *</Label>
          <Select value={employmentType} onValueChange={(v) => setValue("employmentType", v as EmploymentType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {EMPLOYMENT.map((e) => (
                <SelectItem key={e} value={e}>{fr.jobPosts.employmentTypes[e]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{fr.jobPosts.seniorityLevel}</Label>
          <Select
            value={seniorityLevel ?? ""}
            onValueChange={(v) => setValue("seniorityLevel", v as SeniorityLevel)}
          >
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              {SENIORITY.map((s) => (
                <SelectItem key={s} value={s}>{fr.jobPosts.seniorityLevels[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="location">{fr.jobPosts.location}</Label>
          <Input id="location" {...register("location")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="minYears">{fr.jobPosts.minYearsExperience}</Label>
          <Input id="minYears" inputMode="numeric" {...register("minYearsExperience")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expiresAt">{fr.jobPosts.expiresAt}</Label>
          <Input id="expiresAt" type="date" {...register("expiresAt")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{fr.jobPosts.requiredSkills}</Label>
        <SkillPicker value={skillIds} onChange={setSkillIds} />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {fr.jobPosts.cancel}
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {isEdit ? fr.jobPosts.save : fr.jobPosts.create}
        </Button>
      </div>
    </form>
  );
}
