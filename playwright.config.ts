import { defineConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: { baseURL },
});
