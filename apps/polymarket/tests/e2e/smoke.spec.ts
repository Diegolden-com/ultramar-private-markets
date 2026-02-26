import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Next.js Supabase Starter" }),
  ).toBeVisible();
  await expect(page.getByText("Powered by")).toBeVisible();
});

test("dashboard page renders", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Signal Dashboard" }),
  ).toBeVisible();
  await expect(page.getByText("Live feed (MVP)")).toBeVisible();
});
