import { Boxes } from "lucide-react";

import { cn } from "@/lib/utils";
import { fr } from "@/lib/i18n/fr";

/** App wordmark: an icon badge + the app name. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Boxes className="h-5 w-5" />
      </span>
      <span className="text-base font-semibold tracking-tight">
        {fr.app.name}
        <span className="ml-1 font-normal text-muted-foreground">
          Resources
        </span>
      </span>
    </div>
  );
}
