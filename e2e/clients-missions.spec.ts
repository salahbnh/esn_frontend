import { expect, test, type Page } from "@playwright/test";

/**
 * M5 Clients + Missions E2E. REQUIRES THE FULL STACK UP: frontend :3000,
 * backend :4000, Keycloak :8080 (realm `esn`), Postgres + MinIO, and the seeded
 * dev users (`rh@`, `manager@`, `consultant@esn.local`, all `password`). Run
 * manually: `npm run test:e2e`.
 *
 * The MANAGER flow creates a unique client + mission per run (so it's
 * re-runnable) and drives the full lifecycle.
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

test.describe("Clients + Missions M5", () => {
  test("MANAGER: create client → create mission → advance status → amend → archive", async ({
    page,
  }) => {
    const unique = Date.now();
    const clientName = `E2E Client ${unique}`;
    const project = `E2E Mission ${unique}`;

    await login(page, "manager@esn.local");

    // --- Create client ---
    await page.goto("/clients");
    await page.getByRole("button", { name: "Nouveau client" }).click();
    const clientDialog = page.getByRole("dialog");
    await clientDialog.getByLabel(/Nom/).fill(clientName);
    await clientDialog.getByRole("button", { name: "Créer" }).click();
    await expect(page.getByRole("link", { name: clientName })).toBeVisible();

    // --- Create mission for that client ---
    await page.goto("/missions");
    await page.getByRole("button", { name: "Nouvelle mission" }).click();
    const missionDialog = page.getByRole("dialog");
    await missionDialog.getByLabel("Client").click();
    await page.getByRole("option", { name: clientName }).click();
    await missionDialog.getByLabel(/Projet/).fill(project);
    await missionDialog.getByLabel(/Rôle/).fill("Dev Full-Stack");
    await missionDialog.getByLabel(/TJM/).fill("650.00");
    await missionDialog.getByLabel(/Date de début/).fill("2026-09-01");
    await missionDialog.getByRole("button", { name: "Créer" }).click();

    // Open the new mission.
    const row = page.getByRole("link", { name: project });
    await expect(row).toBeVisible();
    await row.click();
    await expect(page.getByRole("heading", { name: project })).toBeVisible();

    // --- Advance status DRAFT → STAFFED → IN_PROGRESS ---
    async function setStatus(label: string) {
      await page.getByLabel("Nouveau statut").click();
      await page.getByRole("option", { name: label }).click();
      await page.getByRole("button", { name: "Mettre à jour" }).click();
    }
    await setStatus("Staffée");
    await expect(page.getByText("Staffée").first()).toBeVisible();
    await setStatus("En cours");
    await expect(page.getByText("En cours").first()).toBeVisible();

    // --- Add an amendment ---
    await page.getByRole("tab", { name: "Avenants" }).click();
    await page.getByRole("button", { name: "Ajouter un avenant" }).click();
    const amendDialog = page.getByRole("dialog");
    await amendDialog.getByLabel(/Motif/).fill("Prolongation");
    await amendDialog.getByLabel(/Date d'effet/).fill("2026-10-01");
    await amendDialog.getByRole("button", { name: "Créer" }).click();
    await expect(page.getByText("Prolongation")).toBeVisible();

    // --- Archive ---
    await page.getByRole("button", { name: "Archiver" }).click();
    const archiveDialog = page.getByRole("dialog");
    await archiveDialog.getByRole("button", { name: "Archiver" }).click();
    await expect(page.getByText("Archivée").first()).toBeVisible();
  });

  test("RH: manages clients but missions are view-only (no write buttons)", async ({
    page,
  }) => {
    await login(page, "rh@esn.local");

    // Clients: RH can create.
    await page.goto("/clients");
    await expect(
      page.getByRole("button", { name: "Nouveau client" }),
    ).toBeVisible();

    // Missions: RH sees the list but cannot create.
    await page.goto("/missions");
    await expect(page.getByRole("heading", { name: "Missions" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nouvelle mission" }),
    ).toHaveCount(0);
  });

  test("CONSULTANT: /clients and /missions redirect to the dashboard", async ({
    page,
  }) => {
    await login(page, "consultant@esn.local");
    await page.goto("/clients");
    await page.waitForURL(/\/dashboard/);
    await page.goto("/missions");
    await page.waitForURL(/\/dashboard/);
  });
});
