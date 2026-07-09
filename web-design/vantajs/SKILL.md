---
name: vantajs
description: >-
  Vanta.js skill for animated WebGL backgrounds with proper cleanup and
  performance checks. Use when you want atmosphere without building a full 3D
  scene.
argument-hint: "[background]"
---

# Vanta.js

Use this skill for Vanta-style animated WebGL backgrounds.

## Focus

- Keep the background decorative and non-essential.
- Configure performance settings for low-end devices.
- Stop the effect and remove listeners on teardown.
- Avoid making content unreadable over the background.

## Common checks

- Does the animation look okay when reduced motion is enabled?
- Is the effect stopped on route change?
- Does the overlay content remain legible?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install vantajs
```

