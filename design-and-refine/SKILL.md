---
name: design-and-refine
description: >-
  Runs the 0x Designer "Design & Refine" workflow: multiple real UI variations,
  side-by-side comparison at /__design_lab, feedback-driven synthesis, then
  DESIGN_PLAN.md + DESIGN_MEMORY.md. Use when designing or redesigning a
  component/page, exploring layout/density options, unblocking direction,
  or when the user says design lab, UI variations, 0x designer, design-and-refine,
  or kylezantos/0x-designer-plugin. Prefer a quick mock or single-shot tweak
  when they only need one small change. Requires a running dev server and a
  supported web stack (see reference.md).
argument-hint: "[component or page name — optional]"
---

# Design & Refine (0x Designer workflow)

**Source:** [kylezantos/0x-designer-plugin](https://github.com/kylezantos/0x-designer-plugin) (Claude Code plugin; originates from [0xdesign](https://github.com/0xdesign) “Design and Refine”).

**What you get:** Several **distinct UI implementations** in code (not static mockups), a **comparison route** at `/__design_lab`, **iterative merge** from user feedback, then **persistent** `DESIGN_PLAN.md` and `DESIGN_MEMORY.md`. Temp dirs/routes are removed after finalize.

---

## Choose path

### A) Claude Code — official plugin (full automation)

User must use **Claude Code** with the marketplace plugin (not Cursor-only):

1. `/plugin marketplace add 0xdesign/design-plugin` — if that fails, use the repo they actually track: see [reference.md](reference.md#upstream-repos-and-marketplace).
2. `/plugin install design-and-refine@design-plugins`
3. Start: `/design-and-refine:start` or `/design-and-refine:start $ARGUMENTS`
4. Cleanup if stuck: `/design-and-refine:cleanup`

Point the user here when they have Claude Code; do not pretend Cursor runs those slash commands.

### B) Cursor / other IDEs — manual playbook (this session)

When the user is in **Cursor** (or no plugin), **emulate the workflow**:

1. **Preflight** — Detect framework (Next, Vite, Remix, Astro, CRA, etc.) and styling (Tailwind, CSS modules, MUI, Chakra, Ant Design, styled-components, Emotion) from the repo. Read tokens from `tailwind.config.*`, theme files, CSS variables.
2. **Brief** — Short interview: new vs redesign, component vs page, pain points, inspiration (e.g. “Linear density”, “Stripe clarity”), primary user tasks.
3. **Generate** — Create **~5 meaningfully different** variants (hierarchy, layout model, density, interaction pattern, visual weight). Use **their** design system; no random one-off palette unless the project does.
4. **Design Lab route** — Add a dev route so all variants render **side by side** (same pattern as plugin: `app/__design_lab` or `pages/__design_lab` depending on router). Document the URL (port from their dev server, often `localhost:3000/__design_lab`).
5. **User review** — User keeps **dev server running**; they compare in browser. Collect feedback: per-variant likes, or element-level notes if they paste structured feedback.
6. **Synthesize** — Produce one refined direction combining what worked; iterate rounds until they say stop.
7. **Finalize** — Write **`DESIGN_PLAN.md`** (implementation steps, a11y checks, testing notes) and **`DESIGN_MEMORY.md`** (style decisions for future sessions). Remove **temporary** paths (see [reference.md](reference.md#temp-vs-persistent-files)).

---

## Invariants

- **Never** leave the repo full of orphaned lab routes and `.claude-design` junk after the user says they are **done** — clean temp artifacts as part of finalize (match plugin behavior).
- **Do not** start the dev server in a blocking way unless the user asks; assume they run it.
- Variations must be **runnable code** in their stack, not screenshots-only.

---

## Handoffs

- **Tiny change** (one button, copy tweak) → skip full lab; edit inline.
- **No web UI** (CLI-only, native app) → say this workflow is for **web** frontends; offer a lighter design doc instead.

Full framework list, temp paths, tips, and upstream links: [reference.md](reference.md).
