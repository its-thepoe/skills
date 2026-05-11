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

**This repo:** each skill is a **top-level folder** next to `README.md` (e.g. `write-a-skill/`, `another-skill/`). Copy or symlink that folder into each agent’s global skills path (Cursor, Claude Code, Windsurf, Gemini / Antigravity — see below).

Keep `SKILL.md` short; move bulk here.

---

## Install paths and symlink commands

Same folder works for any agent that loads **Agent Skills** (`SKILL.md` + frontmatter). Typical paths:

| Product | Personal (all projects) | Project-only |
|--------|-------------------------|--------------|
| **Cursor** | `~/.cursor/skills/<skill-name>/` | `<repo>/.cursor/skills/<skill-name>/` |
| **Claude Code** | `~/.claude/skills/<skill-name>/` | `<repo>/.claude/skills/<skill-name>/` |
| **OpenCode** | `~/.config/opencode/skills/<skill-name>/` | `<repo>/.opencode/skills/<skill-name>/` |
| **Windsurf** | `~/.codeium/windsurf/skills/<skill-name>/` | `<repo>/.windsurf/skills/<skill-name>/` |
| **Antigravity / Gemini** | Often under `~/.gemini/skills/` or `~/.gemini/antigravity/skills/` — confirm in current docs | `<repo>/.agent/skills/<skill-name>/` (common) |

Each location must contain this directory with `SKILL.md` inside. Restart or reload the agent if it does not pick up a new skill immediately.

**Symlink example** (install `write-a-skill` for your user account on several tools):

```bash
SKILL_SRC="/path/to/this/repo/write-a-skill"
ln -sf "$SKILL_SRC" ~/.cursor/skills/write-a-skill
ln -sf "$SKILL_SRC" ~/.claude/skills/write-a-skill
mkdir -p ~/.config/opencode/skills
ln -sf "$SKILL_SRC" ~/.config/opencode/skills/write-a-skill
ln -sf "$SKILL_SRC" ~/.codeium/windsurf/skills/write-a-skill
# Gemini / Antigravity: confirm current path in product docs, e.g.
# ln -sf "$SKILL_SRC" ~/.gemini/skills/write-a-skill
```

**From npm:** after `npm install @its-thepoe/write-a-skill`, copy or symlink `node_modules/@its-thepoe/write-a-skill/` to one of the paths above (folder must contain `SKILL.md`).

