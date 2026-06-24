import { expect, test, type Page } from "@playwright/test";

/**
 * M7 Contracts E2E. REQUIRES THE FULL STACK UP: frontend :3000, backend :4000,
 * Keycloak :8080, Postgres + MinIO, and the seeded dev users (all `password`).
 * Run manually: `npm run test:e2e`.
 *
 * The main flow creates a fresh DRAFT contract, submits it, then walks the whole
 * RH → Manager → Direction validation circuit (re-logging in as each approver),
 * ending in "En attente de signature" — deterministic and re-runnable. Sign +
 * generate-PDF download are deferred to M8 and covered by manual testing.
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

test.describe("Contracts M7", () => {
  test("full validation circuit: RH creates + submits + approves, then Manager + Direction approve", async ({
    page,
  }) => {
    // --- RH: create a contract ---
    await login(page, "rh@esn.local");
    await page.goto("/contracts");
    await page.getByRole("button", { name: "Nouveau contrat" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel(/Consultant/).click();
    await page.getByRole("option").first().click();
    await dialog.getByLabel(/Type/).fill("CDI");
    await dialog.getByLabel(/Date de début/).fill("2026-09-01");
    await dialog.getByRole("button", { name: "Créer" }).click();

    // Navigated to the new contract detail (DRAFT).
    await page.waitForURL(/\/contracts\/[a-z0-9]+$/);
    const contractUrl = page.url();
    await expect(page.getByText("Brouillon").first()).toBeVisible();

    // --- RH: submit into validation ---
    await page.getByRole("button", { name: "Soumettre à validation" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Soumettre à validation" })
      .click();
    await expect(page.getByText("Validation interne").first()).toBeVisible();

    // --- RH: approve the RH step ---
    await page.getByRole("button", { name: "Approuver" }).click();
    await expect(page.getByText("Approuvé").first()).toBeVisible();

    // --- Manager: approve the Manager step ---
    await login(page, "manager@esn.local");
    await page.goto(contractUrl);
    await page.getByRole("button", { name: "Approuver" }).click();
    await expect(page.getByText("Approuvé").nth(1)).toBeVisible();

    // --- Direction: approve the final step → PENDING_SIGNATURE ---
    await login(page, "direction@esn.local");
    await page.goto(contractUrl);
    await page.getByRole("button", { name: "Approuver" }).click();
    await expect(
      page.getByText("En attente de signature").first(),
    ).toBeVisible();
  });

  test("MANAGER sees the list but cannot create", async ({ page }) => {
    await login(page, "manager@esn.local");
    await page.goto("/contracts");
    await expect(
      page.getByRole("heading", { name: "Contrats" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nouveau contrat" }),
    ).toHaveCount(0);
  });

  test("CONSULTANT: /contracts redirects to the dashboard", async ({ page }) => {
    await login(page, "consultant@esn.local");
    await page.goto("/contracts");
    await page.waitForURL(/\/dashboard/);
  });
});
