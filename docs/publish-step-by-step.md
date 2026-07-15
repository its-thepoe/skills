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
3. **Runs `npm run validate`** across every workspace.
4. **Reads `workspaces` from root `package.json`** — no hardcoded skill list.
5. **Publishes every skill package first**, then **`@its-thepoe/skills` last**.
6. **Skips** any package whose local version already matches the registry.
7. Runs **`npm publish` with no pipes** so stdin/stdout stay TTYs and npm can open the browser on EOTP.

---

## Before you publish a new or changed skill

1. Bump the skill's own `package.json` **`version`** (never reuse a version).
2. If it's a **new skill**, add its folder to root **`package.json`** → **`workspaces`**.
3. Wire it into `skills/package.json` `dependencies` + bump `skills` version if the CLI should ship it.
4. Optionally `npm run rebuild-manifest` and update `README.md`.
5. If the new skill's `package.json` is missing `repository`, run `node scripts/ensure-repository-field.mjs`.
6. From Terminal.app: `npm login && npm whoami && ./scripts/publish-all.sh`.

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

```bash
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
| **`scripts/publish-all.sh`** | **Always — Terminal.app, browser 2FA** |
| `scripts/publish-ci.sh` | Only from GitHub Actions OIDC, optional |
| `scripts/lib/publish-common.sh` | Shared helpers — not run directly |
| `scripts/ensure-repository-field.mjs` | Keep `repository` fields correct for packages |

Shared version-skip logic lives in `publish-common.sh` so the two entry points cannot drift.
