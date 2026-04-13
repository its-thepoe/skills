# Publish to npm — step by step

Follow these steps **in order** on the machine where you want to publish (your laptop is fine). Official npm background: [docs.npmjs.com](https://docs.npmjs.com/), scoped public packages: [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages).

---

## TL;DR — `codebase-content-ideas` + CLI (the flow that works)

Use this when you changed `**codebase-content-ideas/`** and/or bumped its version in `**skills/package.json**`.

1. Bump `**codebase-content-ideas/package.json**` `version` (never republish an existing version).
2. Set `**skills/package.json**` `"@its-thepoe/codebase-content-ideas"` to that same version and bump `**@its-thepoe/skills**` `version`.
3. From **repo root**: `npm install && npm run validate`
4. Publish **in this order only** (skill first, orchestrator second):

```bash
npm publish --access public -w @its-thepoe/codebase-content-ideas
npm publish --access public -w @its-thepoe/skills
```

2FA:

```bash
NPM_OTP=123456 npm publish --access public -w @its-thepoe/codebase-content-ideas
NPM_OTP=789012 npm publish --access public -w @its-thepoe/skills
```

One script (same order): `chmod +x scripts/publish-codebase-content-ideas-and-cli.sh` then `./scripts/publish-codebase-content-ideas-and-cli.sh` (or `NPM_OTP=... ./scripts/...`).

`**@its-thepoe/skills` `bin` field:** keep `**"skills": "./bin/cli.mjs"`** (leading `**./**`). Do **not** run `**npm pkg fix`** inside `**skills/**` — it rewrites the path to `bin/cli.mjs`, and `**npm publish` then strips `bin**` from the published package (broken `npx`).

---

## Step 1 — Confirm you can publish `@its-thepoe/*`

Packages are named `@its-thepoe/alt-text`, `@its-thepoe/skills`, etc.

- Your npm **username** should be `**its-thepoe`**, **or** you must be a member of the npm **organization** `its-thepoe` with publish rights.
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

You should see `**its-thepoe**` (or the account that owns the `@its-thepoe` scope).

---

## Step 3 — Go to this repository

```bash
cd "/path/to/skills"   # your clone of this repo
```

Use the real path on your machine (example):

```bash
cd "$HOME/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/skills"
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

If your npm account requires a **one-time password** to publish, npm will error with **EOTP** unless you pass `**--otp`**.

1. Open your authenticator app.
2. Generate a **new** 6-digit code (they expire quickly).

You will use it in the next step **immediately** after generating it.

---

## Step 7 — Publish all packages (script)

From the **repo root**:

```bash
NPM_OTP=123456 ./scripts/publish-all.sh
```

Replace `**123456**` with your **current** code.

The script:

1. Runs `npm run validate` again.
2. Publishes **every skill package** listed in the script, then `**@its-thepoe/skills`**, in the correct order.

**If the OTP expires** before the script finishes, note which package failed, generate a **new** code, and run the remaining publishes by hand (see [scripts/PUBLISH_ORDER.md](../scripts/PUBLISH_ORDER.md) for the exact `npm publish` lines).

**Critical:** Any **new** `@its-thepoe/<skill>` must be `**npm publish`’d before** (or at least not after) you publish a `**@its-thepoe/skills`** version that lists it in `dependencies`. Otherwise `npx @its-thepoe/skills` installs will **404** on the missing skill package. If that happens, publish the missing skill package first; you usually **do not** need to republish the orchestrator.

**If you do not use 2FA** for publish (or use an automation token that bypasses it), you can run without `NPM_OTP`:

```bash
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

If `npx` still hits an old cache, try:

```bash
npx --yes @its-thepoe/skills@latest check
```

---

## Later releases (bump + publish again)

1. Bump `**version**` in every `package.json` you changed (keep orchestrator and skill versions aligned unless you have a reason not to).
2. Commit.
3. Repeat **Step 5** → **Step 7** with a fresh `**NPM_OTP`** if required.

You **cannot** republish the same version twice; npm will reject it.

---

## Quick reference — common errors


| Error                                                                           | Meaning                                                                                                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **401** / `npm whoami` fails                                                    | Not logged in — run **Step 2**.                                                                                                                                    |
| **EOTP**                                                                        | Need `--otp` — **Step 6–7** (`NPM_OTP=...`).                                                                                                                       |
| **404** on `PUT` for `@its-thepoe/...`                                          | No permission for that scope — **Step 1**.                                                                                                                         |
| **404** on `GET` for `@its-thepoe/...` when **installing** `@its-thepoe/skills` | A skill package in the orchestrator’s `dependencies` is **not on the registry yet**. Publish that skill package (`npm publish -w @its-thepoe/<name>`), then retry. |
| **403** “cannot publish over the previously published versions”                 | You are trying to ship a **version number that already exists** on npm. Bump to a **new** semver in `package.json`, then publish again.                            |
| **403** forbidden                                                               | Token/user cannot publish this package.                                                                                                                            |


---

## Manual publish (no script)

Same order as `[scripts/publish-all.sh](../scripts/publish-all.sh)`, each with `--access public` and optional `--otp=CODE`:

```bash
npm publish --access public --otp=CODE -w @its-thepoe/alt-text
npm publish --access public --otp=CODE -w @its-thepoe/design-and-refine
npm publish --access public --otp=CODE -w @its-thepoe/design-engineering
npm publish --access public --otp=CODE -w @its-thepoe/design-motion-principles
npm publish --access public --otp=CODE -w @its-thepoe/family-taste
npm publish --access public --otp=CODE -w @its-thepoe/codebase-content-ideas
npm publish --access public --otp=CODE -w @its-thepoe/write-a-skill
npm publish --access public --otp=CODE -w @its-thepoe/skills
```

See also `[scripts/PUBLISH_ORDER.md](../scripts/PUBLISH_ORDER.md)`.