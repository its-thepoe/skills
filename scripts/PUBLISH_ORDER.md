# npm publish order (`@its-thepoe/*`)

**One script does this. Do not hand-write publish order or `npm publish` sequences — they go stale.**

```bash
npm login
npm whoami   # must print: its-thepoe

chmod +x scripts/publish-all.sh
./scripts/publish-all.sh
```

Run from **Terminal.app** (interactive). Not Cursor's agent shell.

## What the script does

1. Checks `npm whoami` — exits immediately if it isn't `its-thepoe`.
2. Runs `npm run validate`.
3. Reads the **`workspaces`** array straight from the root `package.json` — every skill package plus `skills` (the orchestrator).
4. Publishes every skill package **first**, in the order they appear in `package.json`.
5. Publishes **`@its-thepoe/skills`** last (it depends on the skill packages, so they must exist on the registry first).
6. For each package, compares the local `version` in its `package.json` to the version already on the npm registry:
   - **Same version** → prints `SKIP <pkg>@<version> (already on registry)` and moves on. No error.
   - **Different (or not yet published)** → publishes it.

This means the script is **safe to re-run** any time — after a partial failure, after a browser-auth timeout, whatever. It will only publish what's actually missing or changed.

## Adding a new skill

Add its folder to `package.json` → `workspaces`. That's the only place the publish order comes from — nothing else to update for this script to pick it up.

## 2FA

This account uses **browser verification**, not authenticator codes.

- When npm prints `Press ENTER to open in the browser…`, press Enter and complete verification in the browser.
- If you see `code EOTP` **with a browser URL**, that is still browser auth — open the URL, approve, then rerun `./scripts/publish-all.sh` (it will skip anything already published and continue).
- Never set `NPM_OTP` or pass `--otp` for this repo.

## Common errors

| Error | Fix |
| --- | --- |
| `npm whoami` doesn't print `its-thepoe` | `npm login`, complete browser flow, then rerun `./scripts/publish-all.sh` |
| `EOTP` with a browser URL | Open the URL, approve in browser, rerun the script |
| `cannot publish over the previously published versions` | Shouldn't happen — the script skips these. If it does, bump `version` in that package's `package.json`, rerun |
| `404` on `PUT` for `@its-thepoe/...` | Your npm account/org doesn't own the `@its-thepoe` scope |

Full walkthrough: [docs/publish-step-by-step.md](../docs/publish-step-by-step.md).

## Smoke tests (after publish)

```bash
npx --yes @its-thepoe/skills@latest install --all --dry-run
npx --yes @its-thepoe/skills@latest check
```
