---
name: framer-agents
description: >-
  Use when an AI agent needs to plan, create, edit, audit, or automate a Framer
  project: native Framer Agent prompts, External Agents for Codex/Claude/Cursor,
  CMS and content work, branches, publishing review, or Framer Server API/MCP
  decisions. Do not use for canvas Code Components/Overrides or Plugin SDK work;
  hand those to framer-code-components-overrides or framer-plugins.
---

# Framer Agents

Use this skill to make deliberate, reviewable changes to a Framer project. It is an
orchestrator for Framer-native and external-agent work, not a substitute for the
specialist implementation skills named above.

## Choose the right Framer lane first

| Need | Use | Why |
| --- | --- | --- |
| Visual, one-off canvas work; live co-editing; screenshot-led refinement | **Native Framer Agent** | It sees the open canvas, selected context, assets, and existing styles. |
| Repeatable work, local files, APIs, custom skills, reports, bulk CMS/localization/redirect updates | **External Agent** | Codex, Claude Code, Cursor, etc. can connect to one authorized project and use the local workflow. |
| A server-side scheduled integration or a tool for another system (Slack, CI, internal app) | **Server API**; optionally build an **MCP server** | Runs without opening the Framer editor. Server API is beta; secure and test it accordingly. |
| React component or override placed on the Framer canvas | `framer-code-components-overrides` | Different runtime and API surface. |
| In-editor plugin, especially a managed CMS sync | `framer-plugins` | Different SDK, permissions, and lifecycle. |

**MCP rule:** do not add a third-party or custom Framer MCP merely to connect an
external agent. Framer's supported bridge is `@framer/agent`; it provides direct
project access without manual MCP setup. Build MCP only when the product itself
needs to expose Framer automation as tools to another MCP-capable client.

## Non-negotiable operating rules

1. Identify the exact project, page(s), component(s), CMS collection(s), locale(s),
   and desired public outcome before editing. Never infer a collection from a
   similar name.
2. Inspect first. For a visual request, inspect the page and relevant components;
   for a data request, report the current collection/field/item state before a
   bulk mutation.
3. Make one coherent change set at a time. State the scope and the acceptance
   criteria before applying it.
4. Treat CMS writes, redirect changes, localization, code changes, deletion, and
   publishing as high-impact. Preview the proposed records/changes and obtain an
   explicit go-ahead when the request did not already authorize the mutation.
5. Do not publish by default. External-Agent changes are reviewed through Framer's
   branch flow; test responsive layouts and content states, then merge/publish only
   when asked.
6. Preserve the system: reuse existing styles, components, layout primitives,
   variables, and content conventions unless the task explicitly asks to replace
   them. Do not create near-duplicate styles or unbound text styles as a shortcut.
7. Do not claim that a CMS item is public merely because it is not a draft. A public
   site reflects the last published version, not every current editor-side CMS
   change. Verify publication state when user-facing counts or live-site parity
   matter.

## Setup: External Agent

Use this only when working from Codex, Claude Code, Cursor, Antigravity CLI, or a
similar tool-capable agent.

1. Run `npx @framer/agent setup` in the local agent environment.
2. Invoke the installed `/framer` skill.
3. In the browser authorization flow, connect only the intended Framer project.
4. Confirm the connection by reading harmless project context first (for example,
   list pages, branches, or collections).
5. Tell the user that the agent can read/write the connected project's canvas,
   components, and CMS through the authorized project connection, but should not be
   treated as having access to unrelated projects, billing, or account settings.
   Access can be revoked.

If setup cannot run, do not invent an MCP configuration. Explain that Framer's
official bridge must be installed/authorized, then proceed only with planning or
local, non-Framer work.

## Working workflow

### 1. Turn a request into a Framer change brief

Before acting, capture:

- **Target:** project, page/route, selected section, component, collection, locale.
- **Job:** create, revise, audit, migrate, sync, or publish.
- **Source of truth:** existing component/style/CMS fields, supplied copy/assets,
  URL/API/local file, or a reference image.
- **Constraints:** preserve structure, responsive breakpoints, accessibility,
  SEO, performance, localization, CMS schema, and publishing scope.
- **Acceptance checks:** observable outcome at desktop and mobile; empty/loading/
  long-content states where relevant; exact CMS items/fields affected.

Ask one focused question only when a missing choice would materially change the
result. Otherwise choose the smallest safe scope and name the assumption.

### 2. Gather context deliberately

Native Agent:

- Select the intended section before prompting to constrain edits.
- Attach reference images for visual hierarchy/style and the actual assets for any
  logos, product images, photographs, or artwork that must be used.
- For an interaction recreation, provide both a screenshot and a live URL.

External Agent:

- Inspect relevant pages, layers, shared components, styles, CMS schemas, and
  existing content before proposing changes.
- Read local data/APIs before mapping them into Framer.
- For large or uncertain work, request an analysis and plan first; do not mutate
  until the target mapping has been reviewed.

### 3. Prompt with constraints, not adjectives

Use this shape:

```text
Goal: [specific user-facing outcome]
Scope: [exact page/section/component/collection and locale]
Source of truth: [existing component/styles/assets/data source]
Preserve: [what must not change]
Implement: [layout/content/behavior/data mapping]
Responsive behavior: [desktop/tablet/mobile expectations]
Acceptance checks: [concrete visual, content, and functional checks]
Do not: [out-of-scope changes]
```

