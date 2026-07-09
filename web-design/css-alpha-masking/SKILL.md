---
name: css-alpha-masking
description: >-
  CSS alpha masking skill for edge fades with mask-image gradients. Use when a
  design needs horizontal or vertical soft fades without extra DOM.
argument-hint: "[component]"
---

# CSS alpha masking

Use this skill for `mask-image` edge fades and soft transparency transitions.

## Focus

- Use `mask-image` for fade-ins and fade-outs on edges.
- Keep the effect decorative and predictable.
- Check browser support and provide a fallback when needed.
- Prefer simple linear gradients for readable fades.

## Common checks

- Is the fade direction correct?
- Does the component still work without masking support?
- Does the mask clip useful content unexpectedly?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install css-alpha-masking
```

