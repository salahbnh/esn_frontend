/**
 * Consistent loading / empty / error states (French). Used across reporting
 * and every later module so async UX is uniform.
 */

import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import { cn } from "@/lib/utils";

function Wrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card/50 px-6 py-10 text-center",
        className,
      )}
      role="status"
    >
      {children}
    </div>
  );
}

export function LoadingState({
  label = fr.asyncStates.loading,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Wrapper className={className}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </Wrapper>
  );
}

export function EmptyState({
  title = fr.asyncStates.empty,
  hint = fr.asyncStates.emptyHint,
  icon,
  className,
}: {
  title?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Wrapper className={className}>
      <span className="text-muted-foreground">
        {icon ?? <Inbox className="h-6 w-6" />}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </Wrapper>
  );
}

export function ErrorState({
  title = fr.asyncStates.error,
  hint = fr.asyncStates.errorHint,
  onRetry,
  className,
}: {
  title?: string;
  hint?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Wrapper className={className}>
      <AlertCircle className="h-6 w-6 text-destructive" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {fr.asyncStates.retry}
        </Button>
      ) : null}
    </Wrapper>
  );
}
