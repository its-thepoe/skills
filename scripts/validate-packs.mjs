import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSelection } from "./lib/publish-selection.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_JOBS = 4;
const DEFAULT_TIMEOUT_MS = 30_000;

export function parseValidationArgs(argv) {
  const selectionArgs = [];
  let jobs = DEFAULT_JOBS;
  let timeoutMs = DEFAULT_TIMEOUT_MS;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--jobs" || arg === "--timeout-ms") {
      const rawValue = argv[index + 1];
      const value = Number(rawValue);
      if (!rawValue || !Number.isInteger(value) || value < 1) {
        throw new Error(`${arg} requires a positive integer`);
      }
      if (arg === "--jobs") jobs = value;
      if (arg === "--timeout-ms") timeoutMs = value;
      index += 1;
      continue;
    }
    selectionArgs.push(arg);
  }

  return { selectionArgs, jobs, timeoutMs };
}

function tail(value, maxLength = 2000) {
  return value.length > maxLength ? value.slice(-maxLength) : value;
}

function terminateChild(child, signal) {
  if (!child?.pid) {
    child?.kill?.(signal);
    return;
  }

  if (process.platform !== "win32") {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch {
      // Fall back to the child itself when a process group is unavailable.
    }
  }
  child.kill?.(signal);
}

export function runPackCheck(workspacePath, options = {}) {
  const {
    root = ROOT,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    spawnImpl = spawn,
  } = options;
  const directory = path.join(root, workspacePath);
  const packageJsonPath = path.join(directory, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return Promise.resolve({
      workspacePath,
      ok: false,
      error: `Missing package.json: ${workspacePath}`,
    });
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const name = packageJson.name ?? workspacePath;

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    let killTimer;
    let timeoutTimer;
    const startedAt = Date.now();
    const child = spawnImpl("npm", ["pack", "--dry-run"], {
      cwd: directory,
      encoding: "utf8",
      shell: process.platform === "win32",
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutTimer);
      clearTimeout(killTimer);
      resolve({
        workspacePath,
        name,
        elapsedMs: Date.now() - startedAt,
        stdout: tail(stdout),
        stderr: tail(stderr),
        ...result,
      });
    };

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.once("error", (error) => {
      finish({ ok: false, error: error.message });
    });
    child.once("close", (code, signal) => {
      if (timedOut) {
        finish({ ok: false, timedOut: true, error: `Timed out after ${timeoutMs}ms` });
        return;
      }
      if (code === 0) {
        finish({ ok: true });
        return;
      }
      finish({ ok: false, error: `npm pack exited with code ${code ?? "unknown"}${signal ? ` (${signal})` : ""}` });
    });

    timeoutTimer = setTimeout(() => {
      timedOut = true;
      terminateChild(child, "SIGTERM");
      killTimer = setTimeout(() => terminateChild(child, "SIGKILL"), 1000);
    }, timeoutMs);
  });
}

export async function runValidationJobs(workspaces, options = {}) {
  const jobs = options.jobs ?? DEFAULT_JOBS;
  const results = new Array(workspaces.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= workspaces.length) return;
      const workspacePath = workspaces[index];
      console.log(`[${index + 1}/${workspaces.length}] checking ${workspacePath}`);
      results[index] = await runPackCheck(workspacePath, options);
      const result = results[index];
      if (result.ok) {
        console.log(`OK ${result.name} (${result.elapsedMs}ms)`);
      } else {
        const reason = result.timedOut ? "timeout" : result.error;
        console.error(`FAILED ${workspacePath}: ${reason}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(jobs, Math.max(workspaces.length, 1)) }, worker));
  return results;
}

function printHelp() {
  console.log(`Usage: npm run validate -- [selection] [options]

Selection:
  --all                    Validate every workspace (default)
  --changed                Validate workspaces changed relative to HEAD
  --workspace <path>       Validate one workspace; may be repeated

Options:
  --jobs <count>           Concurrent pack checks (default: ${DEFAULT_JOBS})
  --timeout-ms <count>     Per-package timeout (default: ${DEFAULT_TIMEOUT_MS})`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  const { selectionArgs, jobs, timeoutMs } = parseValidationArgs(argv);
  const selection = resolveSelection(ROOT, selectionArgs);
  if (selection.selected.length === 0) {
    throw new Error("No workspaces selected");
  }

  console.log(`== Validating ${selection.selected.length} package(s) (${selection.mode}) ==`);
  const results = await runValidationJobs(selection.selected, { root: ROOT, jobs, timeoutMs });
  const failures = results.filter((result) => !result.ok);
  if (failures.length > 0) {
    console.error(`Validation failed for ${failures.length} package(s).`);
    for (const result of failures) {
      if (result.stderr || result.stdout) {
        console.error(`${result.workspacePath} output:\n${tail(`${result.stderr}\n${result.stdout}`)}`);
      }
    }
    process.exitCode = 1;
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  });
}
