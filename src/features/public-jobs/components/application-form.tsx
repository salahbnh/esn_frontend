"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionField } from "@/features/public-jobs/components/question-field";
import { fetchPublicSkills, submitApplication } from "@/features/public-jobs/public-jobs.api";
import type { PublicJob } from "@/features/public-jobs/public-jobs.types";

type AnswerValue = string | number | boolean | string[] | undefined;

export function ApplicationForm({ job }: { job: PublicJob }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [cv, setCv] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // must stay empty
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    void fetchPublicSkills().then(setAllSkills);
  }, []);

  if (done) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <h2 className="text-lg font-semibold">Candidature envoyée ✓</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Merci — votre candidature a bien été reçue. Le recruteur reviendra vers vous.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!cv) {
      setError("Un CV (PDF ou DOCX) est requis.");
      return;
    }
    if (!consent) {
      setError("Vous devez accepter la politique de confidentialité.");
      return;
    }
    const form = new FormData();
    form.set("firstName", firstName);
    form.set("lastName", lastName);
    form.set("email", email);
    if (phone.trim()) form.set("phone", phone.trim());
    form.set("consentAccepted", consent ? "true" : "false");
    form.set("answers", JSON.stringify(answers));
    form.set("declaredSkillNames", JSON.stringify(skills));
    if (honeypot) form.set("hp_website", honeypot);
    form.set("cv", cv);
    if (coverLetter) form.set("coverLetter", coverLetter);

    setSubmitting(true);
    const res = await submitApplication(job.token, form);
    setSubmitting(false);
    if (res.ok) setDone(true);
    else setError(res.errorMessage ?? "Échec de l'envoi.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fn">Prénom *</Label>
          <Input id="fn" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ln">Nom *</Label>
          <Input id="ln" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="em">E-mail *</Label>
          <Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ph">Téléphone</Label>
          <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {/* Dynamic RH-defined questions */}
      {job.questions.map((q) => (
        <QuestionField
          key={q.key}
          question={q}
          value={answers[q.key]}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [q.key]: v }))}
        />
      ))}

      {allSkills.length > 0 ? (
        <div className="space-y-1.5">
          <Label>Compétences</Label>
          <div className="flex flex-wrap gap-1.5">
            {allSkills.map((name) => {
              const on = skills.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    setSkills((prev) => (on ? prev.filter((s) => s !== name) : [...prev, name]))
                  }
                  className={`rounded-full border px-3 py-1 text-sm ${
                    on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cv">CV (PDF ou DOCX) *</Label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setCv(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cl">Lettre de motivation (optionnel)</Label>
          <input
            id="cl"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setCoverLetter(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium"
          />
        </div>
      </div>

      {/* Honeypot — hidden from humans; bots that fill it are silently dropped. */}
      <input
        type="text"
        name="hp_website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
        />
        <span>
          J&apos;accepte que mes données soient traitées dans le cadre de ce recrutement
          (politique de confidentialité). *
        </span>
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Envoi…" : "Envoyer ma candidature"}
      </Button>
    </form>
  );
}
