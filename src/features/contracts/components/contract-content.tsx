"use client";

import { Badge } from "@/components/ui/badge";
import { fr } from "@/lib/i18n/fr";
import type { ContractDetail } from "@/features/contracts/contracts.types";

/**
 * Read-only preview of the contract body. Shows the rendered template text and,
 * when placeholders are still unfilled, lists them so an author knows what's
 * left before the PDF can be generated. No template → nothing to render.
 */
export function ContractContent({ contract }: { contract: ContractDetail }) {
  const { prefilledData } = contract;
  const hasBody = Boolean(prefilledData.renderedBody.trim());
  const unfilled = prefilledData.unfilled;

  if (!hasBody) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {fr.contracts.noBody}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {unfilled.length > 0 ? (
        <div className="rounded-lg border border-role-rh/40 bg-role-rh/5 p-4">
          <p className="text-sm font-medium text-role-rh">
            {unfilled.length} {fr.contracts.missingFields}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {unfilled.map((f) => (
              <Badge key={f} variant="secondary">
                {f}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <article className="rounded-lg border bg-muted/30 p-6">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {prefilledData.renderedBody}
        </pre>
      </article>
    </div>
  );
}
