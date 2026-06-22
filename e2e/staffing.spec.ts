import { expect, test, type Page } from "@playwright/test";

/**
 * M6 Staffing E2E. REQUIRES THE FULL STACK UP: frontend :3000, backend :4000,
 * Keycloak :8080, Postgres + MinIO, and the seeded dev users (all `password`).
 * Run manually: `npm run test:e2e`.
 *
 * The MANAGER flow creates a fresh client + (staffable) mission per run, then an
 * assignment on it, and confirms it — so it's deterministic and re-runnable. The
 * full activate→cascade + over-allocation force flows are covered by manual testing.
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

test.describe("Staffing M6", () => {
  test("MANAGER: create a client + mission, then create and confirm an assignment", async ({
    page,
  }) => {
    const unique = Date.now();
    const clientName = `E2E Staffing Client ${unique}`;
    const project = `E2E Staffing Mission ${unique}`;

    await login(page, "manager@esn.local");

    // Client.
    await page.goto("/clients");
    await page.getByRole("button", { name: "Nouveau client" }).click();
    await page.getByRole("dialog").getByLabel(/Nom/).fill(clientName);
    await page.getByRole("dialog").getByRole("button", { name: "Créer" }).click();
    await expect(page.getByRole("link", { name: clientName })).toBeVisible();

    // Mission (DRAFT → staffable).
    await page.goto("/missions");
    await page.getByRole("button", { name: "Nouvelle mission" }).click();
    const mDialog = page.getByRole("dialog");
    await mDialog.getByLabel("Client").click();
    await page.getByRole("option", { name: clientName }).click();
    await mDialog.getByLabel(/Projet/).fill(project);
    await mDialog.getByLabel(/Rôle/).fill("Dev Full-Stack");
    await mDialog.getByLabel(/TJM/).fill("650.00");
    await mDialog.getByLabel(/Date de début/).fill("2026-09-01");
    await mDialog.getByRole("button", { name: "Créer" }).click();
    await expect(page.getByRole("link", { name: project })).toBeVisible();

    // Assignment on that mission, first available consultant.
    await page.goto("/staffing");
    await page.getByRole("button", { name: "Nouvelle affectation" }).click();
    const aDialog = page.getByRole("dialog");
    await aDialog.getByLabel(/Mission/).click();
    await page.getByRole("option", { name: project }).click();
    await aDialog.getByLabel(/Consultant/).click();
    await page.getByRole("option").first().click();
    await aDialog.getByLabel(/Allocation/).fill("50");
    await aDialog.getByLabel(/Date de début/).fill("2026-09-01");
    await aDialog.getByRole("button", { name: "Créer" }).click();

    // Open it (filter the list by the mission) and confirm it.
    await page.getByLabel("Mission").click();
    await page.getByRole("option", { name: project }).click();
    await page.getByRole("link", { name: project }).first().click();
    await expect(page.getByText("Proposée").first()).toBeVisible();

    await page.getByLabel("Nouveau statut").click();
    await page.getByRole("option", { name: "Confirmée" }).click();
    await page.getByRole("button", { name: "Mettre à jour" }).click();
    await expect(page.getByText("Confirmée").first()).toBeVisible();
  });

  test("RH: sees assignments (no create); global occupancy is forbidden", async ({
    page,
  }) => {
    await login(page, "rh@esn.local");
    await page.goto("/staffing");
    await expect(
      page.getByRole("heading", { name: "Affectations" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nouvelle affectation" }),
    ).toHaveCount(0);

    // Global occupancy is MANAGER/DIRECTION only → RH bounced to /staffing.
    await page.goto("/staffing/occupancy");
    await page.waitForURL(/\/staffing$/);
  });

  test("CONSULTANT: /staffing redirects to the dashboard", async ({ page }) => {
    await login(page, "consultant@esn.local");
    await page.goto("/staffing");
    await page.waitForURL(/\/dashboard/);
  });
});
