# @its-thepoe/codebase-content-ideas

**Agent Skill** — turns **real code and local notes** into concrete **blog posts, short notes, X threads, and LinkedIn angles** without inventing files or fake claims.

## What it does

Scans the open repository for interesting implementation detail, ADRs, bugs, TILs, and markdown notes, then proposes content **anchored to real paths and patterns**. Modes control depth and output mix (`mode:quick`, `mode:drafts-only`, `mode:social-only`).

## Why it’s useful

- Ships **credible** technical content grounded in what you actually built.
- Saves time when you “should write about this” but need a structured first pass.
- Avoids generic SEO outlines that don’t reference your repo.

## Use when

- You want **content ideas from this codebase**, a writing partner for shipping learnings, or thread ideas from real work.
- You’re documenting a refactor, launch, or tricky bug and want **exportable drafts**.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install codebase-content-ideas
```

## Contents

- `SKILL.md` — workflow, modes, quality gates  
- `reference.md` — copy-paste prompt for any codebase, per-idea template  

## Docs

- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
