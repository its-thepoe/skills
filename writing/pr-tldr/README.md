# @its-thepoe/pr-tldr

**Agent Skill** — writes high-signal PR TLDRs: concise top-level summaries, grouped changes, behavior notes, honest open items, and test plans.

## What it does

This skill turns a pull request, branch, or local diff into a reviewer-friendly brief. It is meant to apply automatically whenever you ask for a PR TLDR, PR summary, branch summary, or "what changed in this PR."

It pushes agents to inspect the actual diff and group changes by intent rather than dumping commit messages or file lists.

## Why it’s useful

- Gives reviewers a quick map of large PRs.
- Separates top-level intent from detailed implementation.
- Calls out visual/behavior changes and open items honestly.
- Includes test and verification signals when available.
- Avoids pretending partial AI analysis is exhaustive.

## Use when

- You want a concise PR summary.
- You need a handoff note for reviewers.
- You want a changelog-style explanation of a branch.
- You are preparing a large PR description from a local branch.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install pr-tldr
```

Or install [all skills](https://www.npmjs.com/package/@its-thepoe/skills).

## Contents

- `SKILL.md` — trigger behavior, workflow, default output shape, and rules
- `reference.md` — fuller templates, evidence checklist, and examples

## Docs

- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
