# @its-thepoe Agent Skills

**Agent Skills** are portable instruction packs (`SKILL.md` + optional references) for AI coding assistants. This collection installs into **Cursor**, **Claude Code**, **OpenCode**, and **Windsurf** skill directories on your machine.

**Registry:** packages are published on [npm](https://www.npmjs.com/) under the **`@its-thepoe`** scope ([search](https://www.npmjs.com/search?q=scope%3Aits-thepoe)).

---

## Quick start

Install **all** skills (recommended):

```bash
npx @its-thepoe/skills@latest install --all
```

Restart or reload your editor / agent so new skills are picked up.

**Update** installs (safe to run anytime):

```bash
npx @its-thepoe/skills@latest sync --all
```

**Check** that skills are linked and `SKILL.md` is present:

```bash
npx @its-thepoe/skills@latest check
```

(Optional, needs network — compare local versions to the registry:)

```bash
npx @its-thepoe/skills@latest check --online
```

---

## Install one skill

| Skill | Command |
|--------|---------|
| alt-text | `npx @its-thepoe/skills@latest install alt-text` |
| design-and-refine | `npx @its-thepoe/skills@latest install design-and-refine` |
| design-engineering | `npx @its-thepoe/skills@latest install design-engineering` |
| design-motion-principles | `npx @its-thepoe/skills@latest install design-motion-principles` |
| family-taste | `npx @its-thepoe/skills@latest install family-taste` |
| write-a-skill | `npx @its-thepoe/skills@latest install write-a-skill` |

Install several at once:

```bash
npx @its-thepoe/skills@latest install alt-text design-engineering
```

Re-link one skill after an update:

```bash
npx @its-thepoe/skills@latest sync alt-text
```

Remove one skill from agent directories:

```bash
npx @its-thepoe/skills@latest remove alt-text
```

---

## CLI options

Preview actions (no files changed):

```bash
npx @its-thepoe/skills@latest install --all --dry-run
```

Only some agents (comma-separated: `cursor`, `claude`, `opencode`, `windsurf`):

```bash
npx @its-thepoe/skills@latest install --all --only=cursor,claude
```

If **symlinks fail** (often on Windows without dev mode), use **copy** mode:

```bash
npx @its-thepoe/skills@latest install --all --strategy copy
```

Remove all skills installed by this tool:

```bash
npx @its-thepoe/skills@latest remove --all
```

---

## What each package is

| npm package | What it does |
|-------------|----------------|
| `@its-thepoe/skills` | **CLI** — `install`, `sync`, `check`, `remove` |
| `@its-thepoe/alt-text` | Image alt text: scan, draft, review table, then apply (Next.js, React, Astro, Vue, CMS-shaped content) |
| `@its-thepoe/design-and-refine` | Design & Refine / Design Lab style workflow |
| `@its-thepoe/design-engineering` | UI craft: motion, easing, component polish |
| `@its-thepoe/design-motion-principles` | Motion audit (multi-file references) |
| `@its-thepoe/family-taste` | Family Values UI philosophy |
| `@its-thepoe/write-a-skill` | How to author and ship Agent Skills |

Skills follow the [Agent Skills](https://agentskills.io) idea: each folder is self-contained with `SKILL.md` at the root.

---

## Troubleshooting

| Problem | What to do |
|---------|------------|
| **`npx …` → 404 Not Found** | The package is not on npm yet, or the name is wrong. Use **From source** below, or ask the maintainer to publish. |
| **EOTP / one-time password** | Your npm account uses 2FA for publish; end users normally do not see this when **installing**. |
| **`check` reports MISSING** | Run `install` or `sync` again; confirm paths like `~/.cursor/skills/<name>` exist. |
| **Symlink errors (Windows)** | Use `--strategy copy`. |
| **Skills don’t appear** | Fully restart the app or reload the window after `install`. |

---

## From source (GitHub, no npm)

If `npx @its-thepoe/skills@latest` is not available yet, clone and run the same CLI locally:

```bash
git clone https://github.com/its-thepoe/skills.git
cd skills
npm install
npm run skills -- install --all
# or one skill: npm run skills -- install alt-text
```

**Manual symlinks** — set `SKILLS_ROOT` to your clone and `SKILL_NAME` to the folder name:

```bash
SKILLS_ROOT="$HOME/src/skills"
SKILL_NAME=alt-text
mkdir -p ~/.cursor/skills ~/.claude/skills ~/.config/opencode/skills ~/.codeium/windsurf/skills
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.cursor/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.claude/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.config/opencode/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.codeium/windsurf/skills/"$SKILL_NAME"
```

---

## Other agents (e.g. Gemini / Antigravity)

Official paths vary. After you have a skill folder, symlink or copy it into the directory your product documents (often under `~/.gemini/skills/` or a project `.agent/skills/` path).

---

## More documentation

- [docs/publishing-jargon.md](docs/publishing-jargon.md) — npm terms explained (`npx`, `semver`, `files`, etc.) and **what install feels like** per method.
- [docs/publish-step-by-step.md](docs/publish-step-by-step.md) — **maintainers:** how to publish to npm (login, OTP, order).

---

## Repository layout (contributors)

This repo is an npm **workspace**: one folder per skill plus [`skills/`](skills/) for the `@its-thepoe/skills` CLI. To add a skill, ship `SKILL.md`, add `package.json` (`name`: `@its-thepoe/<folder>`), register it in [`skills/skills.manifest.json`](skills/skills.manifest.json) and [`skills/package.json`](skills/package.json) `dependencies`, then run `npm run validate`. Publishing order and scripts: [`scripts/PUBLISH_ORDER.md`](scripts/PUBLISH_ORDER.md).

```text
skills/          → @its-thepoe/skills (CLI)
alt-text/        → @its-thepoe/alt-text
design-and-refine/
design-engineering/
design-motion-principles/
family-taste/
write-a-skill/
```

Maintainer one-liner (after `npm login`; use a fresh OTP if 2FA is on):

```bash
npm install && npm run validate && NPM_OTP=123456 ./scripts/publish-all.sh
```

Replace `123456` with your authenticator code, or omit `NPM_OTP=...` if publish does not require OTP.
