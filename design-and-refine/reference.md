# Design & Refine — reference

## One-line memory

**Compare several real UI builds in the browser → say what you like → synthesize → write `DESIGN_PLAN.md` + `DESIGN_MEMORY.md` → delete temp lab files.**

---

## Upstream repos and marketplace

- User-linked repo: [github.com/kylezantos/0x-designer-plugin](https://github.com/kylezantos/0x-designer-plugin)
- README mentions marketplace: `0xdesign/design-plugin`, plugin install: `design-and-refine@design-plugins`.
- Attribution: [0xdesign / 0xdesigner](https://github.com/0xdesign).

If marketplace names change, follow the **main README** of the repo the user trusts.

---

## Supported stacks (from upstream README)

**Frameworks:** Next.js (App & Pages), Vite (React, Vue), Remix, Astro, Create React App.

**Styling:** Tailwind CSS, CSS Modules, Material UI, Chakra UI, Ant Design, styled-components, Emotion.

---

## Temp vs persistent files

| Phase | Paths / artifacts |
|-------|-------------------|
| During session | `.claude-design/` (variants, previews, brief), `app/__design_lab/` or `pages/__design_lab` (or framework-equivalent comparison route) |
| After finalize | **Keep:** `DESIGN_PLAN.md`, `DESIGN_MEMORY.md`. **Remove:** temp design folder and `__design_lab` route unless the team wants to keep the route for demos (default: **remove** to match plugin) |

---

## Design Lab URL

Typically `http://localhost:3000/__design_lab` — use the project’s real port and dev command from `package.json` / docs.

---

## Interactive feedback (plugin UI)

The upstream plugin includes a **Figma-style overlay** (Add Feedback → click elements → submit → paste in terminal). When emulating in Cursor, ask the user to either:

- Paste free-form “what I like per variant”, or  
- Paste structured notes if they use any overlay you add.

---

## Tips (from upstream)

- Be specific in the brief; reference products they admire.
- Don’t stop after round one — synthesis pass matters.
- Dev server must already be running.
- Read `DESIGN_PLAN.md` after finalize for implementation and a11y/test notes.

---

## Install this skill (Cursor, etc.)

Symlink or copy the folder `design-and-refine/` into the IDE’s skills directory (see `write-a-skill` in the same repo for paths).
