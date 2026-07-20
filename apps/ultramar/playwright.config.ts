import { defineConfig, devices } from "@playwright/test";
import { loadE2eEnvironment } from "./tests/e2e/support/environment";

const appRoot = loadE2eEnvironment();

const configuredBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const baseURL = configuredBaseURL || "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 240_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  webServer: configuredBaseURL
    ? undefined
    : {
        command: "yarn build && yarn start --hostname 127.0.0.1 --port 3100",
        cwd: appRoot,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 240_000,
      },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
