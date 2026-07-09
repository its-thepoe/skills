---
name: threejs
description: >-
  three.js skill for scenes, cameras, renderers, loaders, lighting, performance,
  and disposal. Use when building interactive 3D UI, background scenes, or
  WebGL experiences.
argument-hint: "[3d-goal]"
---

# three.js

Use this skill for three.js scene setup, rendering loops, loaders, and cleanup.

## Focus

- Set up scene, camera, renderer, and resize handling first.
- Keep asset loading and render-loop logic separate.
- Dispose geometries, materials, textures, and controls on teardown.
- Watch performance on mobile and low-end GPUs.
- Keep animations and camera movement legible.

## Common checks

- Is the render loop stopped when the component unmounts?
- Are textures and materials disposed?
- Is DPR capped when needed?
- Are controls, listeners, and loaders cleaned up?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install threejs
```

