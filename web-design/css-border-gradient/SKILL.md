---
name: css-border-gradient
description: >-
  CSS border-gradient skill for masked gradient borders, outlines, and card
  frames. Use when the design needs a gradient stroke without extra wrappers.
argument-hint: "[component]"
---

# CSS border gradient

Use this skill for gradient borders built with masks or pseudo-elements.

## Focus

- Prefer a pseudo-element for the border layer.
- Keep the inner content on a separate stacking context.
- Preserve pointer events on the actual component.
- Make the border thickness and radius easy to reuse.

## Common checks

- Does the gradient border respect rounded corners?
- Does it degrade cleanly when masking is unavailable?
- Is the border decorative only?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install css-border-gradient
```

