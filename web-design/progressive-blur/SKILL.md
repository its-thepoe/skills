---
name: progressive-blur
description: >-
  Progressive blur skill for layered backdrop blur gradients from top or
  bottom. Use when softening a panel edge, header, or overlay without a hard
  cut.
argument-hint: "[surface]"
---

# Progressive blur

Use this skill for layered blur fades that build atmosphere without heavy effects.

## Focus

- Stack subtle blur layers instead of one huge blur.
- Keep blur values modest and deliberate.
- Fade blur strength with opacity or gradient masks.
- Test on low-end devices because blur is expensive.

## Common checks

- Is blur capped to a sane value?
- Does the fade read well on both light and dark backgrounds?
- Is the effect still subtle enough to feel premium?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install progressive-blur
```

