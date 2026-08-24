import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = path.join(ROOT, "package.json");
const root = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const workspaces = root.workspaces ?? [];

let failed = false;

for (const ws of workspaces) {
  const dir = path.join(ROOT, ws);
  const pj = path.join(dir, "package.json");
  if (!fs.existsSync(pj)) {
    console.error(`Missing package.json: ${ws}`);
    failed = true;
    continue;
  }
  const name = JSON.parse(fs.readFileSync(pj, "utf8")).name ?? ws;
  const r = spawnSync("npm", ["pack", "--dry-run"], {
    cwd: dir,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    console.error(`npm pack --dry-run failed: ${name}\n${r.stderr || r.stdout}`);
    failed = true;
    continue;
  }
  console.log(`OK ${name}`);
}

process.exit(failed ? 1 : 0);
