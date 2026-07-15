# Publish to npm — the one true process

This is the **only** publish doc for this repo. If another doc or script disagrees with this one, this one wins — fix the other one to match.

Official npm background: [docs.npmjs.com](https://docs.npmjs.com/), scoped public packages: [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages).

---

## The whole process (every time)

Run all of this from **Terminal.app** (or iTerm) — a real interactive terminal, **not** Cursor's agent shell. Browser 2FA needs an interactive session to open the browser prompt.

```bash
cd "/path/to/skills"      # your clone of this repo

npm login
npm whoami                # MUST print: its-thepoe — do not proceed otherwise

npm install
./scripts/publish-all.sh
```

That's it. One script, run from the repo root, after confirming login. Everything below explains what that script does and how to recover from errors — you don't need to memorize any of it, just re-run `./scripts/publish-all.sh`.

---

## What `./scripts/publish-all.sh` does

1. **Checks `npm whoami`.** Exits immediately with a clear error if it isn't `its-thepoe`. Fix: `npm login`, then rerun.
2. **Runs `npm run validate`** across every workspace.
3. **Reads the workspace list from the root `package.json`** (`workspaces` array) — there is no separate hardcoded list anywhere. Every skill package plus the `skills` orchestrator.
4. **Publishes every skill package first**, in the order they appear in `package.json`.
5. **Publishes `@its-thepoe/skills` last** — it depends on the skill packages, so they must exist on the registry first.
6. **Compares versions before publishing each package.** If the local `package.json` version already matches what's on the npm registry, it prints `SKIP <pkg>@<version> (already on registry)` and moves on — no error, no wasted attempt.

Because of step 6, **the script is always safe to re-run** — after a partial failure, a browser-auth timeout, a network blip, anything. Just run it again.

---

## Before you publish a new or changed skill

1. Bump the skill's own `package.json` **`version`** (never reuse an existing version number).
2. If it's a **new skill**, add its folder path to the root **`package.json`** → **`workspaces`** array. That's the single source `publish-all.sh` reads from — nothing else needs updating for publishing to work.
3. If `skills/package.json` `dependencies` should point at this skill (so `@its-thepoe/skills` installs it), bump/add that entry there too, and bump `skills/package.json` `version`.
4. Optionally run `npm run rebuild-manifest` and update `README.md` — these affect discovery/install UX, not publishing.
5. `npm install && npm run validate` at the repo root.
6. `./scripts/publish-all.sh`.

---

## 2FA — browser verification (this account, always)

This npm account uses **browser-based** publish verification. It does **not** use authenticator/TOTP one-time codes.

- When npm prints `Press ENTER to open in the browser…`, press Enter and complete verification in the browser that opens.
- If npm errors with **`code EOTP`** and also prints a URL like `Open this URL in your browser to authenticate: https://www.npmjs.com/auth/cli/...` — **that is still browser auth**, not a request for a 6-digit code. Open that URL, approve it, then rerun `./scripts/publish-all.sh`.
- **Never** set `NPM_OTP` or pass `--otp` for this repo. If you see either mentioned anywhere for this project, it's stale — ignore it and use the flow above.
- If `EOTP` appears with **no URL** and nothing happens, you are almost certainly in a **non-interactive shell** (e.g. an AI agent's background terminal). Rerun the exact same command in Terminal.app.

---

## Confirm what shipped

```bash
npm view @its-thepoe/skills version
npm view @its-thepoe/<skill-name> version
```

Or open `https://www.npmjs.com/package/@its-thepoe/<name>` in a browser.

---

## Smoke test as a user would

```bash
npx --yes @its-thepoe/skills@latest install --all --dry-run
npx --yes @its-thepoe/skills@latest check
```

Install one specific new skill:

```bash
npx --yes @its-thepoe/skills@latest install <skill-name> --dry-run
```

If `npx` seems to be using a stale cached version:

```bash
npx --yes --cache /tmp/its-thepoe-skills-cache @its-thepoe/skills@latest check
```

---

## Errors — what they actually mean

| Error | What it means | Fix |
| --- | --- | --- |
| `npm whoami` fails or prints the wrong user | Not logged in, or logged in as the wrong account | `npm login`, then `npm whoami` again |
| `code EOTP` **with a browser URL printed** | Browser verification step — not an OTP code | Open the URL, approve, rerun `./scripts/publish-all.sh` |
| `code EOTP` with **no URL**, script seems to hang | Running in a non-interactive shell | Rerun the exact same command in Terminal.app |
| `cannot publish over the previously published versions` | You're trying to publish a version number that's already live | Shouldn't happen with `publish-all.sh` (it skips these) — if it does, bump `version` in that package's `package.json` and rerun |
| `404` on `PUT` for `@its-thepoe/...` | Your npm account/org doesn't have publish rights to the `@its-thepoe` scope | Confirm `npm whoami` is `its-thepoe` or a member of that org |
| `404` on `GET` when **installing** `@its-thepoe/skills` | A skill listed in `skills/package.json` `dependencies` isn't on the registry yet | Publish that skill package, then retry the install |
| `403` forbidden | Token/user can't publish this specific package | Check scope ownership / npm account permissions |

---

## Why there's only one script

Earlier versions of this repo had three separate publish scripts (`publish-all.sh`, `publish-prototype-and-cli.sh`, `publish-codebase-content-ideas-and-cli.sh`) with hardcoded, duplicated package lists and a version-comparison bug (comparing raw JSON output instead of the parsed version string), which caused `publish-all.sh`-style scripts to attempt re-publishing packages that were already live.

Those extra scripts are gone. **`scripts/publish-all.sh` is the only publish script in this repo**, it reads the package list live from `package.json`, and its version comparison is tested to correctly skip already-published packages. If you're tempted to write a new one-off publish script for a specific release, don't — `publish-all.sh` already handles it.
