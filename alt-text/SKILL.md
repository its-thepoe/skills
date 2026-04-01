---
name: alt-text
description: >-
  Scans images in a codebase for missing, empty, or low-quality alt text and
  generates context-aware alt text drafts. Presents findings in a review table
  for user approval before applying changes. Use when the user says "add alt
  text", "fix alt text", "accessibility audit images", "a11y images", or
  "missing alt". Supports Next.js (next/image), React, Astro, and Vue. Not for
  full WCAG audits beyond images — use accessibility-review if present.
argument-hint: "[scope: repo | folder path | cms]"
---

# Alt text

**Orchestrator skill:** scan → classify → draft → **review table (blocking)** → apply → verify.

Deep rules, grep patterns, decision tree, and examples: [reference.md](reference.md).

---

## Scope

If the user did not specify, ask once:

| Scope | Meaning |
|------|---------|
| **repo** | Entire project (default if they say “whole repo” or give no path) |
| **folder** | Limit to one directory (e.g. `src/components/`) |
| **cms** | Content / data only — MDX, Markdown, JSON, YAML, CMS-shaped fields |

Respect `node_modules`, build output, `.next`, `dist`, and large binary dirs — do not treat assets inside them as “source” unless the user insists.

---

## Step 1 — Detect stack

Read `package.json` (and if present `astro.config.*`, `nuxt.config.*`, `vite.config.*`) to infer which image APIs apply. If multiple stacks exist, scan with **all** relevant patterns from [reference.md](reference.md#framework-image-patterns-and-greps).

---

## Step 2 — Scan for image usages

Framework-aware search (see [reference.md](reference.md#framework-image-patterns-and-greps)):

- **Next.js:** `next/image`, `next/legacy/image`, `<Image`, `fill`, `sizes` patterns with `alt`
- **React:** `<img`, team `<Image>` wrappers
- **Astro:** `astro:assets`, `<Image`, `<Picture`
- **Vue / Nuxt:** `<img`, `:alt`, `v-bind:alt`
- **MDX / MD:** `![](...)`, `<img`
- **CMS-shaped content:** image URLs plus `alt`, `caption`, `asset`, `fields` (JSON/YAML)

For each hit, classify:

- **missing** — no `alt` attribute / no markdown alt / no CMS alt field when required
- **empty** — `alt=""` or equivalent — only OK if [decorative per decision tree](reference.md#w3c-inspired-decision-tree)
- **present** — has non-empty alt; may still be **low quality** (filename, “image”, redundant, too long)

---

## Step 3 — Decision tree (per image)

Apply [W3C-inspired decision tree](reference.md#w3c-inspired-decision-tree) **before** drafting:

- Decorative / redundant with adjacent text → propose **`alt=""`** (or keep empty) and explain
- Functional (inside link, acts as control) → alt describes **destination or action**
- Informative → short, contextual description
- Complex (chart, diagram) → short **summary** in alt; flag need for extended text elsewhere
- Text in image → transcribe when that text is unique; if duplicated nearby → may be `alt=""`

---

## Step 4 — Draft alt text

For every row that needs a new or better alt:

- Use **surrounding component / page / heading context** and filename as weak hints only
- **~125 characters** or less unless complex-image exception; front-load important words
- **Do not** start with “image of”, “photo of”, “picture of”, or “graphic of”
- Assign **confidence:** `HIGH` (clear role in context) or `LOW` (decorative vs informative unclear, brand tone unknown, unclear subject)

---

## Step 5 — Review table (mandatory stop)

Output **one** markdown table with **all** proposed changes (including “keep `alt=""`” rows you want the user to confirm):

| # | Location | Framework / kind | Current | Proposed | Confidence | Type |
|---|----------|------------------|---------|----------|------------|------|
| 1 | `path:line` | Next `<Image>` | (missing) | … | HIGH | informative |

**STOP.** Wait for explicit user approval: all, per-row edits, or skip list. Do **not** edit files until they respond.

---

## Step 6 — Apply (after approval)

Apply only approved rows using correct syntax:

- Next `<Image alt="…" />`
- React `<img alt="…" />` (or wrapper’s `alt` prop)
- Astro `<Image alt="…" />` / `<Picture>` slots per Astro docs
- Vue static images: plain `alt="…"`; use `:alt` only when value is **dynamic** from CMS/props
- Markdown: `![alt](url)`
- CMS JSON/YAML: set the project’s canonical alt field (see [reference.md](reference.md#cms-content-patterns))

Preserve formatting and conventions of each file.

---

## Step 7 — Verify

Re-scan changed files only:

- No `<img` / `<Image` without `alt` where one is required
- No accidental removal of intentional empty alts the user wanted to keep
- Markdown / MDX image syntax still valid

---

## Invariants

- Never remove or overwrite **valid** alt text without explicit user approval in the review step
- **Never** apply code or content edits before the review table and user confirmation
- Never set `alt=""` on an image that is **informative or functional** in context
- Never add “image of” / “photo of” / “picture of” filler to drafts
- Decorative images with confirmed `alt=""` are **not** defects

---

## Handoffs / out of scope

- Full-site WCAG audits, focus order, ARIA beyond images → **accessibility-review** (or project a11y skill)
- Adding new CMS schema fields, migrations, or Studio config so `alt` exists → **manual / separate task**; note in table as blocked
- No images in scope → report “no images found” and stop

---

## Install this skill (copy or symlink the folder)

| Product | Personal (all projects) | Project-only |
|--------|-------------------------|--------------|
| **Cursor** | `~/.cursor/skills/alt-text/` | `<repo>/.cursor/skills/alt-text/` |
| **Claude Code** | `~/.claude/skills/alt-text/` | `<repo>/.claude/skills/alt-text/` |
| **OpenCode** | `~/.config/opencode/skills/alt-text/` | `<repo>/.opencode/skills/alt-text/` |
| **Windsurf** | `~/.codeium/windsurf/skills/alt-text/` | `<repo>/.windsurf/skills/alt-text/` |
| **Antigravity / Gemini** | Confirm in product docs (often `~/.gemini/skills/`) | `<repo>/.agent/skills/alt-text/` (common) |

```bash
SKILL_SRC="/path/to/skills/alt-text"
mkdir -p ~/.cursor/skills ~/.claude/skills ~/.config/opencode/skills ~/.codeium/windsurf/skills
ln -sf "$SKILL_SRC" ~/.cursor/skills/alt-text
ln -sf "$SKILL_SRC" ~/.claude/skills/alt-text
ln -sf "$SKILL_SRC" ~/.config/opencode/skills/alt-text
ln -sf "$SKILL_SRC" ~/.codeium/windsurf/skills/alt-text
```

Reload or restart the agent after install.

**Standards:** [WCAG 2 — Non-text content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/), [WebAIM Alternative Text](https://webaim.org/techniques/alttext/).
