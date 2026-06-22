import { expect, test, type Page } from "@playwright/test";

/**
 * M4 Consultants E2E. REQUIRES THE FULL STACK UP: frontend :3000, backend :4000,
 * Keycloak :8080 (realm `esn`, client `esn-frontend`), Postgres + MinIO, and the
 * seeded dev users (`rh@esn.local`, `manager@esn.local`, `consultant@esn.local`,
 * all `password`). Run manually: `npm run test:e2e`.
 *
 * These tests drive the real stack and mutate data (admin edit, status change,
 * self-edit). They avoid hardcoding status targets so they stay re-runnable.
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

test.describe("Consultants M4", () => {
  test("RH: list → detail → admin edit → status change", async ({ page }) => {
    await login(page, "rh@esn.local");
    await page.goto("/consultants");
    await expect(
      page.getByRole("heading", { name: "Consultants" }),
    ).toBeVisible();

    // Search narrows the table (Tom Girard has 0 active assignments → safe to
    // status-change without Staffing re-deriving it).
    await page.getByPlaceholder(/Rechercher un consultant/).fill("Tom");
    const row = page.getByRole("link", { name: /Tom Girard/ });
    await expect(row).toBeVisible();
    await row.click();
    await expect(
      page.getByRole("heading", { name: /Tom Girard/ }),
    ).toBeVisible();

    // Admin edit: update the bio.
    await page.getByRole("button", { name: "Modifier" }).click();
    const editDialog = page.getByRole("dialog");
    await editDialog
      .getByLabel("Biographie")
      .fill("Profil mis à jour par e2e.");
    await editDialog.getByRole("button", { name: "Enregistrer" }).click();
    await expect(editDialog).toBeHidden();

    // Status change: pick whatever transition is offered (no hardcoded target).
    await page.getByLabel("Nouveau statut").click();
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: "Mettre à jour" }).click();
    // The status badge remains visible after the update (in the header).
    await expect(
      page.getByRole("heading", { name: /Tom Girard/ }),
    ).toBeVisible();
  });

  test("CONSULTANT: /consultants redirects; /me profile + self-edit + /me/missions", async ({
    page,
  }) => {
    await login(page, "consultant@esn.local");

    // No access to the staff directory.
    await page.goto("/consultants");
    await page.waitForURL(/\/dashboard/);

    // Own profile.
    await page.goto("/me");
    await expect(
      page.getByRole("heading", { name: "Mon profil" }),
    ).toBeVisible();
    // No status-change control on the self profile.
    await expect(
      page.getByRole("heading", { name: "Changer le statut" }),
    ).toHaveCount(0);

    // Self-edit (narrow: seniority + bio only).
    await page.getByRole("button", { name: "Modifier" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Ancienneté").fill("4 ans");
    await dialog.getByRole("button", { name: "Enregistrer" }).click();
    await expect(dialog).toBeHidden();

    // Own missions.
    await page.goto("/me/missions");
    await expect(
      page.getByRole("heading", { name: "Mes missions" }),
    ).toBeVisible();
  });

  test("MANAGER: can view a consultant but has no admin edit nor Documents tab", async ({
    page,
  }) => {
    await login(page, "manager@esn.local");
    await page.goto("/consultants");
    await page
      .getByRole("link", { name: /Sara|Karim|Léa|Tom|Nina|Omar|Eva/ })
      .first()
      .click();

    await expect(page.getByRole("tab", { name: "Profil" })).toBeVisible();
    // Admin edit is RH/DIRECTION; Documents tab is RH/DIRECTION (not MANAGER).
    await expect(page.getByRole("button", { name: "Modifier" })).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "Documents" })).toHaveCount(0);
  });
});
