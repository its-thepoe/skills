# Agent Skills (`@its-thepoe`)

This repository is the source of truth for reusable **Agent Skills** (each folder has a `SKILL.md`). Skills are published to npm under the **`@its-thepoe`** scope.

## Install everything (recommended)

Use the **orchestrator** package **`@its-thepoe/skills`**. It links or copies **all** skills into your local agent skill directories (Cursor, Claude Code, OpenCode, Windsurf).

```bash
npx @its-thepoe/skills@latest install --all
```

Update or repair installs (idempotent):

```bash
npx @its-thepoe/skills@latest sync --all
```

Verify installs (symlinks / copies, `SKILL.md` present):

```bash
npx @its-thepoe/skills@latest check
```

Compare with the npm registry (optional, needs network):

```bash
npx @its-thepoe/skills@latest check --online
```

Install **one** skill by folder name (same names as in this repo):

```bash
npx @its-thepoe/skills@latest install alt-text design-engineering
```

Preview changes without writing:

```bash
npx @its-thepoe/skills@latest install --all --dry-run
```

Limit targets (comma-separated):

```bash
npx @its-thepoe/skills@latest install --all --only=cursor,claude
```

If **symlinks fail** (common on some Windows setups), use **copy** mode:

```bash
npx @its-thepoe/skills@latest install --all --strategy copy
```

Remove managed installs:

```bash
npx @its-thepoe/skills@latest remove --all
```

Reload or restart Cursor, Claude Code, OpenCode, and Windsurf after installing.

## Monorepo layout

Each publishable skill is an npm workspace folder at the repo root. The orchestrator CLI lives in [`skills/`](skills/) (package name **`@its-thepoe/skills`**, binary name **`skills`**).

```text
<repo>/
  package.json              # private workspace root
  skills/                   # @its-thepoe/skills (orchestrator)
  alt-text/                 # @its-thepoe/alt-text
  design-and-refine/
  design-engineering/
  design-motion-principles/
  family-taste/
  write-a-skill/
```

Adding a new skill: create the folder + `SKILL.md`, add `package.json` (`name`: `@its-thepoe/<folder>`), then add it to [`skills/skills.manifest.json`](skills/skills.manifest.json) and to **`dependencies`** in [`skills/package.json`](skills/package.json).

## Local development (this repo)

Install workspace dependencies:

```bash
npm install
```

Run the CLI without `npx`:

```bash
npm run skills -- check
npm run skills -- install --all --dry-run
```

Validate pack contents for every workspace package:

```bash
npm run validate
```

## Publishing

**Step-by-step (start here):** [`docs/publish-step-by-step.md`](docs/publish-step-by-step.md)

Quick path after `npm login`:

```bash
npm install
npm run validate
NPM_OTP=123456 ./scripts/publish-all.sh   # replace 123456 with your authenticator code if 2FA is on
```

Order and troubleshooting: [`scripts/PUBLISH_ORDER.md`](scripts/PUBLISH_ORDER.md). Skill packages must be published **before** `@its-thepoe/skills` so dependency versions resolve on the registry.

## Docs

- [`docs/publish-step-by-step.md`](docs/publish-step-by-step.md) — numbered publish checklist (login, validate, OTP, verify)
- [`docs/publishing-jargon.md`](docs/publishing-jargon.md) — plain-language npm terms (`semver`, `npx`, `files`, etc.)

## Workflow for this repo

- Default workflow is **commit directly on `main`** for normal updates.
- Feature branches only when explicitly needed.

## Optional: Gemini / Antigravity

Path differs by setup. After installing skills, symlink or copy into the path your tool documents (often under `~/.gemini/skills/`).

## Package index

| Package | Purpose |
|--------|---------|
| `@its-thepoe/skills` | **Orchestrator** — `install`, `sync`, `check`, `remove` |
| `@its-thepoe/alt-text` | Alt text audit + review table workflow |
| `@its-thepoe/design-and-refine` | Design & Refine / Design Lab playbook |
| `@its-thepoe/design-engineering` | Design engineering / UI craft |
| `@its-thepoe/design-motion-principles` | Motion audit (multi-reference skill) |
| `@its-thepoe/family-taste` | Family Values UI philosophy |
| `@its-thepoe/write-a-skill` | Authoring Agent Skills |

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| `check` says bundle not resolvable | Run `npx @its-thepoe/skills@latest` (fresh install) so `node_modules` includes all skill deps |
| Symlink permission errors (Windows) | `install --all --strategy copy` |
| Nothing updates | Use `@latest` on the package: `npx @its-thepoe/skills@latest ...` |
| `npm publish` fails | Run `npm whoami`; use `--access public` for scoped packages |
| Wrong / partial skill after install | Check `package.json#files` in that skill; run `npm run validate` in this repo |
