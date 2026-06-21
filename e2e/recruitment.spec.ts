import { expect, test, type Page } from "@playwright/test";

/**
 * M3 Recruitment (ATS) E2E. REQUIRES THE FULL STACK UP: frontend :3000,
 * backend :4000, Keycloak :8080 (realm `esn`, client `esn-frontend`), Postgres
 * + MinIO, and the seeded dev users (`rh@esn.local`, `manager@esn.local`,
 * `consultant@esn.local`, all `password`). Run manually: `npm run test:e2e`.
 *
 * Tests that create data use a unique email per run, so the spec is re-runnable.
 * The convert flow provisions a Keycloak account (unique each run) — an inherent
 * side effect of exercising real provisioning.
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

test.describe("Recruitment M3", () => {
  test("RH: create candidate → advance pipeline → add interaction → convert to consultant", async ({
    page,
  }) => {
    const unique = Date.now();
    const first = "E2E";
    const last = `Candidat${unique}`;
    const email = `e2e-${unique}@test.local`;

    await login(page, "rh@esn.local");
    await page.goto("/candidates");
    await expect(
      page.getByRole("heading", { name: "Candidats" }),
    ).toBeVisible();

    // --- Create ---
    await page.getByRole("button", { name: "Nouveau candidat" }).click();
    const createDialog = page.getByRole("dialog");
    await createDialog.getByLabel(/Prénom/).fill(first);
    await createDialog.getByLabel(/^Nom/).fill(last);
    await createDialog.getByLabel(/Email/).fill(email);
    await createDialog.getByLabel(/Poste visé/).fill("Dev Full-Stack");
    await createDialog.getByRole("button", { name: "Créer" }).click();

    // Appears in the list → open the detail.
    const row = page.getByRole("link", { name: `${first} ${last}` });
    await expect(row).toBeVisible();
    await row.click();
    await expect(
      page.getByRole("heading", { name: `${first} ${last}` }),
    ).toBeVisible();
    await expect(page.getByText("Candidature").first()).toBeVisible();

    // --- Pipeline: APPLIED → INTERVIEW → VALIDATED ---
    async function transitionTo(label: string) {
      await page.getByLabel("Nouveau statut").click();
      await page.getByRole("option", { name: label }).click();
      await page.getByRole("button", { name: "Mettre à jour" }).click();
    }
    await transitionTo("Entretien");
    await expect(page.getByText("Entretien").first()).toBeVisible();
    await transitionTo("Validé");
    await expect(page.getByText("Validé").first()).toBeVisible();

    // --- Add an interaction ---
    await page.getByRole("tab", { name: "Interactions" }).click();
    const panel = page.getByRole("tabpanel");
    await panel.getByRole("button", { name: "Ajouter" }).click();
    const interactionDialog = page.getByRole("dialog");
    await interactionDialog
      .getByLabel("Résumé")
      .fill("Entretien technique concluant.");
    await interactionDialog.getByRole("button", { name: "Ajouter" }).click();
    await expect(
      page.getByText("Entretien technique concluant."),
    ).toBeVisible();

    // --- Convert to consultant (VALIDATED only) ---
    await page
      .getByRole("button", { name: "Convertir en consultant" })
      .click();
    const convertDialog = page.getByRole("dialog");
    await convertDialog.getByLabel(/TJM/).fill("650.00");
    await convertDialog
      .getByRole("button", { name: "Convertir", exact: true })
      .click();

    // Candidate is now HIRED and the convert button is gone.
    await expect(page.getByText("Recruté").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Convertir en consultant" }),
    ).toHaveCount(0);
  });

  test("MANAGER: can view candidates but cannot create/edit; no Proposals tab", async ({
    page,
  }) => {
    await login(page, "manager@esn.local");
    await page.goto("/candidates");
    await expect(page.getByRole("heading", { name: "Candidats" })).toBeVisible();

    // No create action for a manager.
    await expect(
      page.getByRole("button", { name: "Nouveau candidat" }),
    ).toHaveCount(0);

    // Open a (seeded) candidate detail.
    await page.getByRole("link", { name: /Hugo|Jade|Lucas|Manon|Noah|Inès|Adam/ }).first().click();
    await expect(page.getByRole("tab", { name: "Interactions" })).toBeVisible();

    // No edit, no Proposals tab; interactions remain available.
    await expect(page.getByRole("button", { name: "Modifier" })).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "Propositions" })).toHaveCount(0);
  });

  test("CONSULTANT: /candidates redirects to the dashboard", async ({ page }) => {
    await login(page, "consultant@esn.local");
    await page.goto("/candidates");
    await page.waitForURL(/\/dashboard/);
  });
});
