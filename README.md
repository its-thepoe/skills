# Agent skills from my own workflow

This repo is a collection of Agent Skills I actually use in my own workflow with tools like **Codex**, **Cursor**, **Claude Code**, **OpenCode**, **Windsurf**, and whatever else I am trying at the moment.

Over time I noticed there are certain things I always do, and I kept doing them manually, step by step, even though the pattern was the same across tools. In a bid to be a bit more agentic about it, I started condensing those multi-step routines into reusable skills instead of prompting around them from scratch every time.

I care a lot about reusability when I am designing and building, so this is basically me treating my own habits as components and packaging them in a way that feels clean enough to reuse. If a skill is here, it probably means it bothered me at some point and I tried to solve for it properly instead of letting it keep annoying me in ten different places.

As with a lot of things I make, this is a constant work in progress, so you can expect the skills to shift and improve over time. If you want to pull any of this into your own setup, you can install the skills directly from npm and wire them into your agent of choice.

Packages are published on [npm](https://www.npmjs.com/) under the **`@its-thepoe`** scope.

---

## Quick Start

Install all skills:

```bash
npx @its-thepoe/skills@latest install --all
```

Restart or reload your agent/editor after installing so it can pick up the new skill folders.

Update installed skills:

```bash
npx @its-thepoe/skills@latest sync --all
```

Check installed skills:

```bash
npx @its-thepoe/skills@latest check
```

## Supported Agents

The installer can write skills into the local folders used by:

- Codex
- Cursor
- Claude Code
- OpenCode
- Windsurf

You can limit installs to specific agents:

```bash
npx @its-thepoe/skills@latest install --all --only=codex,cursor,claude
```

## Install One Skill

| Skill | Command |
| --- | --- |
| alt-text | `npx @its-thepoe/skills@latest install alt-text` |
| canva-app-builder | `npx @its-thepoe/skills@latest install canva-app-builder` |
| codebase-content-ideas | `npx @its-thepoe/skills@latest install codebase-content-ideas` |
| design-and-refine | `npx @its-thepoe/skills@latest install design-and-refine` |
| design-engineering | `npx @its-thepoe/skills@latest install design-engineering` |
| design-motion-principles | `npx @its-thepoe/skills@latest install design-motion-principles` |
| family-taste | `npx @its-thepoe/skills@latest install family-taste` |
| hugeicons | `npx @its-thepoe/skills@latest install hugeicons` |
| iconsax | `npx @its-thepoe/skills@latest install iconsax` |
| market-command-matrix | `npx @its-thepoe/skills@latest install market-command-matrix` |
| pr-tldr | `npx @its-thepoe/skills@latest install pr-tldr` |
| root-cause-analysis | `npx @its-thepoe/skills@latest install root-cause-analysis` |
| tailwindcss | `npx @its-thepoe/skills@latest install tailwindcss` |
| write-a-skill | `npx @its-thepoe/skills@latest install write-a-skill` |

Install several at once:

```bash
npx @its-thepoe/skills@latest install alt-text design-engineering hugeicons
```

## Skills

| Package | What it does |
| --- | --- |
| `@its-thepoe/skills` | CLI for installing, syncing, checking, and removing skills |
| `@its-thepoe/alt-text` | Scans image usage and drafts better alt text for review |
| `@its-thepoe/canva-app-builder` | Builds Canva Apps against SDK docs, UI kit, and review constraints |
| `@its-thepoe/codebase-content-ideas` | Turns real repo work into blog, social, and writing ideas |
| `@its-thepoe/design-and-refine` | Runs a Design Lab style workflow for UI variations and synthesis |
| `@its-thepoe/design-engineering` | Reviews and improves UI craft, motion, easing, and component feel |
| `@its-thepoe/design-motion-principles` | Audits motion and interaction design through multiple design lenses |
| `@its-thepoe/family-taste` | Applies Family Values UI philosophy: simplicity, fluidity, and delight |
| `@its-thepoe/hugeicons` | Sets up Hugeicons Free correctly and resolves exact icon names |
| `@its-thepoe/iconsax` | Sets up Iconsax correctly and resolves exact icon component names |
| `@its-thepoe/market-command-matrix` | Maps competitors by mindshare/resources and chooses a clear market motion |
| `@its-thepoe/pr-tldr` | Writes concise PR summaries with grouped changes, risks, open items, and test plans |
| `@its-thepoe/root-cause-analysis` | Diagnoses engineering problems through mechanism chains and violated invariants |
| `@its-thepoe/tailwindcss` | Implements Tailwind CSS (v3/v4) and debugs setup/version issues |
| `@its-thepoe/write-a-skill` | Helps author and package new Agent Skills |

Each skill folder is self-contained and has a `SKILL.md` at the root. Most skills also include their own `README.md` and optional references.

## CLI Options

Install several at once:

```bash
npx @its-thepoe/skills@latest install alt-text design-engineering hugeicons
```

Only target specific agents (comma-separated: `codex`, `cursor`, `claude`, `opencode`, `windsurf`):

```bash
npx @its-thepoe/skills@latest install --all --only=codex,cursor,claude
```

Preview actions without changing files:

```bash
npx @its-thepoe/skills@latest install --all --dry-run
```

If **symlinks fail** (often on Windows without dev mode), use **copy** strategy:

```bash
npx @its-thepoe/skills@latest install --all --strategy copy
```

Remove one skill from agent directories:

```bash
npx @its-thepoe/skills@latest remove alt-text
```

Remove all installed skills:

```bash
npx @its-thepoe/skills@latest remove --all
```

## From Source

If you want to run the repo locally instead of using npm:

```bash
git clone https://github.com/its-thepoe/skills.git
cd skills
npm install
npm run skills -- install --all
```

Preview local run:

```bash
npm run skills -- install --all --dry-run
```

Manual symlinks — set `SKILLS_ROOT` to your clone and `SKILL_NAME` to the folder name:

```bash
SKILLS_ROOT="$HOME/src/skills"
SKILL_NAME=alt-text
mkdir -p ~/.agents/skills ~/.cursor/skills ~/.claude/skills ~/.config/opencode/skills ~/.codeium/windsurf/skills
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.agents/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.cursor/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.claude/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.config/opencode/skills/"$SKILL_NAME"
ln -sfn "$SKILLS_ROOT/$SKILL_NAME" ~/.codeium/windsurf/skills/"$SKILL_NAME"
```

## Other Agents (e.g. Gemini / Antigravity)

Official paths vary. After you have a skill folder, symlink or copy it into the directory your product documents (often under `~/.gemini/skills/` or a project `.agent/skills/` path).

## Troubleshooting

| Problem | What to do |
| --- | --- |
| **`npx …` → 404 Not Found** | The package is not on npm yet, or the name is wrong. Use **From source** above, or ask the maintainer to publish. |
| **EOTP / one-time password** | Publish-time only. If you use **browser** publish auth, rerun `npm publish --access public` in an interactive TTY/shell so npm can print/open the browser verification URL. Use `--otp` / `NPM_OTP` only for authenticator-code 2FA. End users do not see this when **installing**. |
| **`check` reports MISSING** | Run `install` or `sync` again; confirm paths like `~/.cursor/skills/<name>` exist. |
| **Symlink errors (Windows)** | Use `--strategy copy`. |
| **Skills don’t appear** | Fully restart the app or reload the window after `install`. |

## Repository Layout (Contributors)

This repo is an npm **workspace**: one folder per skill plus [`skills/`](skills/) for the `@its-thepoe/skills` CLI. To add a skill, ship `SKILL.md`, add `package.json` (`name`: `@its-thepoe/<folder>`), a short **`README.md`** (npmjs.com shows this per package), list `README.md` in `package.json` **`files`**, register it in [`skills/skills.manifest.json`](skills/skills.manifest.json) and [`skills/package.json`](skills/package.json) `dependencies`, then run `npm run validate`. Publishing order and scripts: [`scripts/PUBLISH_ORDER.md`](scripts/PUBLISH_ORDER.md).

Maintainer one-liner (after `npm login`; **browser 2FA:** use an interactive TTY/shell, no `NPM_OTP`):

```bash
npm install && npm run validate && ./scripts/publish-all.sh
```

## Docs

- [Publishing guide](docs/publish-step-by-step.md)
- [Publishing jargon](docs/publishing-jargon.md)
- [Troubleshooting](docs/troubleshooting.md)

## License

MIT
