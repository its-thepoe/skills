# Publish to npm — the one true process

> **LOCKED — the path that finally works. Do not “improve” this away.**
>
> ```bash
> # Terminal.app / iTerm ONLY (not Cursor)
> npm login && npm whoami && ./scripts/publish-all.sh
> ```
>
> `npm whoami` must print `its-thepoe`. No tokens. No `NPM_OTP`. Real TTY. Never pipe `npm publish`.
>
> Agents: see [`.cursor/rules/npm-publish.mdc`](../.cursor/rules/npm-publish.mdc) and [`AGENTS.md`](../AGENTS.md).

This is the **only** publish doc for this repo. If another doc or script disagrees with this one, this one wins — fix the other one to match.

Preferred Codex workflow: give the command in chat first, run it from here, and only open the browser when npm actually needs auth approval.

Official npm background: [docs.npmjs.com](https://docs.npmjs.com/), scoped public packages: [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages).

---

## The whole process (every time)

Run all of this from **Terminal.app** (or iTerm) — a real interactive terminal, **not** Cursor's agent shell.

```bash
cd "/path/to/skills"      # your clone of this repo

npm login
npm whoami                # MUST print: its-thepoe — do not proceed otherwise

./scripts/publish-all.sh
```

Or: `npm run publish:all` (same script).

For a routine one- or few-package release, use the incremental modes:

```bash
# Publish workspaces changed relative to HEAD
./scripts/publish-all.sh --changed

# Publish exact workspaces; repeat the flag when the orchestrator also changed
./scripts/publish-all.sh --workspace tools/wxt --workspace skills
```

The no-argument command remains the full release audit and recovery path. The
incremental modes still validate selected packages, check npm versions in a
bounded batch, publish skill packages serially, and publish `skills` last.
They refuse ambiguous root workspace changes; use an explicit workspace or
the full command in that case.

That's it. With a real TTY, npm itself opens your browser (`otplease` / `webAuthOpener`), you approve with your security key, and publish continues. A short grace window usually covers the rest of a big batch after the first approval.

Safe to re-run anytime — already-published versions are skipped.

### Never do these (they already broke this repo once)

| Broken idea | What happens |
| --- | --- |
| Run publish from Cursor's agent shell | No TTY → redacted `auth/cli/***` → stuck |
| Pipe `npm publish` through `tee` / capture stdout | Same — npm skips browser opener |
| Bypass-2FA tokens as the “daily” fix | Not this repo's sustained path |
| Per-skill one-off publish scripts | Drift and stale lists |
| Inventing a second "real" process beside this doc | Confusion; agents re-break TTY |

---

## What `./scripts/publish-all.sh` does

1. **Refuses to run without a real TTY** — so Cursor's agent can't half-break a publish.
2. **Checks `npm whoami`.** Exits if it isn't `its-thepoe`.
3. **Selects all or explicitly requested workspaces**; `--changed` uses the
   current working tree relative to `HEAD`.
4. **Validates selected packages** with bounded, visible pack checks.
5. **Reads registry versions in a bounded batch**, instead of one sequential
   `npm view` process per workspace.
6. **Publishes skill packages first**, then **`@its-thepoe/skills` last** when
   selected.
7. **Skips** any package whose local version already matches the registry.
8. Runs **`npm publish` with no pipes** so stdin/stdout stay TTYs and npm can open the browser on EOTP.

---

## Before you publish a new or changed skill

1. Bump the skill's own `package.json` **`version`** (never reuse a version).
2. If it's a **new skill**, add its folder to root **`package.json`** → **`workspaces`**.
3. Wire it into `skills/package.json` `dependencies` + bump `skills` version if the CLI should ship it.
4. Optionally `npm run rebuild-manifest` and update `README.md`.
5. If the new skill's `package.json` is missing `repository`, run `node scripts/ensure-repository-field.mjs`.
6. From Terminal.app: `npm login && npm whoami && ./scripts/publish-all.sh`.
   For a routine targeted release, use `./scripts/publish-all.sh --changed` or
   repeat `--workspace <path>` for the exact packages.

---

## 2FA — browser verification (this account)

Confirmed via `npm profile get`: **`two-factor auth: auth-and-writes`** + WebAuthn/security key — **no TOTP codes**. Never set `NPM_OTP` or `--otp`.

- `npm login` polls until you approve in the browser.
- `npm publish` with a **real TTY** uses the same family of browser flow via `otplease` — opens the browser and polls.
- If you only see `EOTP` + `auth/cli/***` and no browser: **TTY was stolen** (agent shell or a pipe). Fix the environment; do not chase the redacted URL.

**Do not use Bypass-2FA tokens for this repo's daily flow.** Your sustained path is interactive Terminal + browser 2FA.

---

## Confirm what shipped

```bash
npm view @its-thepoe/skills version
npm view @its-thepoe/<skill-name> version
```

Or open `https://www.npmjs.com/package/@its-thepoe/<name>`.

## Smoke test

Before running the npm-based `@its-thepoe/skills install --all`, confirm every
newly added or bumped skill is visible on npm. If
`npm view @its-thepoe/<skill-name> version` returns `404`, that skill is not
available through the npm installer yet. The GitHub-based route,
`npx skills@latest add its-thepoe/skills --all`, can still install repository
skills without publishing individual npm packages.

```bash
npm view @its-thepoe/lemonsqueezy version
npx --yes @its-thepoe/skills@latest install --all --dry-run
npx --yes @its-thepoe/skills@latest check
```

---

## Errors

| Error | Fix |
| --- | --- |
| Script exits: needs a real interactive terminal | Open Terminal.app, run the same commands there |
| `npm whoami` wrong / empty | `npm login`, then `npm whoami` |
| Browser opens for auth | Approve with security key — leave Terminal alone |
| Only `auth/cli/***` visible, no browser | TTY broken — check for pipes / agent shell; pull latest `publish-all.sh` |
| `Done, with failures` | Rerun `./scripts/publish-all.sh` — skips what already shipped |
| `No workspaces changed relative to HEAD` | Use `--workspace <path>` for an explicit release or make the intended package change first |
| `--changed cannot safely infer root workspace changes` | Use explicit `--workspace <path>` arguments or the no-argument full release command |
| `404` from `npm view @its-thepoe/<skill-name> version` | The package is not on npm yet; publish it to make it available through the npm installer. GitHub-based installs remain available. |
| `cannot publish over the previously published versions` | Bump that package's `version`, rerun |
| `404` on PUT `@its-thepoe/...` | Wrong account — must be `its-thepoe` |

---

## Optional later: Trusted Publishing (CI)

Not required for daily work. After a package already exists on npm, you can add a Trusted Publisher on npmjs.com (org `its-thepoe`, repo `skills`, workflow `publish.yml`) and use GitHub Actions → **Publish to npm** (`workflow_dispatch`) via `scripts/publish-ci.sh`. Brand-new packages still need a first Terminal publish with `publish-all.sh`.

Details in repo: `.github/workflows/publish.yml`, `scripts/publish-ci.sh`.

---

## Scripts (do not invent more)

| Script | When |
| --- | --- |
| **`scripts/publish-all.sh`** | **Always — Terminal.app, browser 2FA; use `--changed` or `--workspace` for routine releases** |
| `scripts/publish-ci.sh` | Only from GitHub Actions OIDC, optional |
| `scripts/lib/publish-common.sh` | Shared helpers — not run directly |
| `scripts/ensure-repository-field.mjs` | Keep `repository` fields correct for packages |

Shared version-skip logic lives in `publish-common.sh` so the two entry points cannot drift.
