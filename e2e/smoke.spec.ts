import { test, expect } from "@playwright/test";

test("home renders hero and services", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Nationwide Auto/i })
  ).toBeVisible();
  await expect(page.getByText("Our Best Services")).toBeVisible();
  await expect(page.getByText("John Smith")).toBeVisible();
});

test("contact page shows the quote form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText(/Request a/i).first()).toBeVisible();
  await expect(page.getByPlaceholder("Full Name")).toBeVisible();
});

test("multi-step quote form advances between steps", async ({ page }) => {
  await page.goto("/contact");
  await page.getByPlaceholder("Full Name").fill("Test User");
  await page.getByPlaceholder("Email Address").fill("test@example.com");
  await page.getByPlaceholder("Phone Number").fill("5551234567");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByPlaceholder("Year")).toBeVisible();
});

test("carriers page shows the application form", async ({ page }) => {
  await page.goto("/carriers");
  await expect(page.getByText("Carrier Application")).toBeVisible();
  await expect(page.getByPlaceholder("Acme Trucking LLC")).toBeVisible();
});

test("blog index loads", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByText("News & Insights")).toBeVisible();
});

test("admin redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(
    page.getByRole("heading", { name: "Admin Sign In" })
  ).toBeVisible();
});
