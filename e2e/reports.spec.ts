import { expect, test, type Page } from "@playwright/test";

/**
 * M2 reporting E2E. REQUIRES THE FULL STACK UP: frontend :3000, backend :4000,
 * Keycloak :8080 (realm `esn`, client `esn-frontend`), Postgres + MinIO, and
 * the seeded dev users (`rh@esn.local`, `manager@esn.local`,
 * `consultant@esn.local`, all `password`). Run manually: `npm run test:e2e`.
 *
 * NOTE: the seeded `consultant@esn.local` has no demo Consultant profile, so
 * `/reports/me` may 404 — the dashboard handles this with a graceful
 * "Aucune fiche consultant" empty state rather than crashing.
 */

async function login(page: Page, username: string) {
  await page.goto("/login");
  await page.getByRole("button", { name: /Keycloak/i }).click();
  await page.waitForURL(/\/realms\/esn\//);
  await page.fill("#username", username);
  await page.fill("#password", "password");
  await page.click("#kc-login");
  await page.waitForURL(/\/dashboard/);
}

test.describe("Reporting M2", () => {
  test("RH dashboard shows all blocks; pipeline report renders the funnel", async ({
    page,
  }) => {
    await login(page, "rh@esn.local");

    // All four summary sections are present.
    await expect(page.getByText("Taux d'occupation").first()).toBeVisible();
    await expect(page.getByText("Missions", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Pipeline recrutement")).toBeVisible();
    await expect(page.getByText("Ressources humaines").first()).toBeVisible();

    // Pipeline report page renders.
    await page.goto("/reports/pipeline");
    await expect(
      page.getByRole("heading", { name: "Pipeline recrutement" }),
    ).toBeVisible();
    await expect(page.getByText("Entonnoir de recrutement")).toBeVisible();
  });

  test("MANAGER dashboard shows only occupancy + missions; /reports/hr is blocked", async ({
    page,
  }) => {
    await login(page, "manager@esn.local");

    await expect(page.getByText("Taux d'occupation").first()).toBeVisible();
    // Pipeline + HR sections are omitted for the manager.
    await expect(page.getByText("Pipeline recrutement")).toHaveCount(0);

    // The Pipeline + RH tabs are not offered in the reports sub-nav.
    await page.goto("/reports/occupancy");
    await expect(
      page.getByRole("link", { name: "Pipeline" }),
    ).toHaveCount(0);

    // Direct visit to a forbidden report redirects back to the dashboard.
    await page.goto("/reports/hr");
    await page.waitForURL(/\/dashboard/);
  });

  test("CONSULTANT sees the self-dashboard (own missions or graceful empty state)", async ({
    page,
  }) => {
    await login(page, "consultant@esn.local");

    // The self-dashboard heading is shown; either an active-missions list or
    // the "no profile" empty state — never a crash.
    await expect(page.getByRole("heading", { name: /Bonjour/ })).toBeVisible();
    const myMissions = page.getByText("Mes missions en cours");
    const noProfile = page.getByText("Aucune fiche consultant");
    await expect(myMissions.or(noProfile).first()).toBeVisible();

    // Consultants have no access to the reports area.
    await page.goto("/reports/occupancy");
    await page.waitForURL(/\/dashboard/);
  });
});
