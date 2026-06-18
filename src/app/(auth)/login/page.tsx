import type { Metadata } from "next";

import { LoginButton } from "@/app/(auth)/login/login-button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fr } from "@/lib/i18n/fr";

export const metadata: Metadata = {
  title: fr.auth.signIn,
};

/** Public login screen. Centered card with the Keycloak sign-in CTA. */
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center space-y-4 text-center">
          <Logo />
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">{fr.auth.loginTitle}</CardTitle>
            <CardDescription>{fr.auth.loginSubtitle}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginButton />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {fr.app.fullName}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
