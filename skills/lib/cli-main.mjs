import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  AGENT_TARGETS,
  agentBaseDir,
  linkSkillToAgents,
  readSkillVersion,
  removeSkillFromAgents,
  resolveSkillRoot,
} from "./link-engine.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_DIR = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(PKG_DIR, "skills.manifest.json");

function logLine(msg) {
  process.stdout.write(msg + "\n");
}

function loadManifest() {
  const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
  return JSON.parse(raw);
}

function parseGlobalFlags(argv) {
  const flags = {
    dryRun: false,
    only: [],
    strategy: "symlink",
    online: false,
  };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--online") flags.online = true;
    else if (a === "--strategy" && argv[i + 1]) {
      flags.strategy = String(argv[++i]);
      if (flags.strategy !== "symlink" && flags.strategy !== "copy") {
        throw new Error('--strategy must be "symlink" or "copy"');
      }
    }     else if (a.startsWith("--only=")) {
      flags.only.push(
        ...a
          .slice("--only=".length)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    } else if (a === "--only" && argv[i + 1]) {
      flags.only.push(
        ...String(argv[++i])
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    } else rest.push(a);
  }
  return { flags, rest };
}

function printHelp() {
  logLine(`@its-thepoe/skills — install Agent Skills into local agent directories

Usage:
  npx @its-thepoe/skills@latest <command> [options]

Commands:
  install --all                 Link or copy every skill from the manifest
  install <skill-name> [...]     Install specific skills (folder names)
  sync --all                    Idempotent re-install (same as install --all)
  sync <skill-name> [...]      Re-install specific skills
  check                         Verify installs under agent dirs
  remove --all                 Remove managed installs for all manifest skills
  remove <skill-name> [...]     Remove specific skills

Options:
  --dry-run                     Print actions without writing
  --only=<a>[,<b>...]          Limit targets: cursor, claude, opencode, windsurf, all
  --strategy symlink|copy       Default symlink; use copy if symlinks fail (e.g. Windows)
  --online                      With check: compare to npm registry (requires network)

Agents (default: all):
${Object.keys(AGENT_TARGETS)
  .map((k) => `  - ${k}`)
  .join("\n")}
`);
}

function getManifestEntries(manifest, names) {
  const byName = new Map(manifest.skills.map((s) => [s.name, s]));
  const out = [];
  for (const n of names) {
    const row = byName.get(n);
    if (!row) throw new Error(`Unknown skill "${n}" (not in skills.manifest.json)`);
    out.push(row);
  }
  return out;
}

function npmViewVersion(pkg) {
  const r = spawnSync("npm", ["view", pkg, "version"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) return null;
  return String(r.stdout || "").trim() || null;
}

/**
 * @param {{ online: boolean }} opts
 */
function runCheck(opts) {
  const manifest = loadManifest();
  const { online } = opts;
  let exit = 0;
  for (const row of manifest.skills) {
    let root = null;
    try {
      root = resolveSkillRoot(row.package, import.meta.url);
    } catch {
      logLine(`BUNDLE ${row.package}: not resolvable via node_modules (install orchestrator deps)`);
      exit = 1;
      continue;
    }
    const bundledVer = readSkillVersion(root);
    let latest = null;
    if (online) {
      latest = npmViewVersion(row.package);
    }
    logLine(`\n${row.name} (${row.package}) bundled@${bundledVer}${latest ? ` registry_latest@${latest}` : ""}`);

    for (const agent of Object.keys(AGENT_TARGETS)) {
      const dest = path.join(agentBaseDir(agent), row.name);
      if (!fs.existsSync(dest)) {
        logLine(`  [${agent}] MISSING ${dest}`);
        exit = 1;
        continue;
      }
      const st = fs.lstatSync(dest);
      if (st.isSymbolicLink()) {
        const t = fs.readlinkSync(dest);
        logLine(`  [${agent}] OK symlink -> ${t}`);
      } else if (st.isDirectory()) {
        const skillMd = path.join(dest, "SKILL.md");
        if (!fs.existsSync(skillMd)) {
          logLine(`  [${agent}] BAD copy dir (no SKILL.md) ${dest}`);
          exit = 1;
        } else {
          logLine(`  [${agent}] OK directory copy ${dest}`);
        }
      } else {
        logLine(`  [${agent}] UNEXPECTED ${dest}`);
        exit = 1;
      }
    }
  }
  return exit;
}

/**
 * @param {string[]} argv
 */
export function run(argv) {
  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    printHelp();
    return 0;
  }

  const { flags, rest } = parseGlobalFlags(argv);
  const cmd = rest[0];
  const args = rest.slice(1);

  if (!cmd || cmd === "help") {
    printHelp();
    return 0;
  }

  const log = logLine;
  const only = flags.only.length ? flags.only.join(",").split(",").map((s) => s.trim()).filter(Boolean) : ["all"];

  try {
    if (cmd === "check") {
      return runCheck({ online: flags.online });
    }

    if (cmd === "install" || cmd === "sync") {
      const all = args.includes("--all");
      const names = args.filter((a) => a !== "--all");
      const manifest = loadManifest();
      let entries = manifest.skills;
      if (!all) {
        if (names.length === 0) {
          logLine("Error: specify skill names or --all");
          printHelp();
          return 1;
        }
        entries = getManifestEntries(manifest, names);
      }

      for (const row of entries) {
        const root = resolveSkillRoot(row.package, import.meta.url);
        const version = readSkillVersion(root);
        logLine(`\n${cmd} ${row.name} @ ${root}`);
        linkSkillToAgents({
          skillRoot: root,
          skillName: row.name,
          skillPackage: row.package,
          version,
          only,
          strategy: flags.strategy,
          dryRun: flags.dryRun,
          log,
        });
      }
      logLine(`\nDone. Reload your agents (Cursor, Claude Code, OpenCode, Windsurf).`);
      return 0;
    }

    if (cmd === "remove") {
      const all = args.includes("--all");
      const names = args.filter((a) => a !== "--all");
      const manifest = loadManifest();
      let targets = manifest.skills.map((s) => s.name);
      if (!all) {
        if (names.length === 0) {
          logLine("Error: specify skill names or --all");
          return 1;
        }
        targets = names;
        for (const n of targets) getManifestEntries(manifest, [n]);
      }
      for (const name of targets) {
        logLine(`\nremove ${name}`);
        removeSkillFromAgents({ skillName: name, only, dryRun: flags.dryRun, log });
      }
      return 0;
    }

    logLine(`Unknown command: ${cmd}`);
    printHelp();
    return 1;
  } catch (e) {
    logLine(`Error: ${e instanceof Error ? e.message : e}`);
    return 1;
  }
}
