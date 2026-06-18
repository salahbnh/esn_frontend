"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";

/** Triggers the Keycloak hosted-login redirect, returning to /dashboard. */
export function LoginButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      className="w-full"
      size="lg"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        void signIn("keycloak", { callbackUrl: "/dashboard" });
      }}
    >
      <LogIn className="h-4 w-4" />
      {loading ? fr.actions.loading : fr.auth.signInWithKeycloak}
    </Button>
  );
}
