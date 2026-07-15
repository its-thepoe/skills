# Publish to npm — the one true process

This is the **only** publish doc for this repo. If another doc or script disagrees with this one, this one wins — fix the other one to match.

**Sustained path (what you use every time): Terminal.app + `npm login` + `./scripts/publish-all.sh`. No tokens. No CI required.**

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

That's it. When the first unpublished package hits browser 2FA, the script **opens the auth URL in your browser**, pauses, you approve with your security key, press Enter, and it keeps going. You usually only approve once for a large batch (npm opens a short grace window after approval).

Safe to re-run anytime — already-published versions are skipped.

---

## What `./scripts/publish-all.sh` does

1. **Refuses to run without a real TTY** — so Cursor's agent can't half-break a publish.
2. **Checks `npm whoami`.** Exits if it isn't `its-thepoe`.
3. **Runs `npm run validate`** across every workspace.
4. **Reads `workspaces` from root `package.json`** — no hardcoded skill list.
5. **Publishes every skill package first**, then **`@its-thepoe/skills` last**.
6. **Skips** any package whose local version already matches the registry.
7. On **`EOTP` with a real TTY**: npm itself opens your browser (`otplease` + `webAuthOpener`), polls until you approve, and retries that publish. Do **not** pipe `npm publish` through `tee` or anything else — that makes stdout non-TTY, npm skips the browser opener, and you only see a useless redacted `auth/cli/***` URL.

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
- `npm publish` does **not** poll — it fails fast with `EOTP` and a URL. That is expected. The script handles it: open URL → approve → Enter → continue.
- Approving opens a short grace window (~5 minutes) so the rest of a batch often needs no further clicks.
- If you see `EOTP` with **no** URL and nothing opens, you are in a non-interactive shell — use Terminal.app.

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
| Script opens browser + `Press Enter once approved…` | Approve with security key, press Enter — keep the Terminal tab open |
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
