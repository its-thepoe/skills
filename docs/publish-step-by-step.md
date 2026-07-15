# Publish to npm — step by step

Follow these steps **in order** on the machine where you want to publish (your laptop is fine). Official npm background: [docs.npmjs.com](https://docs.npmjs.com/), scoped public packages: [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages).

---

## TL;DR — changed skill + CLI

Use this when you changed any skill package and want that version to be installable through **`@its-thepoe/skills`**.

1. Bump the changed skill's **`package.json`** `version` (never republish an existing version).
2. Set **`skills/package.json`** to depend on that same skill version.
3. Bump **`@its-thepoe/skills`** in **`skills/package.json`**.
4. If this is a **new skill**, also:
   - Add the skill folder under a bucket (`design/`, `tools/`, etc.) with `SKILL.md` + `package.json`
   - Add the path to the root **`package.json`** `workspaces` array
   - Run **`npm run rebuild-manifest`** (updates **`manifest.json`** and **`skills/skills.manifest.json`**)
   - Update **`README.md`** install tables (optional but recommended)
5. From **repo root**: `npm install && npm run validate`
6. Publish **in this order only**: skill package(s) first, CLI second.

Example for **`hugeicons`**:

```bash
npm publish --access public -w @its-thepoe/hugeicons
npm publish --access public -w @its-thepoe/skills
```

Example for **several changed skills**:

```bash
npm publish --access public -w @its-thepoe/alt-text
npm publish --access public -w @its-thepoe/hugeicons
npm publish --access public -w @its-thepoe/skills
```

Example for **new skills** (`prototype`, `tauri-best-practices`, etc.) — use the bundled script:

```bash
chmod +x scripts/publish-prototype-and-cli.sh
./scripts/publish-prototype-and-cli.sh
```

That script validates, publishes each skill package, then publishes **`@its-thepoe/skills`**. It **skips** packages whose version is already on the registry (prints `SKIP …`) instead of stopping — safe to re-run after a partial publish.

Manual equivalent:

```bash
npm publish --access public -w @its-thepoe/prototype
npm publish --access public -w @its-thepoe/tauri-best-practices
npm publish --access public -w @its-thepoe/skills
```

The rule is simple: anything listed in **`skills/package.json`** `dependencies` must already exist on npm before the CLI version that depends on it is published.

**2FA — browser (typical for this repo):** run `npm publish --access public` from an interactive TTY/shell. Non-interactive publishes can fall back to `EOTP`, even when browser verification is enabled. If npm prints a browser auth URL, complete it; the interactive publish should continue and finish.

**2FA — OTP (only if npm returns `EOTP`):** use a fresh code per publish:

```bash
NPM_OTP=123456 npm publish --access public -w @its-thepoe/hugeicons
NPM_OTP=789012 npm publish --access public -w @its-thepoe/skills
```

For full monorepo publishing, use `chmod +x scripts/publish-all.sh` then `./scripts/publish-all.sh` (add `NPM_OTP=...` only if your npm account requires OTP for publish).

**`@its-thepoe/skills` `bin` field:** keep **`"skills": "./bin/cli.mjs"`** (leading `./`). Do **not** run **`npm pkg fix`** inside **`skills/`** — it rewrites the path to `bin/cli.mjs`, and `npm publish` can strip `bin` from the published package (broken `npx`).

---

## Step 1 — Confirm you can publish `@its-thepoe/*`

Packages are named `@its-thepoe/alt-text`, `@its-thepoe/skills`, etc.

- Your npm **username** should be **`its-thepoe`**, **or** you must be a member of the npm **organization** `its-thepoe` with publish rights.
- If your username is different and you have no org, either create the org on [npmjs.com](https://www.npmjs.com/) or rename every `package.json` `name` to your scope (out of scope for this doc).

---

## Step 2 — Sign in to npm

In a terminal:

```bash
npm login
```

Complete the browser or CLI flow npm shows you.

Check:

```bash
npm whoami
```

You should see **`its-thepoe`** (or the account that owns the `@its-thepoe` scope).

---

## Step 3 — Go to this repository

```bash
cd "/path/to/skills"   # your clone of this repo
```

Use the real path on your machine. For example:

```bash
cd "$HOME/src/skills"
```

---

## Step 4 — Install workspace dependencies

```bash
npm install
```

This links all workspaces under `node_modules` so the orchestrator resolves every skill locally.

---

## Step 5 — Validate what will ship

```bash
npm run validate
```

Every line should be `OK @its-thepoe/...`. If something fails, fix `package.json` / `files` before publishing.

---

## Step 6 — Two-factor authentication (2FA)

You may have 2FA enabled in either of these forms:

### A) Browser-based publish auth (common)

Run publish from an interactive TTY/shell, for example a normal terminal tab:

```bash
npm publish --access public -w @its-thepoe/write-a-skill
```

When browser verification is available, npm may print:

- "Authenticate your account at: …"
- "Press ENTER to open in the browser…"

Press Enter, complete the browser verification, and let the same publish command continue. Avoid non-interactive publish wrappers for browser 2FA; they can return `EOTP` instead of opening browser verification.

### B) One-time password (OTP)

If `npm publish` errors with **EOTP** and your account uses authenticator-code 2FA, pass `--otp` or use `NPM_OTP` with the scripts. If your account uses browser verification, rerun the publish from an interactive TTY instead.

1. Open your authenticator app.
2. Generate a **new** 6-digit code (they expire quickly).

---

## Step 7 — Publish packages (script)

From the **repo root:**

**Default for this repo:** use **browser-based** publish auth from an interactive TTY. For a small release, prefer the manual `npm publish --access public -w <workspace>` lines so each browser verification can complete in the same command.

### A) One or two new/changed skills + CLI

For releases like **`prototype`** + **`tauri-best-practices`**:

```bash
chmod +x scripts/publish-prototype-and-cli.sh
./scripts/publish-prototype-and-cli.sh
```

The script runs `npm run validate`, publishes skill packages, then **`@its-thepoe/skills`**. If a skill version is **already on npm**, it prints **`SKIP @its-thepoe/…`** and continues — re-run after a partial failure without bumping versions.

### B) Full monorepo (subset of skills)

Use **`./scripts/publish-all.sh`** only when you are publishing without 2FA friction or you know your shell preserves npm's interactive browser prompt. It also skips already-published versions.

If you use **OTP-based 2FA** instead, run:

```bash
NPM_OTP=123456 ./scripts/publish-all.sh
```

Replace `123456` with your **current** code.

If your npm account uses **browser-based publish auth** and the script returns **EOTP**, run the remaining publish lines manually in an interactive terminal.

Both scripts:

1. Run `npm run validate` again.
2. Publish **skill packages first**, then **`@its-thepoe/skills`**, in the correct order.

**If OTP expires** before the script finishes, note which package failed, generate a **new** code, and run the remaining publishes by hand (see [scripts/PUBLISH_ORDER.md](../scripts/PUBLISH_ORDER.md) for the exact `npm publish` lines).

**Critical:** Any **new** `@its-thepoe/<skill>` must be **`npm publish`’d** (or included in an earlier successful script step) **before** a **`@its-thepoe/skills`** release that lists it in **`dependencies`** ships to users. Otherwise `npx @its-thepoe/skills` installs will **404** on the missing skill package. If that happens, publish the missing skill package first; you usually **do not** need to republish the orchestrator.

**If you do not use 2FA** for publish (or use an automation token that bypasses it), you can run without `NPM_OTP`:

```bash
./scripts/publish-prototype-and-cli.sh
# or
./scripts/publish-all.sh
```

---

## Step 8 — Confirm on the registry

Check versions (should print `1.0.0` or whatever you published):

```bash
npm view @its-thepoe/skills version
npm view @its-thepoe/alt-text version
```

Open in a browser (examples):

- [https://www.npmjs.com/package/@its-thepoe/skills](https://www.npmjs.com/package/@its-thepoe/skills)
- [https://www.npmjs.com/package/@its-thepoe/alt-text](https://www.npmjs.com/package/@its-thepoe/alt-text)

---

## Step 9 — Smoke test as a user would

```bash
npx @its-thepoe/skills@latest install --all --dry-run
npx @its-thepoe/skills@latest check
```

Install a specific new skill:

```bash
npx --yes @its-thepoe/skills@latest install tauri-best-practices --dry-run
npx --yes @its-thepoe/skills@latest install prototype --dry-run
```

If `npx` still hits an old cache, try:

```bash
npx --yes @its-thepoe/skills@latest check
```

---

## Later releases (bump + publish again)

1. Bump **`version`** in every `package.json` you changed (keep orchestrator and skill versions aligned unless you have a reason not to).
2. Commit.
3. Repeat **Step 5** → **Step 7**. Use a fresh **`NPM_OTP`** only if npm requires OTP (`EOTP`) and you actually use authenticator-code 2FA. With **browser** publish auth, run publishes from an interactive TTY.

You **cannot** republish the same version twice; npm will reject it.

---

## Quick reference — common errors


| Error                                                                           | Meaning                                                                                                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **401** / `npm whoami` fails                                                    | Not logged in — run **Step 2**.                                                                                                                                    |
| **EOTP**                                                                        | If using browser 2FA, rerun the publish in an interactive TTY. If using authenticator-code 2FA, use `--otp` / `NPM_OTP`.                                          |
| **404** on `PUT` for `@its-thepoe/...`                                          | No permission for that scope — **Step 1**.                                                                                                                         |
| **404** on `GET` for `@its-thepoe/...` when **installing** `@its-thepoe/skills` | A skill package in the orchestrator’s `dependencies` is **not on the registry yet**. Publish that skill package (`npm publish -w @its-thepoe/<name>`), then retry. |
| **403** “cannot publish over the previously published versions”                 | That **version already exists** on npm. **Bump** semver in the skill's `package.json` (and matching entry in `skills/package.json` `dependencies`) if content changed, then publish again. If unchanged, **skip** it — re-run `./scripts/publish-prototype-and-cli.sh` (it skips automatically) or publish the remaining packages manually. |
| **403** forbidden                                                               | Token/user cannot publish this package.                                                                                                                            |


---

## Manual publish (no script)

Same order as [scripts/PUBLISH_ORDER.md](../scripts/PUBLISH_ORDER.md). Use **`--access public`** on every line. For browser-based publish auth, run these in an interactive TTY and omit `--otp`. Add **`--otp=CODE`** (or set **`NPM_OTP`**) only if your npm account uses authenticator-code 2FA.

**New skills + CLI** (preferred: use `./scripts/publish-prototype-and-cli.sh` instead):

```bash
npm publish --access public -w @its-thepoe/prototype
npm publish --access public -w @its-thepoe/tauri-best-practices
npm publish --access public -w @its-thepoe/skills
```

**Legacy subset** (see [scripts/publish-all.sh](../scripts/publish-all.sh)):

```bash
npm publish --access public -w @its-thepoe/alt-text
npm publish --access public -w @its-thepoe/design-and-refine
npm publish --access public -w @its-thepoe/design-engineering
npm publish --access public -w @its-thepoe/design-motion-principles
npm publish --access public -w @its-thepoe/family-taste
npm publish --access public -w @its-thepoe/canva-app-builder
npm publish --access public -w @its-thepoe/codebase-content-ideas
npm publish --access public -w @its-thepoe/market-command-matrix
npm publish --access public -w @its-thepoe/root-cause-analysis
npm publish --access public -w @its-thepoe/write-a-skill
npm publish --access public -w @its-thepoe/skills
```

See also [scripts/PUBLISH_ORDER.md](../scripts/PUBLISH_ORDER.md).
