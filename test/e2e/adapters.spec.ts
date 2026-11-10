import { expect, test, type Page } from "@playwright/test";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

const CSS = `body{margin:0}.hdr{position:sticky;top:0;height:70px;background:#ddd;display:block;z-index:9}
.layout{display:grid;grid-template-columns:280px 1fr;gap:20px;align-items:start;margin-top:20px}
.item{height:50px;margin-bottom:8px;background:#eee}.main{height:8000px;background:#fafafa}`;

const frameworks = {
  react: { file: "react-app.tsx", hook: "hook", component: "component" },
  vue: { file: "vue-app.ts", hook: "composable", component: "directive" },
} as const;

async function bundle(file: string) {
  const out = await build({
    entryPoints: [fileURLToPath(new URL(`fixtures/${file}`, import.meta.url))],
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    define: {
      "process.env.NODE_ENV": '"production"',
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    },
  });
  return out.outputFiles[0].text;
}

const sidebarRect = (page: Page) =>
  page.evaluate(() => {
    const r = document.getElementById("sidebar")!.getBoundingClientRect();
    return { top: r.top, bottomGap: innerHeight - r.bottom };
  });

const expectNear = (actual: number, expected: number) =>
  expect(Math.abs(actual - expected), `${actual} ≈ ${expected}`).toBeLessThan(
    1.5,
  );

async function scroll(page: Page, dy: number, steps: number) {
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => scrollBy(0, d), dy);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(300);
}

for (const [fw, { file, ...names }] of Object.entries(frameworks)) {
  test.describe(fw, () => {
    let js = "";
    test.beforeAll(async () => {
      js = await bundle(file);
    });

    for (const which of ["hook", "component"] as const) {
      const expectedTop = which === "hook" ? 86 : 90;

      test(names[which], async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.setViewportSize({ width: 1200, height: 700 });
        await page.setContent(
          `<style>${CSS}</style><div id="app"></div><script>${js}</script>`,
        );
        await page.evaluate((w) => window.mount(w), which);
        await page.waitForTimeout(100);

        expect(
          await page.evaluate(
            () => document.getElementById("sidebar")!.style.top,
          ),
        ).toBe(`${expectedTop}px`);

        await scroll(page, 80, 40);
        expectNear((await sidebarRect(page)).bottomGap, 16);

        await scroll(page, -80, 25);
        expectNear((await sidebarRect(page)).top, expectedTop);

        if (which === "hook") {
          await page.evaluate(() => window.setGap(30));
          await page.waitForTimeout(100);
          expectNear((await sidebarRect(page)).top, 100);
        }

        const leaked = await page.evaluate(() => {
          const el = document.getElementById("sidebar")!;
          window.unmount();
          return el.getAttribute("style") ?? "";
        });
        expect(leaked).toBe("");
        expect(errors).toEqual([]);
      });
    }
  });
}
