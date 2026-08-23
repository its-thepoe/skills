# Plan 001: Add an incremental local publish mode

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report -- do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5c7c9df..HEAD -- scripts/publish-all.sh scripts/lib/publish-common.sh scripts/lib/publish-selection.mjs scripts/validate-packs.mjs package.json docs/publish-step-by-step.md .cursor/rules/npm-publish.mdc`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `5c7c9df`, 2026-08-23

## Why this matters

The repository contains 124 npm workspaces, but a normal change usually
touches one skill and sometimes the `@its-thepoe/skills` orchestrator. The
current publisher validates every workspace and performs a registry lookup
for every workspace before it discovers that most packages are already
current. An explicit incremental mode should reduce the pre-publish work to
the changed package set while preserving the existing full-release behavior as
the default and keeping the orchestrator last.

## Current state

- `scripts/publish-all.sh` is the only local publish entry point. It requires
  a real TTY at lines 38-50, runs `npm run validate` for all workspaces at
  lines 65-67, and loops through every skill workspace at lines 107-110 before
  publishing `skills` at lines 113-119.
- `scripts/lib/publish-common.sh` reads the root workspace list at lines 22-34
  and separates the `skills` orchestrator from skill packages.
- `scripts/validate-packs.mjs` always reads every root workspace at lines 8-13
  and has no workspace-selection argument.
- `package.json` defines 124 workspaces at lines 6-130 and exposes only the
  `validate`, `rebuild-manifest`, and `publish:all` scripts at lines 132-136.
- `docs/publish-step-by-step.md` defines the supported Terminal.app/iTerm
  command at lines 22-39 and requires validation of all packages at lines
  53-61. It also requires skill packages to publish before `skills`.
- `.cursor/rules/npm-publish.mdc` and `AGENTS.md` prohibit pipes around
  `npm publish`, prohibit `NPM_OTP`/`--otp`, and require the real-TTY browser
  flow. Those invariants must remain unchanged.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Check repository state | `git status --short` | Only intentional plan/executor files are listed |
| Validate one workspace | `npm run validate -- --workspace agent/security-audit` | Exit 0 and only the requested workspace is checked |
| Validate the full repository | `npm run validate` | Existing full validation behavior is retained |
| Test plan logic | `node --test scripts/publish-selection.test.mjs` | All selection tests pass |
| Shell syntax | `bash -n scripts/publish-all.sh scripts/lib/publish-common.sh` | Exit 0 with no output |

There is no root `test`, `lint`, or `typecheck` script in the current
`package.json`. Do not invent a framework-wide verification command; use the
commands above and the new focused Node test file.

## Scope

**In scope** (the only files to modify):

- `scripts/publish-all.sh`
- `scripts/lib/publish-common.sh`
- `scripts/lib/publish-selection.mjs`
- `scripts/validate-packs.mjs`
- `scripts/publish-selection.test.mjs` (create)
- `docs/publish-step-by-step.md`
- `.cursor/rules/npm-publish.mdc`

**Out of scope** (do not touch):

- `scripts/publish-ci.sh`
- `.github/workflows/publish.yml` -- Trusted Publishing is deferred
- Any skill `package.json`, `skills/package.json`, `package-lock.json`, or
  generated manifest unless the selection implementation proves a code change
  is strictly required; normal version/dependency edits belong to the release
  author, not this performance plan.
- Any command that pipes, captures, backgrounds, or parallelizes `npm publish`.

## Git workflow

- Branch: `advisor/001-incremental-local-publish`
- Do not push, publish packages, or open a PR while implementing this plan.
- Match the repository's existing shell style and concise operational messages.

## Steps

### Step 1: Define and test workspace selection

Add a small, testable selection layer used by `publish-all.sh` and
`validate-packs.mjs` with this contract:

- No arguments keeps the current full mode and selects every root workspace.
- `--changed` selects workspaces with tracked, staged, or standard-untracked
  files changed in the current working tree. It detects new files under an
  existing workspace; a brand-new workspace entry changes the root workspace
  declaration and must fail closed for explicit selection or full mode.
- `--workspace <path>` may be repeated and selects only exact workspace paths
  listed in the root `package.json` `workspaces` array. Reject unknown paths,
  `skills` typos, duplicate paths, and paths outside the repository.
- If the root workspace declaration or package dependency graph changes in a
  way that makes selection ambiguous, fail closed with a message telling the
  operator to run the full mode. Do not silently omit a workspace.
- Preserve root workspace order for skill packages and always append `skills`
  after them. A selected `skills` workspace must remain last.

Keep parsing/selection separate from the code that performs publishing so it
can be tested without npm auth, a browser, or a TTY.

**Verify**: `node --test scripts/publish-selection.test.mjs` -> tests cover
full mode, one explicit workspace, repeated explicit workspaces, a changed
tracked workspace, a changed untracked workspace, invalid paths, and
orchestrator-last ordering.

### Step 2: Pass the selected workspaces through validation

Update `scripts/validate-packs.mjs` to accept the selected workspace list while
retaining all-workspace behavior when no list is supplied. Keep its current
package existence check and `npm pack --dry-run` packaging check. It must print
the selected count before work begins and identify each workspace in any error.

Update `scripts/publish-all.sh` to invoke the validator with the exact selected
paths rather than always running `npm run validate` with no arguments. Do not
remove the auth check, TTY guard, no-pipe assertion, retry behavior, or the
skill-before-orchestrator order.

**Verify**: `npm run validate -- --workspace agent/security-audit` -> exits 0
and does not print `OK` for unrelated workspaces; `npm run validate` -> still
selects all 124 workspaces.

### Step 3: Add the incremental publish modes

Add explicit argument handling to `scripts/publish-all.sh`:

- `./scripts/publish-all.sh` remains the safe full release path documented now.
- `./scripts/publish-all.sh --changed` uses the changed-workspace selector.
- `./scripts/publish-all.sh --workspace <path> ...` publishes only the listed
  paths, with `skills` automatically moved to the end if supplied.
- Print the mode and selected workspace paths before validation so the operator
  can catch an unexpected selection before npm publish begins.
- Reject an empty `--changed` selection without opening a browser or invoking
  `npm publish`.
- Keep the existing `npm whoami` check before any publish and keep the actual
  `npm publish --access public -w <workspace>` call attached directly to the
  terminal with no pipe or output capture.

For `--changed`, include `skills` when its own files changed. If a changed skill
is not wired into `skills/package.json` or the orchestrator version was not
bumped, report that fact and stop rather than inventing a version or publishing
an inconsistent CLI package. Root workspace-list changes should require full
mode.

**Verify**: `bash -n scripts/publish-all.sh scripts/lib/publish-common.sh` ->
exit 0; run `./scripts/publish-all.sh --help` or the repository's chosen
non-publishing help path -> it documents all three modes without calling npm
publish.

### Step 4: Update the single publish documentation and editor rule

Update `docs/publish-step-by-step.md` and `.cursor/rules/npm-publish.mdc` to
document the incremental commands while preserving the existing full command
as the fallback. State clearly that all modes require Terminal.app/iTerm, a
real TTY, `npm whoami` returning `its-thepoe`, browser WebAuthn when requested,
no `NPM_OTP`, no `--otp`, and no pipe around `npm publish`.

Document that `--changed` is for routine one-or-few-package releases and that
the no-argument command remains the full release audit. Keep the preferred
Codex workflow sentence: give the command in chat first and open the browser
only when npm actually requests approval.

**Verify**: `rg -n -- "--changed|--workspace|Terminal.app|real TTY|NPM_OTP|npm publish" docs/publish-step-by-step.md .cursor/rules/npm-publish.mdc` -> both files contain the incremental mode and all safety invariants.

### Step 5: Run the focused regression checks

Run the selection tests, shell syntax checks, and one-workspace validation.
Confirm full selection through the validator's reported selected count without
starting a real publish. Do not run a real publish as a test.

**Verify**: `node --test scripts/publish-selection.test.mjs && bash -n scripts/publish-all.sh scripts/lib/publish-common.sh && npm run validate -- --workspace agent/security-audit` -> all commands exit 0; a separate non-publishing full-selection invocation reports all 124 workspaces.

## Test plan

- `scripts/publish-selection.test.mjs` should use Node's built-in `node:test`
  and `node:assert` modules; no new dependency is needed.
- Cover full selection, explicit selection, `--changed` selection for tracked
  and untracked files, invalid workspace paths, root workspace-list changes,
  empty changed selection, duplicates, and the invariant that `skills` is last.
- Keep tests pure: they must not call `npm login`, `npm whoami`, `npm view`, or
  `npm publish`.
- Verify packaging through `npm run validate -- --workspace ...`; verify full
  behavior through selection output or a non-publishing validation invocation.

## Done criteria

- [ ] No-argument `./scripts/publish-all.sh` retains the existing full ordered
  behavior.
- [ ] `--changed` and repeated `--workspace` modes select only intended paths.
- [ ] `skills` is always published after selected skill packages.
- [ ] Empty/ambiguous selections fail before any publish or browser prompt.
- [ ] `npm publish` remains a direct, unpiped command on a real TTY.
- [ ] `node --test scripts/publish-selection.test.mjs` exits 0.
- [ ] `npm run validate -- --workspace agent/security-audit` exits 0.
- [ ] `bash -n scripts/publish-all.sh scripts/lib/publish-common.sh` exits 0.
- [ ] Only files in Scope are modified (`git status --short`).
- [ ] `plans/README.md` status row is updated to `DONE` or `BLOCKED` with a
  reason.

## STOP conditions

Stop and report instead of improvising if:

- The current workspace list, TTY guard, no-pipe assertion, or orchestrator
  ordering differs from the excerpts above.
- Detecting changed files requires changing package versions, dependency
  manifests, or the lockfile.
- A new skill cannot be unambiguously mapped to one root workspace path.
- The proposed implementation would invoke `npm publish` through a pipe,
  background process, captured stream, or parallel worker.
- A validation or selection test fails twice after a reasonable correction.
- A change appears necessary in `.github/workflows/publish.yml` or
  `scripts/publish-ci.sh`.

## Maintenance notes

- Keep the no-argument full mode as the recovery path after a partial publish;
  already-published versions are still skipped by the registry comparison.
- Reviewers should inspect changed-file detection for staged and untracked new
  packages, and verify that an orchestrator change cannot publish before its
  skill dependency.
- If the repository adds generated files or a new workspace bucket, update the
  selector tests and the root-change fail-closed rule together.
- Trusted Publishing CI is intentionally deferred and must be handled in a
  separate plan.
