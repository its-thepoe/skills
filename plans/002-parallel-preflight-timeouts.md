# Plan 002: Parallelize preflight and bound validation time

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report -- do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5c7c9df..HEAD -- scripts/publish-all.sh scripts/lib/publish-common.sh scripts/validate-packs.mjs package.json scripts/registry-versions.mjs`
> This plan depends on Plan 001. If the selected-workspace contract or current
> excerpts do not match the implementation after Plan 001, stop and reconcile
> the plan before editing.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/001-incremental-local-publish.md`
- **Category**: perf
- **Planned at**: commit `5c7c9df`, 2026-08-23

## Why this matters

After incremental selection exists, the remaining avoidable delay is the
serial preflight: one npm process per registry lookup and one blocking
`npm pack --dry-run` child process per package. In the current repository,
`npm view` samples took about two seconds each, and `npm pack --dry-run` could
remain silent for more than 100 seconds. Batch the read-only registry checks,
bound each local pack check, and show progress while retaining fail-closed
behavior for network errors and the direct serial publish loop.

## Current state

- `scripts/lib/publish-common.sh:8-20` starts a fresh Node process for local
  package metadata and a fresh `npm view <name> version` process for each
  registry lookup.
- `scripts/publish-all.sh:69-87` calls those helpers serially inside
  `publish_one`, then invokes `npm publish` directly at line 87.
- `scripts/validate-packs.mjs:13-33` uses blocking `spawnSync` for each
  workspace. It has no timeout, concurrency limit, elapsed-time output, or
  per-package start message; it prints `OK` only after a pack operation exits.
- The repository currently runs Node `v26.0.0` with npm `11.12.1` locally and
  has no lifecycle scripts in the package manifests found during the audit.
  Do not rely on that absence without checking it before changing pack flags.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Test registry helper | `node --test scripts/registry-versions.test.mjs` | All parsing, concurrency, timeout, 404, and error tests pass |
| Test validator | `node --test scripts/validate-packs.test.mjs` | All timeout and bounded-concurrency tests pass |
| Validate one selected package | `npm run validate -- --workspace agent/security-audit` | Completes or reports a bounded timeout; never hangs indefinitely |
| Shell syntax | `bash -n scripts/publish-all.sh scripts/lib/publish-common.sh` | Exit 0 with no output |
| Inspect changed files | `git diff --check` | Exit 0 with no whitespace errors |

There is no root `test`, `lint`, or `typecheck` script. Do not add a broad
dependency or test framework for this optimization.

## Scope

**In scope** (the only files to modify):

- `scripts/lib/publish-common.sh`
- `scripts/publish-all.sh`
- `scripts/validate-packs.mjs`
- `scripts/registry-versions.mjs` (create)
- `scripts/registry-versions.test.mjs` (create)
- `scripts/validate-packs.test.mjs` (create)
- `package.json` only if a focused test script is needed

**Out of scope** (do not touch):

- `scripts/publish-ci.sh`
- `.github/workflows/publish.yml` -- Trusted Publishing is deferred
- Any skill package contents, versions, dependencies, manifests, or lockfiles
- The actual `npm publish` loop's serial ordering or its TTY/stdin/stdout
  handling
- Any secret, token, `NPM_OTP`, `--otp`, pipe, output capture, or background
  process around `npm publish`

## Git workflow

- Branch: `advisor/002-parallel-preflight-timeouts`
- Do not push, publish packages, or open a PR while implementing this plan.
- Keep the implementation dependency-free using Node built-ins and the existing
  shell scripts.

## Steps

### Step 1: Add a bounded registry-version batch helper

Create `scripts/registry-versions.mjs` as a read-only helper that accepts the
selected package names and returns a machine-readable mapping of package name
to latest registry version. Use the registry configured by npm, not a hardcoded
private endpoint; obtain the registry URL once from npm configuration or an
explicit environment override without printing credentials.

Implement these rules:

- Limit concurrent requests to a small fixed default such as 8, with a CLI
  option for tests and controlled tuning.
- Apply a per-request timeout such as 10 seconds using `AbortController`.
- Treat HTTP 404 as "not published yet" and return a null version.
- Retry only transient 429/5xx responses a bounded number of times with short
  backoff.
- Treat DNS, timeout, authentication, malformed JSON, and other non-2xx
  failures as fatal. Never convert an unknown registry failure into a publish
  candidate, because that could attempt to republish an existing version.
- Keep output deterministic by returning results in the input order, even if
  requests complete out of order.

Replace the per-package `npm view` loop in `scripts/publish-all.sh` with one
batch call for the selected packages. Pass each resulting version into
`publish_one` so it does not start a second lookup. Preserve the existing
skip rule: an exact local/registry version skips the package.

If the configured registry requires authentication, stop and report rather than
adding a token or logging npm configuration. This repository publishes public
scoped packages to npmjs.org.

**Verify**: `node --test scripts/registry-versions.test.mjs` -> all tests pass,
including bounded concurrency, 404 handling, transient retry, fatal network
error, timeout, and deterministic output ordering.

### Step 2: Make pack validation asynchronous, bounded, and observable

Replace `spawnSync` in `scripts/validate-packs.mjs` with an asynchronous worker
pool. Accept the selected workspace list from Plan 001, a bounded `--jobs`
option, and a per-package `--timeout-ms` option with documented defaults.