Avoid prompts such as “make it better,” “make it premium,” or “polish the site.”
Translate them into measurable decisions: hierarchy, spacing scale, text styles,
contrast, component reuse, breakpoint behavior, and exact copy changes.

### 4. Apply in the right order

1. Structure and content model: pages, section order, components, CMS fields.
2. Layout: hierarchy, containers, grid/stack, responsive intent.
3. Styling: variables/styles first, then component-specific details.
4. Content and assets: real content wherever available; never leave accidental
   placeholder copy or fake CMS records.
5. Behavior: navigation, interactions, forms, redirects, code only when required.
6. Quality pass: content states, mobile, accessibility, SEO, and regression review.

For a design-system migration, make a mapping table first. For CMS imports/syncs,
match on a stable identifier (normally slug or external ID), list create/update/
skip/delete behavior, and keep newly imported items as drafts unless instructed
otherwise.

### 5. Verify, report, then publish only if authorized

Report:

- What changed and where.
- What was intentionally preserved.
- Exact CMS counts/records affected and whether they are draft, current editor
  content, or confirmed on the published site.
- Responsive, content-state, accessibility, and interaction checks performed.
- Remaining manual review or publishing step.

Use a Framer branch for meaningful external-agent changes. Review the branch in
Framer, merge only after acceptance, then publish only when explicitly requested.

## High-value playbooks

### Visual page or section generation

1. Inspect adjacent sections, shared header/footer, page grid, text styles,
   component library, and existing breakpoints.
2. State the information hierarchy and responsive layout plan.
3. Build with reusable components and bound styles; use supplied assets.
4. Verify desktop/mobile and ensure the section does not alter unrelated pages.

### Screenshot-led recreation

1. Identify what the screenshot proves (visual layout) and what it does not
   (responsive rules, hover, motion, content states).
2. Request or inspect a live reference URL when interaction fidelity matters.
3. Reconstruct the system—not a pixel-only desktop snapshot—using Framer layouts,
   variables, components, and realistic content.
4. Compare target view and responsive views; report deliberate deviations.

### CMS creation, migration, or cleanup

1. Inspect current schema, references, dynamic pages, filters, and existing items.
2. Present a field mapping and a record action preview: create/update/skip/delete.
3. Confirm the stable matching key and draft/publish policy.
4. Apply the smallest batch; validate relationships, slugs, images, locale values,
   and dynamic-page rendering.
5. Report results with counts and exceptions. Never bulk-delete unmatched data
   unless the request explicitly authorizes it and a reversible path is clear.

### Public CMS counts and labels

Use this playbook for UI such as `Show all (N)`, category counts, collection totals,
or badges that must match what visitors can see.

1. Identify the collection, filters, locale, and route/context that define the count.
   A collection total is different from a filtered list total.
2. Choose and state the count source:
   - **Editor count:** all current CMS items matching the filter in the editor.
   - **Non-draft count:** current CMS items matching the filter that are not drafts.
   - **Published-site count:** items visible in the most recently published site.
3. Use **published-site count** for visitor-facing labels unless the user explicitly
   wants editor/admin counts.
4. If an exact published-site count is required and the Server API or agent context
   cannot prove it, verify against the published page/API output or state the
   limitation before implementing.
5. For a Framer Code Component or Override count display, hand off to
   `framer-code-components-overrides` after defining the source, API endpoint, and
   caching policy. Do not put React override implementation details in this skill.

### Content at scale

Use a structured source (CSV, JSON, API, local content files) and map it to an
existing CMS schema. Keep tone, title casing, taxonomy, alt text, SEO fields, and
locales consistent. Sample representative entries before a whole-collection write.

### Audit and polish

Audit first; do not silently “improve” everything. Check:

- hierarchy, spacing/alignment, typography, color/contrast, and asset quality;
- component and style duplication; unbound styles; inconsistent buttons/cards;
- desktop, tablet, mobile, long-copy, empty, and CMS edge states;
- links, navigation, forms, redirects, alt text, page title/description;
- load-sensitive embeds, unnecessary code, and unexpected regressions.

Return findings grouped as **must fix**, **recommended**, and **optional**. Apply
only the approved group or the user-authorized scope.

### External data and automation

Use an External Agent when local files/APIs/custom skills are involved. Use the
Server API for unattended jobs, scheduled syncing, or an integration that must run
without a Framer editor open. Keep credentials server-side, use least privilege,
log each operation, and test with drafts/non-production data before publishing.

## Prompt starters

See [references/prompt-pack.md](references/prompt-pack.md) for copy-ready native
and external prompts. See [references/framer-agents-research.md](references/framer-agents-research.md)
for the official-source research, capability boundaries, and update links.

## Final quality gate

Before handoff, verify all applicable items:

- [ ] Correct Framer lane chosen; no unnecessary MCP server or wrong SDK.
- [ ] Exact project and scope confirmed; no unrelated components/pages touched.
- [ ] Existing design system and CMS conventions reused or a deliberate migration
      was approved.
- [ ] Visual work tested at relevant breakpoints and content states.
- [ ] CMS field mapping, draft state, item counts, and public publication state
      are accurately distinguished.
- [ ] Destructive, bulk, redirect, code, and publish actions were authorized.
- [ ] Branch/review/handoff notes make the change easy to verify or revert.
