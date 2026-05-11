---
name: write-a-skill
description: >-
  Use when creating, editing, or verifying a portable Agent Skill (SKILL.md), choosing
  skill vs always-on project rules, or scaffolding a slash command or prompt pack. Typical
  asks: new skill, refine description/frontmatter, leaf vs orchestrator, install paths.
  Prefer extending an existing in-repo skill before adding a near-duplicate. Not for
  disposable one-liners with no durable SKILL structure, or for checks better enforced
  by lint/CI than prose.
argument-hint: "<skill-folder-name> [audience or goal]"
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

**Install paths, symlink commands, npm copy:** [reference.md](reference.md#install-paths-and-symlink-commands). Reload or restart each agent after adding a skill.

**Standards:** [Agent Skills](https://agentskills.io). Claude-only options (subagents, `allowed-tools`, `context: fork`, `$ARGUMENTS`): [Claude Code skills](https://code.claude.com/docs/en/skills). For **many agents**, prefer portable frontmatter (`name`, `description`, optional `argument-hint`) and add tool-specific keys only where needed.

**Patterns from community practice:** “description = discovery, body = workflow” and optional **pressure scenarios** before shipping come from [obra/superpowers `writing-skills`](https://github.com/obra/superpowers/tree/main/skills/writing-skills). This repo keeps them **optional** and product-agnostic — see [reference.md](reference.md#description-and-discovery-cso) and [reference.md](reference.md#optional-verification-pressure-scenarios).

---

## Agent workflow (do this in order)

1. **Discover** — Search the repo for existing `**/SKILL.md`. Prefer **extend or link** a skill over a near-duplicate. If the user is mining chats into durable guidance, a dedicated “preferences → skill” workflow may apply; do not overload this skill with that entire pipeline unless asked.
2. **Classify** — Leaf vs orchestrator, audience (engineer vs prompt-pack), and **skill vs rule**. See [When to create vs skip](reference.md#when-to-create-a-skill-vs-skip) and [Skill types](reference.md#skill-types-technique-pattern-reference).
3. **Draft** — Create `skill-name/SKILL.md` (+ optional siblings). Before finalizing **`description`**, read [Description and discovery (CSO)](reference.md#description-and-discovery-cso).
4. **Review** — Run **Step 4** below. For high-stakes or discipline-heavy skills, add [optional pressure scenarios](reference.md#optional-verification-pressure-scenarios).

**Deliverable:** `skill-name/SKILL.md` under this monorepo’s skill folders, plus optional `reference.md`, `examples.md`, `references/`, `scripts/`.

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

**`description` (router / discovery)**

- Lead with **when** this skill applies (symptoms, user phrases, situations). Put **workflow and process in the body**, not a long process summary inside `description` — otherwise models may follow the blurb and skip the rest. See [reference.md](reference.md#description-and-discovery-cso).
- Add **guards and handoffs** in a short clause where mis-routing is costly (without duplicating the full workflow). Examples: [reference.md](reference.md#description-with-guards-and-handoffs).
- Third person where products inject the line; avoid fluff (“helps with”, “handles”).
- Aim under ~500 characters if possible; hard max **1024** where enforced.

**Leaf vs orchestrator**

- **Leaf skill:** one clear job (e.g. format a commit message).
- **Orchestrator skill:** phased workflow that delegates to subagents, other skills, or parallel tasks. Split into multiple skills if phases are independently useful or descriptions become vague. Details: [reference.md](reference.md#leaf-vs-orchestrator-skills).

**Arguments and modes (when slash args matter)**

- Use **`argument-hint`** for autocomplete. In Claude Code, **`$ARGUMENTS`**, **`$0` / `$1`**, and optional **mode tokens** (e.g. `mode:report-only`) in the body can steer one slash command with multiple behaviors. Full pattern: [reference.md](reference.md#arguments-modes-and-claude-code-placeholders).

Full template, token-efficiency notes, and extended checklist: [reference.md](reference.md).

---

## Step 4 — Review before done

**Structure**

- [ ] `SKILL.md` stays focused; heavy detail lives in `reference.md`, `examples.md`, or `references/`
- [ ] Directory name matches `name` in frontmatter (per product rules)
- [ ] No stale dates or “before August 20xx” unless in a clearly marked legacy section

**Description**

- [ ] Leads with **when** to load (triggers/symptoms); workflow lives in the body, not a shortcut in `description` (see [CSO](reference.md#description-and-discovery-cso))
- [ ] Guards or handoffs where mis-routing is costly
- [ ] No vague-only wording

**Content**

- [ ] Steps are ordered and verifiable
- [ ] **Invariants** stated where it matters: paths never to delete, “never run X here”, quality gates (see [reference.md](reference.md#invariants-never-rules-and-quality-gates))
- [ ] Links to team standards only if paths exist in *this* repo (or say “if present”)
- [ ] Examples are concrete

**Distribution**

- [ ] Install paths documented ([reference.md](reference.md#install-paths-and-symlink-commands))
- [ ] If non-repo users need it, prompt pack exists (see reference)
- [ ] If the skill should work on **Lovable**, add or update **`LOVABLE.md`** in the skill folder (condensed if Knowledge **10k** limit applies); most skills do not need this

**Optional (high-stakes or discipline-heavy skills)**

- [ ] Ran a **pressure scenario** without the skill, then with it ([reference.md](reference.md#optional-verification-pressure-scenarios))

**Multi-product (optional)**

- [ ] If the skill references a **blocking user question**, note how other CLIs expose the same idea (see [reference.md](reference.md#cross-product-interactive-prompts)) — or keep wording product-agnostic
