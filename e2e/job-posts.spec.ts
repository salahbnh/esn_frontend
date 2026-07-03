import { expect, test, type Page } from "@playwright/test";

/**
 * Job Offers + public portal E2E. REQUIRES THE FULL STACK: frontend :3000,
 * backend :4000, Keycloak :8080, Postgres + MinIO, seeded dev users (`password`).
 * Run manually: `npm run test:e2e`.
 *
 * The round-trip: RH creates + publishes a job (with a custom question), an
 * ANONYMOUS visitor applies via the public token link (CV upload + consent),
 * then RH triages the application and links it into the ATS.
 */

const PDF = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");

async function login(page: Page, username: string) {
  await page.goto("/login");
  await page.getByRole("button", { name: /Keycloak/i }).click();
  await page.waitForURL(/\/realms\/esn\//);
  await page.fill("#username", username);
  await page.fill("#password", "password");
  await page.click("#kc-login");
  await page.waitForURL(/\/dashboard/);
}

test.describe("Job Offers", () => {
  test("publish → anonymous apply → RH links into ATS", async ({ page, browser }) => {
    const stamp = Date.now();
    const email = `e2e.applicant.${stamp}@example.com`;

    // --- RH: create a job post ---
    await login(page, "rh@esn.local");
    await page.goto("/job-posts");
    await page.getByRole("link", { name: "Nouvelle offre" }).click();
    await page.waitForURL(/\/job-posts\/new$/);

    await page.getByLabel(/Intitulé/).fill(`E2E Dev ${stamp}`);
    await page.getByLabel(/Description/).first().fill("Poste de test end-to-end.");
    await page.getByRole("button", { name: "Créer" }).click();
    await page.waitForURL(/\/job-posts\/[a-z0-9]+$/);
    const jobUrl = page.url();

    // --- Add an optional custom question ---
    await page.getByRole("tab", { name: "Questions" }).click();
    await page.getByRole("button", { name: "Ajouter une question" }).click();
    const qDialog = page.getByRole("dialog");
    await qDialog.getByLabel(/Clé/).fill("motivation");
    await qDialog.getByLabel(/Libellé/).fill("Votre motivation");
    await qDialog.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("motivation")).toBeVisible();

    // --- Publish and capture the public link ---
    await page.getByRole("tab", { name: "Aperçu" }).click();
    await page.getByRole("button", { name: "Publier" }).click();
    const linkCode = page.locator("code", { hasText: "/jobs/" });
    await expect(linkCode).toBeVisible();
    const publicUrl = (await linkCode.textContent())!.trim();
    expect(publicUrl).toContain("/jobs/");

    // --- ANONYMOUS visitor applies (fresh context, no session) ---
    const anon = await browser.newContext();
    const pub = await anon.newPage();
    await pub.goto(publicUrl);
    await expect(pub.getByRole("heading", { name: `E2E Dev ${stamp}` })).toBeVisible();

    await pub.getByLabel(/Prénom/).fill("Yasmine");
    await pub.getByLabel(/Nom/).fill("ElAmrani");
    await pub.getByLabel(/E-mail/).fill(email);
    await pub.getByLabel(/Votre motivation/).fill("Très motivée par ce poste.");
    await pub.setInputFiles("#cv", { name: "cv.pdf", mimeType: "application/pdf", buffer: PDF });
    await pub.getByRole("checkbox").check();
    await pub.getByRole("button", { name: /Envoyer ma candidature/ }).click();
    await expect(pub.getByText(/Candidature envoyée/)).toBeVisible();
    await anon.close();

    // --- RH: triage + link the application ---
    await page.goto(jobUrl);
    await page.getByRole("tab", { name: "Candidatures" }).click();
    await page.getByRole("link", { name: /Yasmine ElAmrani/ }).click();
    await page.waitForURL(/\/job-posts\/applications\/[a-z0-9]+$/);
    await expect(page.getByText(email)).toBeVisible();

    page.once("dialog", (d) => d.accept()); // confirm() on link
    await page.getByRole("button", { name: "Intégrer à l'ATS" }).click();
    await expect(page.getByText("Intégrée").first()).toBeVisible();

    // --- The applicant is now a Candidate (APPLIED) in the ATS ---
    await page.goto("/candidates");
    await expect(page.getByText("ElAmrani").first()).toBeVisible();
  });

  test("MANAGER can view offers but has no create action", async ({ page }) => {
    await login(page, "manager@esn.local");
    await page.goto("/job-posts");
    await expect(page.getByRole("link", { name: "Nouvelle offre" })).toHaveCount(0);
  });
});
