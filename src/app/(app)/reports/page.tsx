import { redirect } from "next/navigation";

/** /reports → default to the occupancy report. */
export default function ReportsIndexPage() {
  redirect("/reports/occupancy");
}
