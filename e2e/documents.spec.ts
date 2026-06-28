import { expect, test, type Page } from "@playwright/test";

/**
 * M8 Documents E2E. REQUIRES THE FULL STACK UP: frontend :3000, backend :4000,
 * Keycloak :8080, Postgres + MinIO, and the seeded dev users (all `password`).
 * Run manually: `npm run test:e2e`.
 *
 * Uploads use an in-memory PDF buffer (no fixture file). Filenames are unique per
 * run, so the suite is re-runnable. The RH flow cleans up after itself (delete);
 * the consultant flow leaves its own CV (consultants cannot delete — by design).
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

function pdf(name: string) {
  return {
    name,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\n% e2e test document\n"),
  };
}

test.describe("Documents M8", () => {
  test("RH uploads a CV to a consultant, sees it, then deletes it", async ({
    page,
  }) => {
    const filename = `e2e-cv-${Date.now()}.pdf`;
    await login(page, "rh@esn.local");

    await page.goto("/consultants");
    await page.locator("table a").first().click();
    await page.waitForURL(/\/consultants\/[a-z0-9]+$/);

    await page.getByRole("tab", { name: "Documents" }).click();
    await page.getByRole("button", { name: "Téléverser" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.locator("#doc-file").setInputFiles(pdf(filename));
    await dialog.getByRole("button", { name: "Téléverser" }).click();

    await expect(page.getByText(filename)).toBeVisible();

    // Delete it (RH/DIRECTION only) and confirm it's gone.
    await page.getByRole("button", { name: "Supprimer" }).first().click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Supprimer" })
      .click();
    await expect(page.getByText(filename)).toHaveCount(0);
  });

  test("CONSULTANT uploads their own CV but has no delete action", async ({
    page,
  }) => {
    const filename = `e2e-self-cv-${Date.now()}.pdf`;
    await login(page, "consultant@esn.local");

    await page.goto("/me");
    await page.getByRole("tab", { name: "Documents" }).click();
    await page.getByRole("button", { name: "Téléverser" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.locator("#doc-file").setInputFiles(pdf(filename));
    await dialog.getByRole("button", { name: "Téléverser" }).click();

    await expect(page.getByText(filename)).toBeVisible();
    // No delete action for a consultant.
    await expect(page.getByRole("button", { name: "Supprimer" })).toHaveCount(0);
  });
});
