# @its-thepoe/write-a-skill

**Agent Skill** — **author or upgrade Agent Skills**: correct `SKILL.md` frontmatter, triggers, structure, optional `reference.md` / `references/`, and clear guidance on **skill vs always-on rules** (`.cursor/rules`, `CLAUDE.md`, `AGENTS.md`).

## What it does

Walks context (audience, greenfield vs recurring workflow), avoids duplication with existing skills, enforces concise `SKILL.md` + linked deep docs, and checks distribution paths (Cursor, Claude Code, OpenCode, Windsurf, etc.). Helps you ship skills that agents actually invoke when users say the right things.

## Why it’s useful

- Reduces **broken skills** (vague description, no triggers, giant unmaintainable `SKILL.md`).
- Clarifies when something should be a **rule** (“always follow”) vs a **skill** (“when this task appears”).
- Points non-repo users at **prompt packs** and optional **`LOVABLE.md`** when relevant.

## Use when

- You’re **creating**, **refining**, or **scaffolding** a skill, slash command, or prompt pack.
- You ask **write-a-skill**, **agent skill structure**, or **frontmatter for skills**.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install write-a-skill
```

## Contents

- `SKILL.md` — authoring workflow  
- `reference.md` — templates, checklists, Claude Code / multi-product notes  

## Docs

- [Agent Skills (standard)](https://agentskills.io)  
- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
