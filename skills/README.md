# @its-thepoe/skills

**Orchestrator CLI** — installs, updates, checks, and removes [@its-thepoe](https://www.npmjs.com/search?q=scope%3Aits-thepoe) **Agent Skills** (`SKILL.md` trees) into the folders that **Cursor**, **Claude Code**, **OpenCode**, and **Windsurf** read from.

## What it does

One command line wraps symlink-or-copy installs, manifest-driven skill names, dry runs, and per-agent targeting. Skills stay versioned npm packages; the CLI is the **supported** way to put them on disk next to your agents without hand-maintaining paths.

## Why it’s useful

- **Repeatable** installs across machines and teammates (`npx … install --all`).
- **Safe previews** with `--dry-run` and explicit `remove` / `remove --all`.
- Works around **Windows symlink** limits via `--strategy copy`.

## Use when

- You want the **full @its-thepoe skill set** or a **subset** in your local agent directories.
- You’re onboarding a new machine or verifying installs (`check`, `sync --all`).

## Install & use

```bash
npx @its-thepoe/skills@latest install --all
npx @its-thepoe/skills@latest sync --all
npx @its-thepoe/skills@latest check
```

One skill:

```bash
npx @its-thepoe/skills@latest install alt-text
```

Options: `--dry-run`, `--only=cursor,claude`, `--strategy copy` (if symlinks fail), `remove <name>` / `remove --all`.

## Docs

- [Full documentation on GitHub](https://github.com/its-thepoe/skills) — root README, publish steps, troubleshooting.

## License

MIT
