import { test, expect } from "@playwright/test";

test.describe("LoginForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("prikazuje formu za prijavu", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Prijavite se" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Lozinka")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Prijavi se" }),
    ).toBeVisible();
  });
  test("uspešan login preusmerava na početnu", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Lozinka").fill("admin");
    await page.getByRole("button", { name: "Prijavi se" }).click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("neuspešan login prikazuje grešku", async ({ page }) => {
    await page.route("/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Niste ulogovani" }),
      });
    });

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Lozinka").fill("badpassword");
    await page.getByRole("button", { name: "Prijavi se" }).click();

    await expect(page.getByText("Niste ulogovani")).toBeVisible();
  });
});
