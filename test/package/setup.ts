import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export default function setup() {
  const root = fileURLToPath(new URL("../..", import.meta.url));
  execFileSync("node_modules/.bin/tsup", { cwd: root, stdio: "ignore" });
}
