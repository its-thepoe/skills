import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORCHESTRATOR_WORKSPACE = "skills";

function normalizePath(value) {
  const normalized = value.replaceAll("\\", "/").replace(/^\.\//, "");
  if (!normalized || normalized.startsWith("/") || normalized.split("/").includes("..")) {
    throw new Error(`Workspace path must be relative to the repository: ${value}`);
  }
  return normalized;
}

export function parseSelectionArgs(argv) {
  let mode = "all";
  const workspacePaths = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") {
      if (mode !== "all" || workspacePaths.length > 0) {
        throw new Error("--all cannot be combined with --changed or --workspace");
      }
      mode = "all";
      continue;
    }
    if (arg === "--changed") {
      if (mode !== "all" || workspacePaths.length > 0) {
        throw new Error("--changed cannot be combined with --all or --workspace");
      }
      mode = "changed";
      continue;
    }
    if (arg === "--workspace") {
      const workspacePath = argv[index + 1];
      if (!workspacePath || workspacePath.startsWith("--")) {
        throw new Error("--workspace requires a workspace path");
      }
      if (mode === "changed") {
        throw new Error("--workspace cannot be combined with --changed");
      }
      mode = "explicit";
      workspacePaths.push(normalizePath(workspacePath));
      index += 1;
      continue;
    }
    throw new Error(`Unknown publish selection argument: ${arg}`);
  }

  return { mode, workspacePaths };
}

export function loadWorkspaceConfig(root) {
  const packageJsonPath = path.join(root, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const workspaces = packageJson.workspaces ?? [];

  if (!Array.isArray(workspaces) || workspaces.length === 0) {
    throw new Error("Root package.json must define a non-empty workspaces array");
  }
  if (new Set(workspaces).size !== workspaces.length) {
    throw new Error("Root package.json contains duplicate workspace paths");
  }
  if (!workspaces.includes(ORCHESTRATOR_WORKSPACE)) {
    throw new Error("Root package.json must include the 'skills' workspace");
  }

  return {
    workspaces,
    skillWorkspaces: workspaces.filter((workspace) => workspace !== ORCHESTRATOR_WORKSPACE),
    orchestrator: ORCHESTRATOR_WORKSPACE,
  };
}

export function selectWorkspaces(config, selection, changedFiles = []) {
  const { mode, workspacePaths } = selection;
  let selected;

  if (mode === "all") {
    selected = [...config.workspaces];
  } else if (mode === "explicit") {
    const known = new Set(config.workspaces);
    if (new Set(workspacePaths).size !== workspacePaths.length) {
      throw new Error("Duplicate workspace paths are not allowed");
    }
    for (const workspacePath of workspacePaths) {
      if (!known.has(workspacePath)) {
        throw new Error(`Unknown workspace path: ${workspacePath}`);
      }
    }
    selected = [...workspacePaths];
  } else {
    const normalizedFiles = changedFiles.map(normalizePath);
    if (normalizedFiles.includes("package.json") || normalizedFiles.includes("package-lock.json")) {
      throw new Error(
        "--changed cannot safely infer root workspace changes; use --workspace <path> or the full publish command",
      );
    }

    selected = config.workspaces.filter((workspacePath) =>
      normalizedFiles.some(
        (filePath) => filePath === workspacePath || filePath.startsWith(`${workspacePath}/`),
      ),
    );
  }

  const selectedSet = new Set(selected);
  return {
    mode,
    selected: [
      ...config.skillWorkspaces.filter((workspacePath) => selectedSet.has(workspacePath)),
      ...(selectedSet.has(config.orchestrator) ? [config.orchestrator] : []),
    ],
  };
}

export function collectChangedFiles(root) {
  const status = execFileSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], {
    cwd: root,
    encoding: "buffer",
  });
  const entries = status.toString("utf8").split("\0").filter(Boolean);
  const files = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (!/^[ MARC?U!]{2} /.test(entry)) continue;
    files.push(entry.slice(3));
    if (/^[ MARC?U!][RC]/.test(entry) && entries[index + 1] && !/^[ MARC?U!]{2} /.test(entries[index + 1])) {
      files.push(entries[index + 1]);
      index += 1;
    }
  }
  return [...new Set(files)];
}

export function resolveSelection(root, argv) {
  const selection = parseSelectionArgs(argv);
  const config = loadWorkspaceConfig(root);
  const changedFiles = selection.mode === "changed" ? collectChangedFiles(root) : [];
  return { ...selection, ...selectWorkspaces(config, selection, changedFiles), config, changedFiles };
}

function printHelp() {
  console.log(`Usage: node scripts/lib/publish-selection.mjs [options]

Options:
  --all                    Select every workspace (default)
  --changed                Select workspaces changed relative to HEAD
  --workspace <path>       Select one workspace; may be repeated
  --paths-only             Print selected workspace paths only
  --json                   Print the selection as JSON`);
}

function runCli() {
  const scriptPath = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(scriptPath), "../..");
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  const outputMode = argv.includes("--json") ? "json" : argv.includes("--paths-only") ? "paths" : "summary";
  const selection = resolveSelection(
    root,
    argv.filter((arg) => !["--json", "--paths-only"].includes(arg)),
  );

  if (outputMode === "json") {
    console.log(JSON.stringify({ mode: selection.mode, workspaces: selection.selected }));
    return;
  }
  if (outputMode === "paths") {
    console.log(selection.selected.join("\n"));
    return;
  }

  console.log(`mode=${selection.mode}`);
  console.log(`selected=${selection.selected.length}`);
  console.log(selection.selected.join("\n"));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    runCli();
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}
