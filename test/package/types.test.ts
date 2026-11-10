import { execFile } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../..", import.meta.url));
const tsc = join(root, "node_modules/.bin/tsc");
const run = promisify(execFile);

const consumer = `
import { stickySidebar, type StickySidebarOptions } from 'dynamic-sticky-sidebar';
import { useStickySidebar, StickySidebar, type StickySidebarProps } from 'dynamic-sticky-sidebar/react';
import { useStickySidebar as useVue, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

const opts: StickySidebarOptions = { header: '.h', gap: 8, offsetTop: () => 1 };
stickySidebar(document.body, opts).destroy();
// @ts-expect-error gap must be a number
stickySidebar('#s', { gap: '8' });
const props: StickySidebarProps = { as: 'div', header: '.h' };
const ref: (node: HTMLElement | null) => void = useStickySidebar<HTMLElement>({ header: '.h' });
useVue(() => null, { header: '.h' }).refresh();
export { props, ref, StickySidebar, vStickySidebar, StickySidebarPlugin };
`;

const setups = [
  {
    name: "bundler",
    ext: "ts",
    type: "module",
    options: { module: "esnext", moduleResolution: "bundler" },
  },
  {
    name: "node16 (esm)",
    ext: "mts",
    type: "module",
    options: { module: "node16", moduleResolution: "node16" },
  },
  {
    name: "node16 (cjs)",
    ext: "cts",
    type: "commonjs",
    options: { module: "node16", moduleResolution: "node16" },
  },
  {
    name: "node10",
    ext: "ts",
    type: "commonjs",
    options: {
      module: "commonjs",
      moduleResolution: "node10",
      ignoreDeprecations: "6.0",
    },
  },
];

let base = "";

beforeAll(() => {
  base = mkdtempSync(join(tmpdir(), "dss-types-"));
  const modules = join(base, "node_modules");
  mkdirSync(join(modules, "@types"), { recursive: true });
  symlinkSync(root, join(modules, "dynamic-sticky-sidebar"), "dir");
  for (const dep of ["vue", "@types/react"])
    symlinkSync(join(root, "node_modules", dep), join(modules, dep), "dir");
});

afterAll(() => rmSync(base, { recursive: true, force: true }));

describe("types resolve for every moduleResolution", () => {
  it.each(setups)("$name", async ({ name, ext, type, options }) => {
    const dir = join(base, name.replace(/\W+/g, "-"));
    mkdirSync(dir);
    symlinkSync(join(base, "node_modules"), join(dir, "node_modules"), "dir");
    writeFileSync(join(dir, "package.json"), JSON.stringify({ type }));
    writeFileSync(join(dir, `consumer.${ext}`), consumer);
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          ...options,
          target: "es2020",
          lib: ["es2020", "dom"],
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
        },
        files: [`consumer.${ext}`],
      }),
    );
    const result = await run(tsc, ["-p", dir]).then(
      () => "",
      (e: { stdout?: string }) => String(e.stdout).trim(),
    );
    expect(result).toBe("");
  });
});
