import test from "node:test";
import assert from "node:assert/strict";
import { parseSelectionArgs, selectWorkspaces } from "./lib/publish-selection.mjs";

const config = {
  workspaces: ["skills", "tools/wxt", "agent/security-audit"],
  skillWorkspaces: ["tools/wxt", "agent/security-audit"],
  orchestrator: "skills",
};

test("full mode preserves root order and puts the orchestrator last", () => {
  const result = selectWorkspaces(config, parseSelectionArgs([]));
  assert.deepEqual(result.selected, ["tools/wxt", "agent/security-audit", "skills"]);
});

test("explicit workspaces are selected and reordered safely", () => {
  const selection = parseSelectionArgs(["--workspace", "skills", "--workspace", "tools/wxt"]);
  const result = selectWorkspaces(config, selection);
  assert.deepEqual(result.selected, ["tools/wxt", "skills"]);
});

test("changed mode selects files inside a workspace", () => {
  const selection = parseSelectionArgs(["--changed"]);
  const result = selectWorkspaces(config, selection, ["tools/wxt/SKILL.md"]);
  assert.deepEqual(result.selected, ["tools/wxt"]);
});

test("changed mode handles a new file in an existing workspace", () => {
  const selection = parseSelectionArgs(["--changed"]);
  const result = selectWorkspaces(config, selection, ["agent/security-audit/scripts/new-check.sh"]);
  assert.deepEqual(result.selected, ["agent/security-audit"]);
});

test("root workspace changes fail closed", () => {
  const selection = parseSelectionArgs(["--changed"]);
  assert.throws(
    () => selectWorkspaces(config, selection, ["package.json"]),
    /cannot safely infer root workspace changes/,
  );
});

test("invalid, duplicate, and mixed selection arguments are rejected", () => {
  assert.throws(
    () => selectWorkspaces(config, parseSelectionArgs(["--workspace", "unknown"])),
    /Unknown workspace path/,
  );
  assert.throws(
    () => selectWorkspaces(config, parseSelectionArgs(["--workspace", "tools/wxt", "--workspace", "tools/wxt"])),
    /Duplicate workspace paths/,
  );
  assert.throws(() => parseSelectionArgs(["--changed", "--workspace", "tools/wxt"]), /cannot be combined/);
});
