---
name: globe-gl
description: >-
  globe.gl skill for 3D globe data visualizations, markers, arcs, labels, and
  rendering performance. Use when the UI needs an interactive globe view.
argument-hint: "[globe-goal]"
---

# globe.gl

Use this skill for interactive globe visualizations.

## Focus

- Keep data shape simple and explicit.
- Tune labels, arcs, and markers for readability first.
- Watch texture size and render cost.
- Dispose of the globe instance cleanly when the view unmounts.

## Common checks

- Is the globe legible on mobile?
- Does the data overdraw the scene?
- Are colors and lighting readable on the target background?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install globe-gl
```

