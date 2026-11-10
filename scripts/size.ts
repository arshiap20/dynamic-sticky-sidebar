import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { brotliCompressSync, gzipSync } from "node:zlib";

const dist = new URL("../dist/", import.meta.url);
const row = (name: string, b: Uint8Array) =>
  console.log(
    name.padEnd(20),
    `${b.length} B`.padStart(8),
    `gzip ${gzipSync(b, { level: 9 }).length} B`.padStart(14),
    `brotli ${brotliCompressSync(b).length} B`.padStart(16),
  );

for (const [entry, env] of [
  ["index", "development"],
  ["index", "production"],
  ["react", "production"],
  ["vue", "production"],
]) {
  const out = await build({
    define: { "process.env.NODE_ENV": JSON.stringify(env) },
    entryPoints: [new URL(`${entry}.js`, dist).pathname],
    bundle: true,
    write: false,
    format: "esm",
    minify: true,
    external: ["react", "vue"],
    logLevel: "silent",
  });
  row(
    `${entry} (${env === "production" ? "prod" : "dev"})`,
    Buffer.from(out.outputFiles[0].contents),
  );
}
row("index.global.js", readFileSync(new URL("index.global.js", dist)));
