---
name: gsap
description: >-
  GSAP motion skill for timelines, ScrollTrigger, staggered choreography, and
  SPA cleanup. Use when building or debugging scroll-based motion, page
  transitions, or imperative animations.
argument-hint: "[animation-goal]"
---

# GSAP

Use this skill for GSAP timelines, ScrollTrigger, staggered motion, and cleanup-heavy SPA animation work.

## Focus

- Create explicit timelines instead of scattering one-off tweens.
- Use `ScrollTrigger` for scroll-linked reveals, pinning, and progress-driven motion.
- Kill timelines, triggers, and listeners on unmount or route change.
- Prefer transform/opacity animation over layout changes.
- Keep motion short and readable unless the sequence is intentionally cinematic.

## Common checks

- Is the animation reversible and interruptible?
- Are triggers cleaned up when the view is destroyed?
- Are repeated scroll interactions debounced by design, not by accident?
- Does the motion still feel good when reduced-motion is enabled?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install gsap
```

