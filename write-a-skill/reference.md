# Write a skill — reference

## Folder structure

```text
skill-name/
├── SKILL.md              # Entry point — required
├── reference.md          # Long tables, templates, extra checklists (optional)
├── examples.md           # Before/after samples (optional)
├── references/           # Optional: schemas, templates, catalogs (see below)
│   ├── findings-schema.json
│   └── ...
└── scripts/              # Validation or scaffolding only (optional)
```

**This repo:** each skill is a **top-level folder** next to `README.md` (e.g. `write-a-skill/`, `another-skill/`). Copy or symlink that folder into each agent’s global skills path (Cursor, Claude Code, Windsurf, Gemini / Antigravity — see `SKILL.md` table).

Keep `SKILL.md` short; move bulk here.

---

## Plugin or monorepo layout

When publishing a **Claude Code plugin** (or similar), skills often live under:

```text
plugins/<plugin-id>/
├── .claude-plugin/       # plugin manifest (product-specific)
├── skills/
│   └── <skill-name>/
│       └── SKILL.md
├── agents/               # optional: subagent definitions
├── AGENTS.md             # optional: project memory for the plugin
└── .mcp.json             # optional: bundled MCP
```

The **one-folder-per-skill** rule is unchanged: each `skills/<skill-name>/` directory is a single skill. Names may be **namespaced** by the product (e.g. `plugin-id:skill-name` in menus).

---

## Supporting files beyond `reference.md`

For heavier skills, colocate machine- or human-facing artifacts and **link them from `SKILL.md`** with “what this file is / when to load it”:

| Artifact | Use case |
|----------|----------|
| `references/*.md` | Persona catalogs, diff rules, long policy |
| `references/*.json` | JSON schema for subagent outputs, merge pipelines |
| `references/*-template.md` | Subagent prompt shells, output report shells |
| `examples/*` | Expected output shapes |

Avoid dumping 2k+ lines into `SKILL.md` without navigation; mature orchestration skills use an **index body + deep files**.

---

## Leaf vs orchestrator skills

**Leaf**

- Single outcome, narrow triggers.
- Body is a short ordered checklist or policy.
- Example: “write conventional commit message from diff”.

**Orchestrator**

- Phases (research → decide → write → handoff), **parallel** sub-tasks, or fan-out to **subagents**.
- Body states **which steps run when**, what can run in **parallel**, and **stop conditions**.
- Risk: one giant skill with vague `description` → wrong invocations. Mitigation: **split phases into separate skills** when each phase is useful alone, or tighten `description` with **guards** (see below).

Orchestrators still benefit from **invariants** and **structured outputs** (e.g. JSON schema) when merging subagent results.

---

## Description with guards and handoffs

The `description` is the **router**. Besides “use when …”, strong skills add:

1. **Handoff:** “Prefer **\<other skill>** when …” (ambiguous scope, missing inputs, wrong phase).
2. **Guard:** “Do not use for …” or “Requires … before running” (only when it prevents real failures).

**Example (pattern only)**

```yaml
description: >
  Turns an approved requirements doc into a technical implementation plan with
  file-level traceability. Use when the user says "plan this", "technical plan",
  or "break down implementation". Prefer skill "brainstorm-requirements" first
  when goals or scope are still unclear. Does not implement code or run tests —
  use "execute-plan" for implementation.
```

Stay within product **length limits** (~1024 chars where enforced). Prioritize triggers + the single most important guard.

---

## Arguments, modes, and Claude Code placeholders