For each workspace, print a start line containing its ordinal, total, path, and
timeout before spawning `npm pack --dry-run`. On success print elapsed time and
the package name. On failure or timeout, capture a concise stderr/stdout tail,
mark that package failed, continue checking other selected packages, and exit
nonzero after all workers settle. A timeout must terminate the child process
and must not leave an npm process running.

Keep the same `npm pack --dry-run` packaging semantics unless an explicit
package lifecycle check proves that a safer equivalent is required. If adding
`--ignore-scripts` is considered, first confirm that no package relies on
`prepack`, `prepare`, or related lifecycle scripts and document that decision
in the plan implementation; otherwise do not add the flag.

Use a conservative default concurrency such as 4 for full mode. Do not run
actual publish commands concurrently. The validator may run read-only pack
checks concurrently only when each check has its own timeout and failures are
reported with the workspace path.

**Verify**: `node --test scripts/validate-packs.test.mjs` -> parser, worker
pool, timeout cleanup, failure aggregation, and selected-workspace tests pass.

### Step 3: Integrate the batch preflight without weakening publish safety

Wire the registry helper and validator options into `scripts/publish-all.sh`.
The sequence must remain:

1. Require a real interactive TTY.
2. Reject any publish pipe.
3. Confirm `npm whoami` is `its-thepoe`.
4. Resolve the selected workspace list.
5. Validate the selected packages with bounded progress output.
6. Batch-read registry versions.
7. Publish selected skill packages serially, then `skills` last.

Do not publish a package when the batch registry helper fails, times out, or
returns an ambiguous result. Keep the existing retry-and-prompt behavior for
an individual publish failure. Ensure the helper's stdout/stderr cannot steal
the terminal streams used by the later direct `npm publish` calls.

**Verify**: `bash -n scripts/publish-all.sh scripts/lib/publish-common.sh` ->
exit 0; `npm run validate -- --workspace agent/security-audit` -> bounded
completion with start/progress output; inspect the script to confirm the only
`npm publish` invocation remains direct and unpiped.

### Step 4: Benchmark the targeted and full paths

Run the selected-package validation and registry helper against the current
repository without publishing. Record wall-clock time and confirm that a
single selected package does not trigger work for all 124 workspaces. Run the
full validator with its timeout to confirm the full audit is still available
and cannot remain silent forever.

**Verify**: `time npm run validate -- --workspace agent/security-audit` -> exits
0 or exits nonzero with a named, bounded timeout; it does not remain running
indefinitely. `git diff --check` -> exit 0.

## Test plan

- `scripts/registry-versions.test.mjs` should use injected fetch/registry
  fixtures rather than real npm traffic. Cover success, 404, 429/5xx retry,
  timeout, malformed response, fatal network failure, concurrency cap, and
  stable output order.
- `scripts/validate-packs.test.mjs` should inject a fake child-process runner
  or test extracted worker functions. Cover success, nonzero exit, timeout
  termination, multiple failures, selected workspaces, and bounded worker
  count.
- Do not make tests depend on npm login, `npm whoami`, a browser, WebAuthn, or
  a live network.

## Done criteria

- [ ] Selected-package publishing performs one batch registry preflight instead
  of one sequential `npm view` process per workspace.
- [ ] Registry request concurrency, retry count, and timeout are bounded and
  tested.
- [ ] Registry failures fail closed and never appear as safe-to-publish data.
- [ ] Pack validation has bounded concurrency, per-package timeout, progress
  output, child cleanup, and aggregated failure reporting.
- [ ] Full validation remains available with no arguments.
- [ ] Actual `npm publish` remains serial, direct, unpiped, and real-TTY-bound.
- [ ] `node --test scripts/registry-versions.test.mjs` exits 0.
- [ ] `node --test scripts/validate-packs.test.mjs` exits 0.
- [ ] `bash -n scripts/publish-all.sh scripts/lib/publish-common.sh` exits 0.
- [ ] `git diff --check` exits 0.
- [ ] Only files in Scope are modified (`git status --short`).
- [ ] `plans/README.md` status row is updated to `DONE` or `BLOCKED` with a
  reason.

## STOP conditions

Stop and report instead of improvising if:

- Plan 001's workspace-selection interface is absent or differs materially.
- The registry helper would need to read, print, or embed an npm token.
- A registry timeout or error could be interpreted as "package not published".
- The npm CLI or Node version cannot support the chosen timeout/fetch approach
  without adding a dependency.
- `npm pack --dry-run` still hangs after the configured timeout and child
  cleanup cannot be verified on this platform.
- The proposed change touches CI/Trusted Publishing files, package manifests,
  or the actual publish ordering.
- Any verification command fails twice after a reasonable correction.

## Maintenance notes

- Keep registry concurrency conservative; npm rate limits and local network
  capacity matter more than maximum parallelism.
- Revisit the batch helper if the repository begins publishing private packages
  or uses a registry other than npmjs.org; authentication must be designed
  explicitly rather than inferred.
- Review timeout failures as release blockers, not as permission to continue
  publishing unknown versions.
- Trusted Publishing CI remains intentionally deferred and should be planned
  separately after the local fast path is stable.
