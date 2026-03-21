import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the ClearSignal heading and wallet input", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("secretly trash");
    await expect(page.getByPlaceholder("Paste Solana wallet address")).toBeVisible();
    await expect(page.getByRole("button", { name: "Check my wallet" })).toBeVisible();
  });

  test("shows the Phantom connect button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /connect wallet/i })).toBeVisible();
  });

  test("displays validation error for an invalid address", async ({ page }) => {
    await page.getByPlaceholder("Paste Solana wallet address").fill("notavalidaddress");
    await page.getByRole("button", { name: "Check my wallet" }).click();
    await expect(page.getByText("Please enter a valid Solana wallet address.")).toBeVisible();
  });

  test("clears error when user starts typing", async ({ page }) => {
    await page.getByPlaceholder("Paste Solana wallet address").fill("bad");
    await page.getByRole("button", { name: "Check my wallet" }).click();
    await expect(page.getByText("Please enter a valid Solana wallet address.")).toBeVisible();

    await page.getByPlaceholder("Paste Solana wallet address").type("x");
    await expect(page.getByText("Please enter a valid Solana wallet address.")).not.toBeVisible();
  });

  test("opens email modal when a valid address is submitted", async ({ page }) => {
    const validAddress = "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV";
    await page.getByPlaceholder("Paste Solana wallet address").fill(validAddress);
    await page.getByRole("button", { name: "Check my wallet" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Almost there")).toBeVisible();
  });

  test("submits with Enter key on a valid address", async ({ page }) => {
    const validAddress = "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV";
    await page.getByPlaceholder("Paste Solana wallet address").fill(validAddress);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
