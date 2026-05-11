# @its-thepoe/canva-app-builder

**Agent Skill** — **spec-first** workflow to build, audit, and ship **Canva Apps** against the Apps SDK, App UI Kit, and submission constraints.

## What it does

Routes the agent through discovery, design, implementation, and review so outputs match Canva’s platform rules (auth, UI patterns, packaging). Surfaces common failure modes early instead of learning them at submission time.

## Why it’s useful

- Reduces rework when something violates **SDK or review** expectations.
- Keeps **docs-aligned** decisions (fewer “works on my machine” app store surprises).
- Gives you a **checklist-shaped** conversation: what to build, what to verify, what to fix.

## Use when

- You’re starting or extending a **Canva App** (new feature, UI pass, or pre-submit audit).
- You want the agent grounded in **official Canva** constraints, not generic React advice alone.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install canva-app-builder
```

## Contents

- `SKILL.md` — router, modes, workflow, invariants  
- `reference.md` — build checklist, failure matrix, submission pass  

## Docs

- [Canva Apps docs](https://www.canva.dev/docs/apps/)  
- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
