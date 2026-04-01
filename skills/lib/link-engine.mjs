import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const INSTALL_MARKER = ".its-thepoe-skills-install.json";

/** @type {Record<string, { env?: string, segments: string[] }>} */
export const AGENT_TARGETS = {
  cursor: { segments: [".cursor", "skills"] },
  claude: { segments: [".claude", "skills"] },
  opencode: { segments: [".config", "opencode", "skills"] },
  windsurf: { segments: [".codeium", "windsurf", "skills"] },
};

/**
 * @param {string} key
 * @returns {string}
 */
export function agentBaseDir(key) {
  const home = os.homedir();
  const spec = AGENT_TARGETS[key];
  if (!spec) throw new Error(`Unknown agent target: ${key}`);
  return path.join(home, ...spec.segments);
}

/**
 * @param {string[]} onlyKeys
 */
export function normalizeOnly(onlyKeys) {
  const allowed = new Set(["cursor", "claude", "opencode", "windsurf"]);
  if (onlyKeys.length === 0 || onlyKeys.includes("all")) {
    return [...allowed];
  }
  for (const k of onlyKeys) {
    if (!allowed.has(k)) throw new Error(`Invalid --only value: ${k}`);
  }
  return onlyKeys;
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} skillPackage
 * @param {string} fromFile - use import.meta.url of caller for resolution context
 * @returns {string} absolute path to package root
 */
export function resolveSkillRoot(skillPackage, fromFile) {
  const require = createRequire(fromFile);
  // Do not use `${pkg}/package.json` — many packages omit it from "exports".
  // Resolve the package main (e.g. SKILL.md); its directory is the package root.
  const entry = require.resolve(skillPackage);
  return path.dirname(entry);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeMarker(destDir, meta) {
  const p = path.join(destDir, INSTALL_MARKER);
  fs.writeFileSync(p, JSON.stringify(meta, null, 2) + "\n", "utf8");
}

/**
 * @param {{ dest: string, source: string, dryRun: boolean, strategy: 'symlink'|'copy', skillName: string, skillPackage: string, version: string, log: (m:string)=>void }} opts
 */
function linkOneDest(opts) {
  const { dest, source, dryRun, strategy, skillName, skillPackage, version, log } = opts;
  const absSource = path.resolve(source);

  if (strategy === "symlink") {
    if (exists(dest)) {
      const st = fs.lstatSync(dest);
      if (st.isSymbolicLink()) {
        let target = fs.readlinkSync(dest);
        if (!path.isAbsolute(target)) {
          target = path.resolve(path.dirname(dest), target);
        }
        if (path.resolve(target) === absSource) {
          log(`SKIP   ${dest} -> ${absSource}`);
          return;
        }
        log(`${dryRun ? "DRY-RUN " : ""}REPLACE ${dest} (symlink -> new target)`);
        if (!dryRun) fs.unlinkSync(dest);
      } else if (st.isDirectory()) {
        // copy-mode directory or manual folder — don't destroy
        const marker = path.join(dest, INSTALL_MARKER);
        if (exists(marker)) {
          log(`${dryRun ? "DRY-RUN " : ""}REPLACE ${dest} (prior copy install)`);
          if (!dryRun) fs.rmSync(dest, { recursive: true, force: true });
        } else {
          throw new Error(
            `Refusing to replace ${dest}: exists and is not a symlink managed by this tool`
          );
        }
      } else {
        throw new Error(`Refusing to replace ${dest}: not a directory or symlink`);
      }
    } else {
      log(`${dryRun ? "DRY-RUN " : ""}CREATE  ${dest} -> ${absSource}`);
    }

    if (dryRun) return;

    try {
      fs.symlinkSync(absSource, dest, "dir");
    } catch (err) {
      if (err && err.code === "EPERM" && process.platform === "win32") {
        throw new Error(
          `Symlink failed (EPERM). Re-run with --strategy copy, or enable Developer Mode / run as admin for symlinks.`
        );
      }
      throw err;
    }
    return;
  }

  // copy
  if (exists(dest)) {
    log(`${dryRun ? "DRY-RUN " : ""}REPLACE ${dest} (copy)`);
    if (!dryRun) fs.rmSync(dest, { recursive: true, force: true });
  } else {
    log(`${dryRun ? "DRY-RUN " : ""}CREATE  ${dest} (copy)`);
  }
  if (dryRun) return;
  fs.cpSync(absSource, dest, { recursive: true });
  writeMarker(dest, {
    managedBy: "@its-thepoe/skills",
    skillName,
    package: skillPackage,
    version,
    strategy: "copy",
    installedAt: new Date().toISOString(),
  });
}

/**
 * @param {{ skillRoot: string, skillName: string, skillPackage: string, version: string, only: string[], strategy: 'symlink'|'copy', dryRun: boolean, log: (m:string)=>void }} p
 */
export function linkSkillToAgents(p) {
  const { skillRoot, skillName, skillPackage, version, only, strategy, dryRun, log } = p;
  if (!exists(path.join(skillRoot, "SKILL.md"))) {
    throw new Error(`Missing SKILL.md under ${skillRoot}`);
  }

  for (const key of normalizeOnly(only)) {
    const base = agentBaseDir(key);
    const dest = path.join(base, skillName);
    if (!dryRun) fs.mkdirSync(base, { recursive: true });
    linkOneDest({
      dest,
      source: skillRoot,
      dryRun,
      strategy,
      skillName,
      skillPackage,
      version,
      log,
    });
  }
}

/**
 * @param {{ skillName: string, only: string[], dryRun: boolean, log: (m:string)=>void }} p
 */
export function removeSkillFromAgents(p) {
  const { skillName, only, dryRun, log } = p;
  for (const key of normalizeOnly(only)) {
    const dest = path.join(agentBaseDir(key), skillName);
    if (!exists(dest)) {
      log(`SKIP   (missing) ${dest}`);
      continue;
    }
    const st = fs.lstatSync(dest);
    if (st.isSymbolicLink()) {
      log(`REMOVE ${dest}`);
      if (!dryRun) fs.unlinkSync(dest);
      continue;
    }
    if (st.isDirectory()) {
      const marker = path.join(dest, INSTALL_MARKER);
      if (exists(marker)) {
        try {
          const meta = readJson(marker);
          if (meta.managedBy === "@its-thepoe/skills") {
            log(`REMOVE ${dest} (copy install)`);
            if (!dryRun) fs.rmSync(dest, { recursive: true, force: true });
            continue;
          }
        } catch {
          /* fall through */
        }
      }
      log(`SKIP   ${dest} (directory not managed; no marker)`);
    }
  }
}

/**
 * @param {string} skillRoot
 */
export function readSkillVersion(skillRoot) {
  const pj = path.join(skillRoot, "package.json");
  if (!exists(pj)) return "0.0.0";
  try {
    return readJson(String(pj)).version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}
