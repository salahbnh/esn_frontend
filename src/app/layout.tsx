import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "ESN Resource Manager",
  description:
    "Internal app to pilot the full consultant lifecycle: recruitment, consultants, staffing, missions, contracts, reporting.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
              {children}
            </main>
            <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-400">
              ESN Resource Manager — internal tool
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
