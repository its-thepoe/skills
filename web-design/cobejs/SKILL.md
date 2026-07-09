---
name: cobejs
description: >-
  cobe.js skill for lightweight interactive globe visuals. Use when the design
  needs a simple animated earth/globe effect with low overhead.
argument-hint: "[globe]"
---

# cobe.js

Use this skill for lightweight globe visuals built with `cobe`.

## Focus

- Keep the effect minimal and fast.
- Use the lightest data/interaction model that works.
- Make teardown and resize handling explicit.
- Favor a simple loop over heavy scene complexity.

## Common checks

- Does the canvas stay responsive?
- Is the visual still readable at small sizes?
- Does the animation stop cleanly on unmount?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install cobejs
```

