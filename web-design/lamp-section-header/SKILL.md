---
name: lamp-section-header
description: >-
  Use when implementing a Linear-style lamp section header, glowing hero intro,
  or conic-gradient spotlight behind a short headline. Prefer for section
  headers and special callouts; do not use for full-page hero art or text-only
  shimmer effects.
---

# Lamp Section Header

Use this skill for a section header that feels lit from behind: a dark stage, a
bright lamp cone, and a crisp headline sitting in the glow.

## Choose the right shape

- Section header or special callout: use the lamp treatment.
- Text-only emphasis: use `text-shimmer`.
- Word-by-word entrance: use `masked-reveal` or `staggered-word-reveal`.
- Large system motion or page choreography: use `animation-systems`.

## Build rules

1. Keep the lamp as a supporting system, not the whole page.
2. Use a dark base surface with one strong accent color.
3. Center the headline inside the glow and keep line count tight.
4. Animate the lamp container and headline with soft ease-in-out motion.
5. Preserve readability in light/dark themes and on mobile.
6. Respect `prefers-reduced-motion` by flattening the motion and keeping the
   composition static.

## Defaults

- Background: near-black or deep slate.
- Accent: cyan, blue, or brand signal color.
- Headline alignment: centered.
- Headline scale: `text-4xl` to `text-7xl` depending on breakpoint.
- Motion duration: `0.8s`.
- Ease: `easeInOut`.
- Reveal trigger: `whileInView` or equivalent viewport entry.

## Common mistakes

- Letting the glow overpower the headline.
- Using too much blur or too many stacked lights.
- Making the lamp full-screen when the task only needs a section header.
- Pushing the headline into 4+ lines.
- Using this effect for paragraphs or dense content.

## Reference

See [references/component.md](references/component.md) for the component API and
copyable implementation.