[Claude Code skills](https://code.claude.com/docs/en/skills) support:

- **`argument-hint`:** shown during `/` completion (e.g. `[pr-url] [mode:report-only]`).
- **`$ARGUMENTS`:** full remainder after `/skill-name`.
- **`$0`, `$1`, …** or **`$ARGUMENTS[0]`:** positional args.
- **Mode tokens:** conventionally embed keywords in args (e.g. `mode:autofix`) and strip them in the body before interpreting the rest — yields **one slash command, multiple behaviors**.

Document in the skill body: **parse order**, **mutual exclusion**, and **side-effect rules** per mode.

Other products may not support these placeholders; for **portable** skills, keep critical behavior in prose and treat `$…` as progressive enhancement for Claude Code.

---

## Cross-product interactive prompts

If a step requires **blocking user input**, name the mechanism per product where you know it, e.g.:

- Claude Code: interactive question / `AskUserQuestion`
- Other CLIs: as documented

Otherwise stay **product-agnostic**: “Ask one focused question; wait for an answer before continuing.”

---

## Invariants, never-rules, and quality gates

**Invariants** — state what must never be violated:

- Paths or artifacts that **must not** be deleted or “cleaned up” by subagents.
- “Never run migrations in this skill — planning only.”

**Never-rules** — short bullets the agent must not do (reduces compound errors in long playbooks).

**Quality gates** — before delivering output, confirm:

- Findings are actionable (not “consider improving…” with no concrete next step).
- Severities match impact.
- Line refs / file paths were verified if cited.

Use these in **orchestrator** and **review**-style skills especially.

---

## SKILL.md template

Use this as a starting point. Most agents accept `name` + `description` (see [Agent Skills](https://agentskills.io)). Claude Code may also use `disable-model-invocation`, `allowed-tools`, `context: fork`, etc. — see [Claude Code skills](https://code.claude.com/docs/en/skills). For skills shared across Cursor, Windsurf, OpenCode, Antigravity, and Claude Code, keep frontmatter minimal unless a key is widely supported.

```yaml
---
name: skill-name
description: >
  One sentence: what capability this adds. When to use: user phrases and tasks.
  Prefer skill "other-skill" when [guard condition]. Not for [anti-pattern].
argument-hint: "[optional-args]"
---

# Human-readable title

## When to use this skill

[Who invokes it, project state, boundaries. Handoffs to sibling skills.]

## Standards (if any)

Before starting, read if they exist in this repo:

- docs/contributing.md
- AGENTS.md

## Workflow

1. …
2. …

## Invariants (if any)

- Never …
- Do not delete …

## Checklist

- [ ] …
- [ ] …

## Additional resources

- [reference.md](reference.md) — …
- [references/schema.json](references/schema.json) — …
```

---

## Description rules

The **description** is what the model uses to decide whether to load the skill. Make it unambiguous.

**Good**

> Sets up a new frontend repo with shared tokens, folder layout, and UI primitives. Use when starting a greenfield frontend, scaffolding an app, or when the user says: new project, bootstrap, design tokens, component library, or init frontend.

**Bad**

> Helps with frontend setup and the design system.

---

## Prompt pack (non-repo users)

If the audience does not have the repo, add `prompts/skill-name.md` (or a single section in your docs) with:

- One copy-paste block with the rules inlined (no `see ../foo` only paths).
- One line: when to use it.
- No dependency on local-only files unless you also paste their content.

---

## Lovable (optional; not every skill)

[Lovable](https://lovable.dev) uses [Knowledge](https://docs.lovable.dev/features/knowledge) and root **`AGENTS.md`** / **`CLAUDE.md`** on GitHub-linked projects — not `SKILL.md` folders.

Skills that support Lovable add **`LOVABLE.md`** beside `SKILL.md`. Keep each `LOVABLE.md` under the **10,000-character** Knowledge limit where possible, or point `AGENTS.md` at the full `SKILL.md` in the synced repo.

---

## Full review checklist

**Structure**

- [ ] `SKILL.md` under ~100–200 lines of *instruction* unless it is a deliberate, well-structured orchestrator; split detail to this file or `references/`
- [ ] Folder name is kebab-case and matches `name` in frontmatter (per product)
- [ ] No time-sensitive information baked in without a “legacy” label

**Description**

- [ ] Specific trigger words or scenarios
- [ ] First sentence = capability; when to use is obvious
- [ ] Guards or handoffs if mis-routing is costly
- [ ] Under 1024 characters where enforced

**Content**

- [ ] Greenfield vs brownfield called out if it changes the workflow
- [ ] Final checklist the agent can tick
- [ ] Examples are concrete (not lorem ipsum)
- [ ] Invariants / never-rules if the skill is high-stakes or delegates to subagents

**Distribution**

- [ ] Documented install paths for target agents (global vs project; see repo `README.md` for a path table)
- [ ] Prompt pack created if non-repo or non-engineering tools need the same behavior
- [ ] If Lovable matters for this skill: `LOVABLE.md` added in the skill folder

---

## Claude Code extras (optional frontmatter)

Examples you can add to `SKILL.md` frontmatter when using Claude Code only:

```yaml
disable-model-invocation: true   # only you invoke with /skill-name
user-invocable: false            # hide from / menu; model-only
allowed-tools: Read, Grep, Glob  # restrict tools while skill is active
context: fork                    # run in subagent
agent: Explore                   # with context: fork
```

Other agents typically ignore keys they do not support; keep portable skills to `name` and `description` (and optional `argument-hint`) when one folder is shared across many products.

**Invocation recap (Claude Code)**

| Pattern | Effect |
|---------|--------|
| Default | You and the model can invoke; description helps auto-routing |
| `disable-model-invocation: true` | Manual `/skill` only; use for risky or user-gated workflows |
| `user-invocable: false` | Model can load; user doesn’t see a friendly `/` action |

---

## Further reading (examples)

Mature open-source plugin layouts with phased skills, persona catalogs, and structured review pipelines — useful for **orchestration inspiration**, not mandatory conventions:

- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) (`plugins/compound-engineering/skills/`)
