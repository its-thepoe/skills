---
name: text-shimmer
description: >-
  Use when implementing shimmering text, gradient text, animated headline
  highlights, or viewport-triggered shimmer effects in React or web UI. Prefer
  masked-reveal or staggered-word-reveal for word-by-word motion, and
  framer-code-components-overrides for Framer canvas code.
---

# Text Shimmer

Use this skill for text that should feel premium and animated without losing
readability.

## Choose The Right Shape

- React app: use a small `ShimmeringText` component with Motion and viewport
  detection.
- Static page: use CSS `background-position` animation if there is no React
  runtime.
- Framer canvas code: hand off to `framer-code-components-overrides` if the
  shimmer lives on a code component or override.
- Word-by-word or line-by-line reveal: use `masked-reveal` or
  `staggered-word-reveal` instead of shimmer.

## Defaults

- Duration: `2s`
- Delay: `0`
- Repeat: `true`
- Repeat delay: `0.5s`
- Start on view: `true`
- Once: `false` for looping badges, `true` for one-time hero reveals
- Spread: `2`
- Use theme tokens or CSS custom properties for base and shimmer colors.

## Build Rules

1. Keep the text in the DOM and readable with JavaScript off.
2. Use `background-clip: text` with a gradient band and a solid base layer.
3. Animate `background-position` only; do not animate layout, blur, or scale.
4. Gate the effect with viewport entry when the animation is reveal-like.
5. Respect `prefers-reduced-motion`: show static text and skip the shimmer loop.
6. Test short labels, long headings, and both light and dark themes.

## Common Mistakes

- Hiding the text before JavaScript mounts.
- Making the shimmer too wide for short copy.
- Using the effect on long paragraphs or inline links.
- Letting contrast collapse in dark mode.
- Repeating forever when the user only needs a one-time entrance.

## Reference

See [references/component.md](references/component.md) for the component API and
copyable implementation.

