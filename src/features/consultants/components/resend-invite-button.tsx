"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import { consultantErrorMessage } from "@/features/consultants/form-helpers";
import { useResendConsultantInvite } from "@/features/consultants/use-consultants";

/**
 * Re-sends the consultant's set-password invite email (RH/DIRECTION action).
 * The API is the real authority — this button is UX; the route enforces the role.
 */
export function ResendInviteButton({ consultantId }: { consultantId: string }) {
  const mutation = useResendConsultantInvite(consultantId);

  return (
    <Button
      variant="outline"
      disabled={mutation.isPending}
      onClick={() =>
        mutation.mutate(undefined, {
          onSuccess: () => toast.success(fr.consultants.resendInviteSuccess),
          onError: (err) => toast.error(consultantErrorMessage(err)),
        })
      }
    >
      <Mail className="h-4 w-4" />
      {fr.consultants.resendInvite}
    </Button>
  );
}
