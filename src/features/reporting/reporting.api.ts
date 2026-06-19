/**
 * Typed reporting API — one function per `/api/reports/*` endpoint, bound to a
 * token-aware `apiClient`. Used by the TanStack Query hooks in `use-reporting`.
 */

import type { apiClient } from "@/lib/api-client";
import type {
  DateWindow,
  HrReport,
  MissionsReport,
  OccupancyReport,
  OwnDashboard,
  PipelineReport,
  SummaryReport,
} from "@/features/reporting/reporting.types";

type Client = ReturnType<typeof apiClient>;

/**
 * The date filter emits date-only strings (`YYYY-MM-DD`), but the API's window
 * schema requires full ISO-8601 datetimes with offset. Expand the window to the
 * full day: `from` at start-of-day, `to` at end-of-day (both UTC).
 */
function toWindowQuery(window: DateWindow): { from: string; to: string } {
  return {
    from: `${window.from}T00:00:00.000Z`,
    to: `${window.to}T23:59:59.999Z`,
  };
}

export function getOccupancy(client: Client): Promise<OccupancyReport> {
  return client.get<OccupancyReport>("/reports/occupancy");
}

export function getPipeline(
  client: Client,
  window: DateWindow,
): Promise<PipelineReport> {
  return client.get<PipelineReport>("/reports/pipeline", {
    query: toWindowQuery(window),
  });
}

export function getMissions(
  client: Client,
  window: DateWindow,
): Promise<MissionsReport> {
  return client.get<MissionsReport>("/reports/missions", {
    query: toWindowQuery(window),
  });
}

export function getHr(client: Client): Promise<HrReport> {
  return client.get<HrReport>("/reports/hr");
}

export function getSummary(client: Client): Promise<SummaryReport> {
  return client.get<SummaryReport>("/reports/summary");
}

export function getMyDashboard(client: Client): Promise<OwnDashboard> {
  return client.get<OwnDashboard>("/reports/me");
}
