# Design engineering (Lovable pack)

Paste into Lovable **Project** or **Workspace** Knowledge, or into **`AGENTS.md`**. No YAML — instruction body only.

You bring **craft**: interfaces where small details compound. Taste is trained—study great UIs, reverse-engineer motion, ship defaults that feel excellent.

**Based on:** [emilkowalski/skill](https://github.com/emilkowalski/skill) (Emil Kowalski). Adapt to this codebase’s tokens and patterns.

---

## Review output (required)

For UI reviews, use a **markdown table** — not separate Before/After lines.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Avoid `all`; name properties |
| `transform: scale(0)` | `scale(0.95)` + `opacity: 0` | Nothing pops from literal zero |
| `ease-in` on dropdown | `ease-out` + custom cubic-bezier | ease-in feels sluggish on open |

---

## Should it animate?

| How often users see it | Action |
| --- | --- |
| 100+×/day (palette, shortcuts) | **No animation** |
| Often (hovers, lists) | Minimal or none |
| Sometimes (modals, drawers, toasts) | Normal motion |
| Rare / onboarding | Can add delight |

**Never animate keyboard-driven toggles** users repeat all day.

Every animation needs a purpose: spatial consistency, state change, feedback, or avoiding a jarring cut—not only “looks cool.”

---

## Easing and duration

- **Entering/leaving screen:** prefer **ease-out** (responsive first movement).
- **Moving within screen:** **ease-in-out** with a strong custom curve.
- **Hover/color:** built-in **`ease`** ~200ms.
- **Never ease-in** for “UI opens” — it delays what the user is watching.

Use custom curves (built-ins are often weak), e.g.:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

**Durations (guideline):** press feedback ~100–160ms; tooltips/small popovers ~125–200ms; menus ~150–250ms; modals/drawers ~200–500ms. **Prefer UI motion under ~300ms** unless deliberate (e.g. hold-to-delete).

---

## High-signal implementation rules

- **Buttons / pressables:** `:active { transform: scale(0.97) }` + short `transition` (e.g. 160ms ease-out).
- **Popovers:** `transform-origin` at the **trigger** (Radix/Base UI vars). **Modals** stay center-origin.
- **Don’t enter from `scale(0)`** — use ~0.9–0.95 + opacity.
- **Tooltips:** initial show delay OK; **subsequent** tooltips instant (no re-delay / no re-animation).
- **Interruptible UI:** prefer **CSS transitions** over keyframes when state flips fast (toasts, lists).
- **Performance:** animate **`transform`** and **`opacity`** when possible; avoid animating layout (`width`, `height`, `margin`, `top`).
- **Framer Motion:** for GPU-friendly motion under load, prefer `transform: "translateX(...)"` over shorthand `x`/`y` when it matters.
- **Springs:** good for drag, gestures, interruptible motion; keep bounce subtle in serious UI.
- **`prefers-reduced-motion`:** reduce motion, not every transition — keep helpful fades; drop gratuitous movement.
- **Touch:** gate hover effects: `@media (hover: hover) and (pointer: fine)`.

---

## Quick review checklist

| Issue | Fix |
| --- | --- |
| `transition: all` | Specific properties + duration + easing |
| Entry from `scale(0)` | `scale(0.95)` + `opacity` |
| `ease-in` on reveal | `ease-out` or custom |
| Popover origin center | Trigger-based origin (not modals) |
| Motion on heavy keyboard use | Remove |
| UI tween > 300ms | Shorten unless intentional |
| Hover without fine pointer | Add media query |
| Keyframes on rapid fire | Transitions |
| Heavy FM `x`/`y` jank | `transform` string |

---

## Guidelines

1. Read the actual component/CSS before judging.
2. Prefer **concrete diffs** (props, classes, CSS) in the table.
3. Match the **product tone** — playful vs enterprise motion differs.
4. Offer to **apply changes** if the user wants.
