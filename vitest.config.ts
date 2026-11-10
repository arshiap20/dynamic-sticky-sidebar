import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/unit/**/*.test.{ts,tsx}"],
          restoreMocks: true,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: 1024, height: 768 },
            instances: [{ browser: "chromium" }, { browser: "webkit" }],
          },
        },
      },
      {
        test: {
          name: "package",
          include: ["test/package/**/*.test.ts"],
          environment: "node",
          globalSetup: "test/package/setup.ts",
          testTimeout: 30_000,
        },
      },
    ],
  },
});
