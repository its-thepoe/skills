import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// npm trusted publishing (OIDC) validates a package's `repository.url` against
// the GitHub repo the workflow runs in. Every published workspace needs this
// field set correctly, or CI publishes fail even with a valid OIDC token.
const REPO_URL = "git+https://github.com/its-thepoe/skills.git";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = path.join(ROOT, "package.json");
const root = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const workspaces = root.workspaces ?? [];

let changed = 0;

for (const ws of workspaces) {
  const pj = path.join(ROOT, ws, "package.json");
  if (!fs.existsSync(pj)) {
    console.error(`Missing package.json: ${ws}`);
    continue;
  }

  const raw = fs.readFileSync(pj, "utf8");
  const pkg = JSON.parse(raw);
  const desired = { type: "git", url: REPO_URL, directory: ws };

  if (JSON.stringify(pkg.repository) === JSON.stringify(desired)) {
    continue;
  }

  pkg.repository = desired;
  fs.writeFileSync(pj, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`SET repository -> ${ws}`);
  changed += 1;
}

console.log(`\nDone. Updated ${changed} package.json file(s).`);
