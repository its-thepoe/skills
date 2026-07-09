---
name: animation-on-scroll
description: >-
  Scroll reveal skill for IntersectionObserver-driven entrance animations.
  Use when content should animate into view without tying motion to every scroll
  tick.
argument-hint: "[section]"
---

# Animation on scroll

Use this skill for reveal animations driven by `IntersectionObserver`.

## Focus

- Trigger once unless the pattern genuinely needs replay.
- Keep motion short, subtle, and staggered.
- Avoid scroll handlers when observation is enough.
- Respect reduced-motion by removing or simplifying reveals.

## Common checks

- Is the element hidden before reveal?
- Does the observer disconnect cleanly?
- Are repeated entries intentional?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install animation-on-scroll
```

