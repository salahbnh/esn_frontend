import { expect, test } from "@playwright/test";

/**
 * Login flow through the real Keycloak hosted page.
 *
 * REQUIRES THE FULL STACK UP: frontend :3000, backend :4000, Keycloak :8080
 * (realm `esn`, client `esn-frontend`), Postgres + MinIO, and the seeded dev
 * user `rh@esn.local` / `password`. Run manually with `npm run test:e2e`.
 */
test("RH user can log in via Keycloak and land on the dashboard", async ({
  page,
}) => {
  await page.goto("/login");

  // App login screen → click the Keycloak CTA.
  await expect(
    page.getByRole("heading", { name: "Connectez-vous" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Keycloak/i }).click();

  // Keycloak hosted login form.
  await page.waitForURL(/\/realms\/esn\//);
  await page.fill("#username", "rh@esn.local");
  await page.fill("#password", "password");
  await page.click("#kc-login");

  // Back in the app on the dashboard, greeted with the role.
  await page.waitForURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /Bonjour/ }),
  ).toBeVisible();
  await expect(page.getByText("Ressources humaines")).toBeVisible();
});
