import { build, type Plugin } from "esbuild";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dist = fileURLToPath(new URL("../../dist/", import.meta.url));

const CORE = "[dynamic-sticky-sidebar]";
const COMPONENT = '"aside"';
const COMPOSABLE = 'flush:"post"';
const DIRECTIVE = "beforeUnmount(";

const self: Plugin = {
  name: "self",
  setup(b) {
    b.onResolve({ filter: /^dynamic-sticky-sidebar(\/|$)/ }, (a) => ({
      path: `${dist}${a.path.split("/")[1] ?? "index"}.js`,
    }));
  },
};

async function bundle(code: string) {
  const out = await build({
    stdin: { contents: code, resolveDir: dist },
    bundle: true,
    write: false,
    format: "esm",
    minify: true,
    external: ["react", "vue"],
    plugins: [self],
    logLevel: "silent",
  });
  return out.outputFiles[0].text.replace(
    /import\s*(\{[^}]*\}\s*from\s*)?"(react|vue)";?\s*/g,
    "",
  );
}

describe("importing without using anything bundles nothing", () => {
  it.each([
    "dynamic-sticky-sidebar",
    "dynamic-sticky-sidebar/react",
    "dynamic-sticky-sidebar/vue",
  ])("%s", async (entry) => {
    expect(await bundle(`import '${entry}';`)).toBe("");
  });
});

describe("each export bundles only what it needs", () => {
  it.each([
    { name: "stickySidebar", from: "", present: [CORE], absent: [] },
    {
      name: "useStickySidebar",
      from: "/react",
      present: [CORE],
      absent: [COMPONENT],
    },
    {
      name: "StickySidebar",
      from: "/react",
      present: [CORE, COMPONENT],
      absent: [],
    },
    {
      name: "useStickySidebar",
      from: "/vue",
      present: [CORE, COMPOSABLE],
      absent: [DIRECTIVE],
    },
    {
      name: "vStickySidebar",
      from: "/vue",
      present: [CORE, DIRECTIVE],
      absent: [COMPOSABLE],
    },
  ])(
    "$name from dynamic-sticky-sidebar$from",
    async ({ name, from, present, absent }) => {
      const js = await bundle(
        `export { ${name} } from 'dynamic-sticky-sidebar${from}';`,
      );
      for (const marker of present) expect(js).toContain(marker);
      for (const marker of absent) expect(js).not.toContain(marker);
    },
  );
});

it("strips dev warnings from production builds", async () => {
  const out = await build({
    entryPoints: [`${dist}index.js`],
    bundle: true,
    write: false,
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
  });
  const js = out.outputFiles[0].text;
  expect(js).not.toContain("matched no elements");
  expect(js).not.toContain("process.env");
});
