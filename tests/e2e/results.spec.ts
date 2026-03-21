import { test, expect } from "@playwright/test";

const VALID_ADDRESS = "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV";

test.describe("Results page", () => {
  test("redirects to home when no address is provided", async ({ page }) => {
    await page.goto("/results");
    await expect(page.getByText("No wallet address provided.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Go back" })).toBeVisible();
  });

  test("shows loading spinner while fetching data", async ({ page }) => {
    await page.route("**/functions/v1/wallet-check**", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({ json: {} });
    });

    await page.goto(`/results?address=${VALID_ADDRESS}&email=test@example.com`);
    await expect(page.locator(".animate-spin")).toBeVisible();
  });

  test("shows wallet results after data loads", async ({ page }) => {
    await page.goto(`/results?address=${VALID_ADDRESS}&email=test@example.com`);
    await expect(page.getByText("Wallet summary for")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Total Value")).toBeVisible();
    await expect(page.getByText("SOL Equivalent")).toBeVisible();
  });

  test("shows error banner when API is unavailable", async ({ page }) => {
    await page.route("**/functions/v1/wallet-check**", (route) =>
      route.fulfill({ status: 500, json: { error: "Internal server error" } })
    );

    await page.goto(`/results?address=${VALID_ADDRESS}&email=test@example.com`);
    await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 15000 });
    // Error banner should appear and fallback data displayed
    await expect(page.getByText(/API error|sample data|Showing sample/i)).toBeVisible({ timeout: 15000 });
  });

  test("shows rate-limit error message when API returns 429", async ({ page }) => {
    await page.route("**/functions/v1/wallet-check**", (route) =>
      route.fulfill({
        status: 429,
        json: { error: "rate_limited", message: "Too many requests. Please try again in a moment." },
      })
    );

    await page.goto(`/results?address=${VALID_ADDRESS}&email=test@example.com`);
    await expect(page.getByText("Too many requests. Please try again in a moment.")).toBeVisible({
      timeout: 15000,
    });
  });

  test("back link navigates to home", async ({ page }) => {
    await page.goto(`/results?address=${VALID_ADDRESS}&email=test@example.com`);
    await page.getByRole("link", { name: /back/i }).click();
    await expect(page).toHaveURL("/");
  });
});
