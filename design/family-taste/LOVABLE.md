# Family taste — Family Values (Lovable pack, condensed)

**Full skill** (`SKILL.md` in this folder) is **longer than Lovable’s 10,000-character Knowledge limit.** Use this file for a **single Knowledge paste**. For full checklists, code samples, and anti-pattern detail, sync the repo to GitHub and reference `family-taste/SKILL.md` from root **`AGENTS.md`**.

**Sources:** [benji.org/family-values](https://benji.org/family-values), [cristicretu/family-taste-skill](https://github.com/cristicretu/family-taste-skill). Pair with **design-engineering** for easing/duration specifics.

Apply **before** shipping UI. Order: **Simplicity → Fluidity → Delight** (you cannot fix bad structure with motion).

---

## 1. Simplicity — gradual revelation

- **One primary action per view.** Two equal CTAs = failure.
- **Progressive disclosure:** steps, sheets, expandable sections — not a wall of fields.
- **Context-preserving overlays** (sheets/modals) over full-page jumps when it keeps orientation.
- **Stacked layers:** each sheet/modal a **visibly different height**; every overlay has a **title** and **clear dismiss**.
- **Trays match context** (theme); trays may open full-screen flows.
- **Transient actions → tray; persistent destinations → full screen.**
- **Self-check:** Can the user tell what to do next in about one second?

---

## 2. Fluidity — fly, don’t teleport

- **No instant show/hide** for meaningful UI; animate with spatial sense (fade, slide, scale, morph).
- **Shared elements morph** between states (layout / shared-element transitions) — avoid unmount-remount tricks.
- **Directional consistency:** forward → content enters from the right; back → from the left (tabs/slides follow the same logic).
- **Text changes:** morph or crossfade; prefer **torph** for shared-letter morphs (`npm i torph`). **Only animate text that actually changes.**
- **Persistent chrome** must not animate out and back in during one transition.
- **Loading** should move toward where the user will look for results.
- **Chevrons / arrows** reflect state (rotate, flip direction).
- **Unified interpolation:** values driven by the same data should share easing/lerp so the UI feels like one system.
- **Default entrance easing:** `cubic-bezier(0.16, 1, 0.3, 1)`; **exits:** stronger ease-in; **avoid linear** for organic motion.
- **Self-check:** Record at **0.5×** speed — anything that “teleports” needs a transition.

---

## 3. Delight — selective emphasis

- **Rare / infrequent flows** can be more theatrical; **daily** flows stay fast and subtle.
- **Polish every surface** — settings, errors, empty states — not only marketing pages.
- **Celebrate real completions** (onboarding done, backup finished), not only a static checkmark.
- **Numbers and live charts** should animate; commas/positions should move smoothly when values change. **liveline** for live charts (`npm i liveline`).
- **Empty states** are first impressions: illustration, motion toward the primary action, warm copy — not bare “No items.”
- **Easter eggs** in places people discover naturally, not blocking core tasks.

---

## Abbreviated taste checklist

**Simplicity:** one primary action; progressive disclosure; overlay title + dismiss; stacked heights differ; user always knows where they are.

**Fluidity:** no teleport; shared morphs; directional motion; persistent elements stable; text morphs; loading travels; unified easing for related data.

**Delight:** frequency-matched delight; designed empties; animated numbers; completions feel rewarding; no “dirty bathroom” corners.

**General:** intentional typography and palette; generous spacing; avoid generic AI-slop aesthetics; interface feels like a **space**, not a slideshow.

---

## Top anti-patterns

Static tabs with no directional motion. Modals that pop from nowhere. Skeletons that don’t match final layout. Redundant animation on persistent headers. Linear easing on UI motion. Empty “No items” only. Identical-height stacked sheets. Critical outcomes only as toasts. Long forms with no steps. Spinner stays at trigger after submit.

---

## When you need the full skill

Add to **`AGENTS.md`**: “Follow `family-taste/SKILL.md` in this repository for complete checklists, examples, easing table, and pattern library.”
