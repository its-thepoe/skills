import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseValidationArgs, runPackCheck, runValidationJobs } from "./validate-packs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fakeChild({ code = 0, delayMs = 0, hangs = false } = {}) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.kill = () => {
    if (child.killed) return true;
    child.killed = true;
    setImmediate(() => child.emit("close", null, "SIGTERM"));
    return true;
  };
  if (!hangs) {
    setTimeout(() => child.emit("close", code, null), delayMs);
  }
  return child;
}

test("parses selection and validator options", () => {
  assert.deepEqual(parseValidationArgs(["--workspace", "tools/wxt", "--jobs", "2", "--timeout-ms", "500"]), {
    selectionArgs: ["--workspace", "tools/wxt"],
    jobs: 2,
    timeoutMs: 500,
  });
});

test("reports a successful pack check", async () => {
  const result = await runPackCheck("agent/security-audit", {
    root,
    spawnImpl: () => fakeChild(),
  });
  assert.equal(result.ok, true);
  assert.equal(result.name, "@its-thepoe/security-audit");
});

test("terminates a pack check that exceeds its timeout", async () => {
  const result = await runPackCheck("agent/security-audit", {
    root,
    timeoutMs: 5,
    spawnImpl: () => fakeChild({ hangs: true }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.timedOut, true);
});

test("runs validation jobs with a bounded worker count and aggregates failures", async () => {
  let active = 0;
  let maximum = 0;
  let created = 0;
  const results = await runValidationJobs(["agent/security-audit", "agent/security-audit", "agent/security-audit"], {
    root,
    jobs: 2,
    spawnImpl: () => {
      created += 1;
      active += 1;
      maximum = Math.max(maximum, active);
      const child = fakeChild({ code: created === 2 ? 1 : 0, delayMs: 2 });
      const originalKill = child.kill;
      child.once("close", () => {
        active -= 1;
      });
      child.kill = (...args) => originalKill.apply(child, args);
      return child;
    },
  });
  assert.equal(maximum, 2);
  assert.equal(results.filter((result) => !result.ok).length, 1);
});
