# @its-thepoe/root-cause-analysis

**Agent Skill** — **engineering-grade root cause analysis**: move from symptoms to a **defensible** explanation (mechanism + **violated invariant**), with evidence split from inference. Optional **Fishbone**, **5 Whys**, **combined**, and **CAPA** flows stay **validation-first** (no brainstorm-only RC).

## What it does

Default output is **diagnosis before fixes**: symptom, facts, mechanism chain, primary root cause, contributors, falsifiability. Structured modes add Ishikawa-style buckets, depth-limited whys, or corrective-action tables when you ask for them—still grounded in what you can verify.

## Why it’s useful

- Stops “last file we touched” and label-only RCs (“race condition”, “React”) without a chain.
- Handles **multi-causal** incidents with primary + contributors instead of a fake single root.
- Gives **predictions** (“if we change X, Y stops under Z”) or an explicit **hypothesis** ladder when data is thin.

## Use when

- **Debugging**, **incidents**, **postmortems**, **RCA**, **why did this break**, or you want **Fishbone / 5 Whys / CAPA** output.
- You want diagnosis **without** an automatic giant refactor unless you ask to fix in the same turn.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install root-cause-analysis
```

## Contents

- `SKILL.md` — modes, workflow, output shape  
- `reference.md` — methods, templates, Mermaid starters, external links  

## Docs

- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
