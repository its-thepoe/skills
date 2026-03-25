---
name: write-a-skill
description: >-
  Authors or improves an Agent Skill (SKILL.md + optional reference/examples/scripts)
  with correct structure, frontmatter, and trigger phrases. Use when the user asks to
  create, write, add, refine, or scaffold a skill, slash command, or prompt pack; or
  to decide skill vs always-on rules (.cursor/rules, CLAUDE.md, AGENTS.md).
argument-hint: "[topic or skill name]"
---

# Write a skill

## One folder per skill

**Yes — exactly one directory per skill.** That folder is the whole skill: put **`SKILL.md` in the root of that folder**, plus optional siblings (`reference.md`, `examples.md`, `scripts/`, `package.json`, `LOVABLE.md`, etc.). Do not scatter one skill across multiple folders.

**Plugin bundles (optional):** some teams ship many skills inside a single installable plugin (e.g. `plugins/<plugin-id>/skills/<skill-name>/`). Same rule applies: **one folder per skill**, with `SKILL.md` inside. See [reference.md](reference.md#plugin-or-monorepo-layout).

## This repo (many skills)

Put each skill in its **own folder at the repo root** (kebab-case; **`name` in frontmatter** should match the folder where products require it — some allow `ce:plan`-style `name` with a different folder name; follow your target product docs). Same folder copies or symlinks into Cursor, Claude Code, Windsurf, Gemini / Antigravity, etc.

```text
<this repo>/
  README.md
  LICENSE
  write-a-skill/
    SKILL.md
    reference.md
    package.json        # optional; only if you publish this skill to npm
  another-skill/
    SKILL.md
```

**Use a skill locally:** copy or symlink `<repo>/<skill-name>/` into that product’s skills directory (see table below). Example — install `write-a-skill` for your user account on every tool you use:

```bash
SKILL_SRC="/path/to/this/repo/write-a-skill"
ln -sf "$SKILL_SRC" ~/.cursor/skills/write-a-skill
ln -sf "$SKILL_SRC" ~/.claude/skills/write-a-skill
mkdir -p ~/.config/opencode/skills
ln -sf "$SKILL_SRC" ~/.config/opencode/skills/write-a-skill
ln -sf "$SKILL_SRC" ~/.codeium/windsurf/skills/write-a-skill
# Gemini / Antigravity: confirm current path in product docs, then same pattern, e.g.
# ln -sf "$SKILL_SRC" ~/.gemini/skills/write-a-skill
```

Reload or restart each agent after adding a skill.

---

## Install this skill (copy the folder)

Same folder works for any agent that loads **Agent Skills** (`SKILL.md` + frontmatter). Typical paths:

| Product | Personal (all projects) | Project-only |
|--------|-------------------------|--------------|
| **Cursor** | `~/.cursor/skills/write-a-skill/` | `<repo>/.cursor/skills/write-a-skill/` |
| **Claude Code** | `~/.claude/skills/write-a-skill/` | `<repo>/.claude/skills/write-a-skill/` |
| **OpenCode** | `~/.config/opencode/skills/write-a-skill/` | `<repo>/.opencode/skills/write-a-skill/` |
| **Windsurf** | `~/.codeium/windsurf/skills/write-a-skill/` | `<repo>/.windsurf/skills/write-a-skill/` |
| **Antigravity / Gemini** | Often under `~/.gemini/skills/` or `~/.gemini/antigravity/skills/` — confirm in current docs | `<repo>/.agent/skills/write-a-skill/` (common) |

Each location must contain this directory with `SKILL.md` inside. Restart or reload the agent if it does not pick up a new skill immediately.

**From npm:** after `npm install write-a-skill`, copy or symlink `node_modules/write-a-skill/` to one of the paths above (folder must contain `SKILL.md`).

**Lovable:** does not use agent skill folders. This skill is for authoring **Agent Skills**; no `LOVABLE.md` is expected here. UI skills that support Lovable add **`LOVABLE.md`** next to `SKILL.md` (examples elsewhere: accessibility-review, design-engineering, family-taste).

For the open standard, see [Agent Skills](https://agentskills.io). For Claude Code–only options (subagents, `allowed-tools`, `context: fork`, `$ARGUMENTS`), see [Claude Code skills](https://code.claude.com/docs/en/skills). When authoring for **many agents**, prefer portable frontmatter (`name`, `description`, optional `argument-hint`) and add tool-specific keys only where needed.

---

## Step 1 — Establish context (ask if unclear)

**Audience**

- Engineer (Cursor, Claude Code, Windsurf, OpenCode, Antigravity, etc.) → primary deliverable is `skill-name/SKILL.md` (+ optional files).
- Non-technical or web builders (Claude.ai, v0, etc.) → add a copy-paste **prompt pack** (no repo-only paths). For **Lovable**, optional **`LOVABLE.md`** in the skill folder (not every skill needs one). See [reference.md](reference.md#prompt-pack-non-repo-users).

**Skill vs always-on rule**

- If the answer is “what should the agent *always* follow?” → prefer **rules/memory**: `.cursor/rules/`, `CLAUDE.md`, or `AGENTS.md` — not an invoked skill. Say that clearly and offer a short rule snippet instead.
- If the answer is “what should run when asked / when this task appears?” → **skill**.

**Greenfield vs brownfield vs recurring**

- One-time setup → setup flow in the skill.
- Migration → migration steps + verification.
- Ongoing workflow → checklist + idempotent steps.

---

## Step 2 — Avoid duplication

Before drafting:

- Extend or link an existing skill instead of cloning.
- If only a small section fits another skill, add a heading there and link out.
- Put long tables, full templates, and huge checklists in [reference.md](reference.md), not in this file.

---

## Step 3 — Write the skill

1. **Folder**: `skill-name/` in kebab-case; `name` in frontmatter matches product rules (often same as folder; max **64** chars, lowercase and hyphens where required).
2. **Required file**: `SKILL.md` with YAML frontmatter (`name`, `description`) and concise body.
3. **Optional siblings**: `reference.md`, `examples.md`, `scripts/`, **`references/`** (schemas, templates, catalogs — link from `SKILL.md` in one hop). See [reference.md](reference.md#supporting-files-beyond-referencemd).

**Router-quality `description` (most important)**

- Concrete **what** + **when**: real phrases users say.
- **Guards and handoffs:** when the model should **prefer another skill or step first** (“if ambiguous, use brainstorm first”), or **not** invoke this skill (“side-effect deploys: manual only” via docs + frontmatter on Claude Code).
- Avoid fluff: not “helps with”, “handles”, “manages”.
- Aim under ~500 characters if possible; hard max **1024** where enforced. See [reference.md](reference.md#description-with-guards-and-handoffs).

**Leaf vs orchestrator**

- **Leaf skill:** one clear job (e.g. format a commit message).
- **Orchestrator skill:** phased workflow that delegates to subagents, other skills, or parallel tasks. Split into multiple skills if phases are independently useful or descriptions become vague. Details: [reference.md](reference.md#leaf-vs-orchestrator-skills).

**Arguments and modes (when slash args matter)**

- Use **`argument-hint`** for autocomplete. In Claude Code, **`$ARGUMENTS`**, **`$0` / `$1`**, and optional **mode tokens** (e.g. `mode:report-only`) in the body can steer one command with multiple behaviors. Full pattern: [reference.md](reference.md#arguments-modes-and-claude-code-placeholders).

Full template, good/bad examples, invariants, and review checklist: [reference.md](reference.md).

---

## Step 4 — Review before done

**Structure**

- [ ] `SKILL.md` stays focused; heavy detail lives in `reference.md`, `examples.md`, or `references/`
- [ ] Directory name matches `name` in frontmatter (per product rules)
- [ ] No stale dates or “before August 20xx” unless in a clearly marked legacy section

**Description**

- [ ] States capability in the first sentence
- [ ] Includes “Use when …” **or equivalent** trigger coverage
- [ ] Adds **handoffs or guards** when mis-routing would waste time (see reference)
- [ ] No vague-only wording

**Content**

- [ ] Steps are ordered and verifiable
- [ ] **Invariants** stated where it matters: paths never to delete, “never run X here”, quality gates (see [reference.md](reference.md#invariants-never-rules-and-quality-gates))
- [ ] Links to team standards only if paths exist in *this* repo (or say “if present”)
- [ ] Examples are concrete

**Distribution**

- [ ] User knows whether to install under personal vs project path (table above)
- [ ] If non-repo users need it, prompt pack exists (see reference)
- [ ] If the skill should work on **Lovable**, add or update **`LOVABLE.md`** in the skill folder (condensed if Knowledge **10k** limit applies); most skills do not need this

**Multi-product (optional)**

- [ ] If the skill references a **blocking user question**, note how other CLIs expose the same idea (see [reference.md](reference.md#cross-product-interactive-prompts)) — or keep wording product-agnostic
