import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

/** Root entry: route to the dashboard if signed in, otherwise to login. */
export default async function RootPage() {
  const session = await getServerSession(authOptions);
  redirect(session ? "/dashboard" : "/login");
}