**Lovable:** does not use agent skill folders. Skills that target Lovable add **`LOVABLE.md`** beside `SKILL.md` where needed (see [Lovable (optional)](#lovable-optional-not-every-skill)).

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

## When to create a skill vs skip

**Create** when the technique is reusable across projects, not obvious on first read, and you expect to invoke it again. Prefer skills for **judgment-call** workflows; prefer tooling for purely mechanical checks.

**Skip** (use **`CLAUDE.md` / `AGENTS.md` / `.cursor/rules`**, lint, or a one-shot user message instead) when:

- The write-up is a **one-off** story or fix for a single session.
- The practice is **standard** and well-documented elsewhere — link out.
- The constraint is **fully mechanical** — enforce with validators or CI.
- The content is **project-only** convention — belongs in project memory/rules.

Framed in spirit after [obra/superpowers **writing-skills**](https://github.com/obra/superpowers/tree/main/skills/writing-skills); wording here stays product-agnostic.

---

## Skill types (technique, pattern, reference)

| Type | What it is | Typical `SKILL.md` body |
|------|------------|-------------------------|
| **Technique** | Concrete method with steps | Short ordered checklist + one solid example |
| **Pattern** | Mental model / framing | When it applies, when it does *not* |
| **Reference** | API, CLI, syntax, long tables | Overview in `SKILL.md`; depth in sibling files |

**Split to sibling files** when material is **~100+ lines**, when you ship **reusable scripts/templates**, or when a **JSON schema** backs orchestration. Keep principles and short patterns in `SKILL.md`.

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
- Risk: one giant skill with vague `description` → wrong invocations. Mitigation: **split phases into separate skills** when each phase is useful alone, or tighten `description` with **guards** (see [Description with guards and handoffs](#description-with-guards-and-handoffs)).

Orchestrators still benefit from **invariants** and **structured outputs** (e.g. JSON schema) when merging subagent results.

---

## Description and discovery (CSO)

The `description` field is how agents **decide whether to load** this skill. **Discovery beats abstract branding:** use concrete triggers (user phrases, symptoms, situations). Sprinkle **keywords** you would search for: error strings, tools, filenames.

### “When to use” belongs here; full workflow belongs in the body

If `description` **summarizes the process** (“do X, then Y, then Z”), models may **follow the blurb and skip** the rest of `SKILL.md`. Keep `description` to **when** the skill applies, plus **short** guards/handoffs; put step-by-step work **below** the fold in the body.

This pattern is emphasized in [obra/superpowers **writing-skills**](https://github.com/obra/superpowers/tree/main/skills/writing-skills) (community testing + “Claude search optimization” framing).

```yaml
# ❌ BAD: full process in description (shortcut replaces reading the skill)
description: Use when shipping features — write tests first, implement, then refactor

# ✅ GOOD: triggers + boundaries; steps live in SKILL.md
description: Use when implementing a feature or bugfix where tests must land before or with code changes, or the user asks for TDD-style workflow
```

Write in **third person** where the product injects the line into the system prompt. Prefer leading with **“Use when …”** when it fits. Stay within **~1024 characters** total where enforced; shorter is better.

### Cross-references between skills

- Use **plain skill names** with explicit markers: `**REQUIRED:** use skill "xyz" when …`
- Avoid **`@path/to/SKILL.md`**-style force-includes in composed stacks — they can pull huge context before it is needed.

### Token efficiency

- Keep `SKILL.md` lean; push long tables and templates here or under `references/`.
- For CLIs, link to **`--help`** instead of copying every flag.
- **One excellent example** beats many mediocre ones; avoid the same pattern in five languages.

### Optional body sections

For skills users skim before acting: **Quick reference** (table), **Common mistakes** (what goes wrong + fix), **Implementation** (numbered steps). Use **tiny flowcharts** only when a branch is genuinely confusing; otherwise use lists (obra’s flowchart guidance, same link as above).

---

## Description with guards and handoffs

The `description` is still the **router**. Besides triggers (“use when …”), strong skills add:

1. **Handoff:** “Prefer **\<other skill>** when …” (ambiguous scope, missing inputs, wrong phase).
2. **Guard:** “Do not use for …” or “Requires … before running” (only when it prevents real failures).

Keep guards **short**; do not move the whole playbook into `description` — see [CSO](#description-and-discovery-cso).

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
  Use when [triggers: symptoms, user phrases, situations]. Prefer skill "other-skill"
  when [guard / handoff]. Not for [anti-pattern]. Keep process out of this field — put
  steps in the body ([CSO](#description-and-discovery-cso)).
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

- [ ] Documented install paths for target agents (global vs project; [Install paths](#install-paths-and-symlink-commands))
- [ ] Prompt pack created if non-repo or non-engineering tools need the same behavior
- [ ] If Lovable matters for this skill: `LOVABLE.md` added in the skill folder

**Optional verification (discipline-heavy skills)**

- [ ] Pressure scenario **without** the skill: record wrong behavior or rationalizations
- [ ] Same scenario **with** the skill: behavior improves or routing is correct
- [ ] New loophole → explicit never-rule or invariant → re-check ([details](#optional-verification-pressure-scenarios))

---

## Optional verification (pressure scenarios)

**Recommended** for discipline-heavy skills (merge rules, safety gates, “always do X first”) and whenever wrong routing is expensive. **Optional** for tiny leaf skills.

Adapted from RED → GREEN → REFACTOR as applied to process docs in [obra/superpowers **writing-skills**](https://github.com/obra/superpowers/tree/main/skills/writing-skills):

1. **Baseline** — Run a compact task **without** the skill in context. Note what the model skipped, invented, or rationalized.
2. **Draft** — Make the smallest `SKILL.md` edits that address those failures. Re-run **with** the skill and compare.
3. **Tighten** — If new excuses appear, add **never-rules**, **red flags**, or **invariants**; repeat until stable.

This does **not** replace code review or product QA; it catches weak triggers and missing guardrails early.

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

- [obra/superpowers — `writing-skills`](https://github.com/obra/superpowers/tree/main/skills/writing-skills) — TDD-for-docs mindset, pressure scenarios, CSO-style descriptions (MIT; ideas summarized here with attribution).

Mature open-source plugin layouts with phased skills, persona catalogs, and structured review pipelines — useful for **orchestration inspiration**, not mandatory conventions:

- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) (`plugins/compound-engineering/skills/`)
